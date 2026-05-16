import { useState, type ReactNode } from 'react';
import type { AppConfig } from '../../lib/config';
import type { HistoryEntry } from '../../lib/types';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface Props {
  config: AppConfig;
  entries: HistoryEntry[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
  children: ReactNode;
}

export function AppShell({ config, entries, activeId, onSelect, onNew, onDelete, onClearAll, children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <Header config={config} onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 overflow-hidden relative">
        {/* Desktop sidebar */}
        <div className="hidden md:flex">
          <Sidebar
            entries={entries}
            activeId={activeId}
            onSelect={(id) => { onSelect(id); setSidebarOpen(false); }}
            onNew={() => { onNew(); setSidebarOpen(false); }}
            onDelete={onDelete}
            onClearAll={onClearAll}
          />
        </div>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/40 z-30 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="fixed inset-y-14 left-0 z-40 md:hidden">
              <Sidebar
                entries={entries}
                activeId={activeId}
                onSelect={(id) => { onSelect(id); setSidebarOpen(false); }}
                onNew={() => { onNew(); setSidebarOpen(false); }}
                onDelete={onDelete}
                onClearAll={onClearAll}
              />
            </div>
          </>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
