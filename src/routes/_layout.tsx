import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNav } from "@/components/layout/BottomNav";

export const Route = createFileRoute("/_layout")({
  component: LayoutShell,
});

function LayoutShell() {
  return (
    <div className="flex min-h-screen flex-col bg-background" style={{ overflowX: "clip" }}>
      <AppHeader />
      <main className="flex min-h-0 flex-1 flex-col">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
