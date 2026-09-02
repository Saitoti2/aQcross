import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNav } from "@/components/layout/BottomNav";

export const Route = createFileRoute("/_layout")({
  component: LayoutShell,
});

function LayoutShell() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">
      <AppHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
