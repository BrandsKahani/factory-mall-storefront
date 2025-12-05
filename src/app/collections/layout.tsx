// src/app/collections/[handle]/layout.tsx
import SidebarNav from "@/components/SidebarNav";

export default function CollectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full flex gap-6 px-4 lg:px-8 py-6">
      {/* LEFT SIDEBAR – only on collections pages */}
      <aside className="hidden lg:block w-64 shrink-0">
        <SidebarNav />
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
