import { Plus, Trash2, FileText, Clock } from 'lucide-react';
import type { HistoryEntry } from '../../lib/types';
import { relativeTime } from '../../lib/utils';
import { cn } from '../../lib/utils';

interface SidebarProps {
  entries: HistoryEntry[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

const TYPE_LABELS: Record<string, string> = {
  email: 'Email',
  letter: 'Letter',
  report: 'Report',
  memo: 'Memo',
  proposal: 'Proposal',
};

export function Sidebar({ entries, activeId, onSelect, onNew, onDelete, onClearAll }: SidebarProps) {
  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col h-full">
      <div className="p-3">
        <button
          onClick={onNew}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" />
          New document
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground px-4 text-center">
            <FileText className="h-8 w-8 mb-2 opacity-40" />
            <p className="text-sm">No documents yet</p>
          </div>
        ) : (
          <ul className="space-y-1">
            {entries.map((entry) => (
              <li key={entry.id}>
                <button
                  onClick={() => onSelect(entry.id)}
                  className={cn(
                    'w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors group relative',
                    activeId === entry.id
                      ? 'bg-muted text-foreground'
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                  )}
                >
                  <p className="truncate font-medium pr-6">
                    {entry.inputPreview || 'Untitled'}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground">
                      {TYPE_LABELS[entry.request.documentType] || entry.request.documentType}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {relativeTime(entry.createdAt)}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(entry.id);
                    }}
                    className="absolute top-2.5 right-2 p-1 rounded text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {entries.length > 0 && (
        <div className="p-3 border-t border-border">
          <button
            onClick={onClearAll}
            className="w-full text-xs text-muted-foreground hover:text-destructive transition-colors py-1.5"
          >
            Clear all history
          </button>
        </div>
      )}
    </aside>
  );
}
