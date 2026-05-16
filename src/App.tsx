import { useState, useCallback } from 'react';
import { Toaster, toast } from 'sonner';
import { ThemeContext } from './lib/theme';
import type { ComposeRequest, HistoryEntry } from './lib/types';
import { useThemeProvider } from './hooks/useTheme';
import { useConfig } from './hooks/useConfig';
import { getHistory, addEntry, updateEntry, deleteEntry, clearAll } from './lib/history';
import { getMockDocument } from './lib/mock';
import { AppShell } from './components/shell/AppShell';
import { ComposePanel } from './components/compose/ComposePanel';

export default function App() {
  const themeCtx = useThemeProvider();
  const { config, loading: configLoading } = useConfig();
  const [entries, setEntries] = useState<HistoryEntry[]>(() => getHistory());
  const [activeId, setActiveId] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const activeEntry = activeId ? entries.find(e => e.id === activeId) ?? null : null;

  const refreshEntries = useCallback(() => {
    setEntries(getHistory());
  }, []);

  const handleNew = useCallback(() => {
    setActiveId(null);
  }, []);

  const handleSelect = useCallback((id: string) => {
    setActiveId(id);
  }, []);

  const handleDelete = useCallback((id: string) => {
    deleteEntry(id);
    refreshEntries();
    if (activeId === id) setActiveId(null);
  }, [activeId, refreshEntries]);

  const handleClearAll = useCallback(() => {
    clearAll();
    refreshEntries();
    setActiveId(null);
  }, [refreshEntries]);

  const handleGenerate = useCallback(async (request: ComposeRequest) => {
    setGenerating(true);

    const id = activeId ?? crypto.randomUUID();
    const entry: HistoryEntry = {
      id,
      createdAt: new Date().toISOString(),
      inputPreview: request.brief.slice(0, 80),
      request,
      result: null,
      status: 'pending',
    };

    addEntry(entry);
    setActiveId(id);
    refreshEntries();

    try {
      // Simulate generation delay
      await new Promise(r => setTimeout(r, 1200));

      const content = getMockDocument(request);
      const updated: HistoryEntry = {
        ...entry,
        result: {
          documentType: request.documentType,
          tone: request.tone,
          length: request.length,
          content,
        },
        status: 'complete',
      };

      updateEntry(updated);
      refreshEntries();
      toast.success('Document generated');
    } catch {
      const errEntry: HistoryEntry = {
        ...entry,
        status: 'error',
        errorMessage: 'Failed to generate document',
      };
      updateEntry(errEntry);
      refreshEntries();
      toast.error('Failed to generate document');
    } finally {
      setGenerating(false);
    }
  }, [activeId, refreshEntries]);

  if (configLoading || !config) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!config.isConfigured && config.deploymentId !== 'local') {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-background p-6">
        <div className="text-center max-w-md space-y-4">
          <h1 className="text-2xl font-extrabold text-foreground">{config.appName}</h1>
          <p className="text-sm text-muted-foreground">This app is not yet configured. Deploy it from Jobgraph to get started.</p>
          <a href="https://app.jobgraph.com" className="inline-block px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">Go to Jobgraph</a>
        </div>
      </div>
    );
  }

  return (
    <ThemeContext value={themeCtx}>
      <AppShell
        config={config}
        entries={entries}
        activeId={activeId}
        onSelect={handleSelect}
        onNew={handleNew}
        onDelete={handleDelete}
        onClearAll={handleClearAll}
      >
        <ComposePanel
          activeEntry={activeEntry}
          onGenerate={handleGenerate}
          loading={generating}
          brandColour={config.brandColour}
        />
      </AppShell>
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: 'bg-card text-card-foreground border-border',
        }}
      />
    </ThemeContext>
  );
}
