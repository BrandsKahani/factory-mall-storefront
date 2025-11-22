import SidebarNav from "@/components/SidebarNav";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <SidebarNav />
      <div className="app-main">{children}</div>
    </div>
  );
}
