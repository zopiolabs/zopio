import { Sidebar } from "../../components/sidebar";
import { ScrollArea } from "../../components/ui/scroll-area";
import type { ReactNode } from "react";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r bg-muted/40 lg:block">
          <ScrollArea className="h-full">
            <Sidebar />
          </ScrollArea>
        </aside>
        <main className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col">
            <ScrollArea className="h-full">
              <div className="container py-6">
                {children}
              </div>
            </ScrollArea>
          </div>
        </main>
      </div>
    </div>
  );
}
