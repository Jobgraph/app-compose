import { type ReactElement, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Copy, Download, RefreshCw, FileText, Mail, BookOpen, FileBarChart, StickyNote, FileCheck, Check } from 'lucide-react';
import type { ComposeRequest, DocumentType, Tone, Length, HistoryEntry } from '../../lib/types';
import { cn, countWords } from '../../lib/utils';

interface ComposePanelProps {
  activeEntry: HistoryEntry | null;
  onGenerate: (request: ComposeRequest) => void;
  loading: boolean;
  brandColour: string;
}

const DOC_TYPES: { value: DocumentType; label: string; icon: typeof Mail }[] = [
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'letter', label: 'Letter', icon: FileText },
  { value: 'report', label: 'Report', icon: FileBarChart },
  { value: 'memo', label: 'Memo', icon: StickyNote },
  { value: 'proposal', label: 'Proposal', icon: FileCheck },
];

const TONES: { value: Tone; label: string }[] = [
  { value: 'professional', label: 'Professional' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'formal', label: 'Formal' },
  { value: 'casual', label: 'Casual' },
];

const LENGTHS: { value: Length; label: string }[] = [
  { value: 'short', label: 'Short' },
  { value: 'medium', label: 'Medium' },
  { value: 'long', label: 'Long' },
];

export function ComposePanel({ activeEntry, onGenerate, loading, brandColour }: ComposePanelProps) {
  const [brief, setBrief] = useState('');
  const [documentType, setDocumentType] = useState<DocumentType>('email');
  const [tone, setTone] = useState<Tone>('professional');
  const [length, setLength] = useState<Length>('medium');
  const [copied, setCopied] = useState(false);

  // Sync form with active entry
  useEffect(() => {
    if (activeEntry) {
      setBrief(activeEntry.request.brief);
      setDocumentType(activeEntry.request.documentType);
      setTone(activeEntry.request.tone);
      setLength(activeEntry.request.length);
    } else {
      setBrief('');
      setDocumentType('email');
      setTone('professional');
      setLength('medium');
    }
  }, [activeEntry?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const result = activeEntry?.result?.content || '';
  const canGenerate = brief.trim().length > 0 && !loading;

  function handleGenerate() {
    onGenerate({ brief: brief.trim(), documentType, tone, length });
  }

  function handleCopy() {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    const blob = new Blob([result.replace(/\*\*/g, '')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${documentType}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function renderMarkdown(text: string) {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      // Replace **bold** with <strong> tags
      const parts: (string | ReactElement)[] = [];
      let remaining = line;
      let keyIdx = 0;
      while (remaining.includes('**')) {
        const start = remaining.indexOf('**');
        if (start > 0) parts.push(remaining.slice(0, start));
        remaining = remaining.slice(start + 2);
        const end = remaining.indexOf('**');
        if (end === -1) {
          parts.push('**' + remaining);
          remaining = '';
          break;
        }
        parts.push(<strong key={keyIdx++}>{remaining.slice(0, end)}</strong>);
        remaining = remaining.slice(end + 2);
      }
      if (remaining) parts.push(remaining);

      if (line.trim() === '---') {
        return <hr key={i} className="my-3 border-border" />;
      }
      if (line.trim() === '') {
        return <br key={i} />;
      }
      if (line.startsWith('|')) {
        return <p key={i} className="font-mono text-xs">{parts}</p>;
      }
      if (line.startsWith('- ')) {
        return <li key={i} className="ml-4 list-disc">{parts.length > 0 ? parts : line.slice(2)}</li>;
      }
      if (/^\d+\.\s/.test(line)) {
        return <li key={i} className="ml-4 list-decimal">{parts.length > 0 ? parts : line.replace(/^\d+\.\s/, '')}</li>;
      }
      return <p key={i}>{parts}</p>;
    });
  }

  return (
    <div className="h-full flex flex-col lg:flex-row">
      {/* Left side — Input form */}
      <div className="lg:w-[440px] xl:w-[480px] shrink-0 border-b lg:border-b-0 lg:border-r border-border p-6 overflow-y-auto">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              What do you need written?
            </label>
            <textarea
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              placeholder="Describe the document you'd like to create..."
              className="w-full min-h-[140px] bg-background border border-input rounded-lg p-3.5 text-sm text-foreground placeholder:text-muted-foreground resize-y focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
            />
          </div>

          {/* Document type selector */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Document type
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {DOC_TYPES.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setDocumentType(value)}
                  className={cn(
                    'flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-lg border text-xs font-medium transition-all',
                    documentType === value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-input bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Tone selector */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Tone
            </label>
            <div className="flex flex-wrap gap-2">
              {TONES.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setTone(value)}
                  className={cn(
                    'px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all',
                    tone === value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-input bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Length selector */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Length
            </label>
            <div className="flex flex-wrap gap-2">
              {LENGTHS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setLength(value)}
                  className={cn(
                    'px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all',
                    length === value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-input bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={!canGenerate}
            style={{ backgroundColor: canGenerate ? brandColour : undefined }}
            className={cn(
              'w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all',
              canGenerate
                ? 'text-white hover:opacity-90 shadow-sm'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            )}
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Generate
              </>
            )}
          </button>
        </div>
      </div>

      {/* Right side — Result display */}
      <div className="flex-1 overflow-y-auto p-6">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full text-muted-foreground"
            >
              <RefreshCw className="h-8 w-8 animate-spin mb-3 text-primary" />
              <p className="text-sm">Crafting your document...</p>
            </motion.div>
          ) : result ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Toolbar */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {countWords(result)} words
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-secondary text-secondary-foreground hover:bg-muted transition-colors"
                  >
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-secondary text-secondary-foreground hover:bg-muted transition-colors"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download
                  </button>
                  <button
                    onClick={handleGenerate}
                    disabled={!canGenerate}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-secondary text-secondary-foreground hover:bg-muted transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Regenerate
                  </button>
                </div>
              </div>

              {/* Document content */}
              <div className="bg-card border border-border rounded-lg p-6 prose-sm text-foreground leading-relaxed text-sm">
                {renderMarkdown(result)}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full text-muted-foreground"
            >
              <BookOpen className="h-10 w-10 mb-3 opacity-30" />
              <p className="text-sm font-medium">No document yet</p>
              <p className="text-xs mt-1">Fill in the brief and hit Generate to get started</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
