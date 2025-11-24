// src/components/AppShell.tsx

export default function AppShell({ sidebar, children }: {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="app-shell">
      <aside className="sidebar-nav">
        {sidebar}
      </aside>

      <main className="app-main">
        {children}
      </main>
    </div>
  );
}
