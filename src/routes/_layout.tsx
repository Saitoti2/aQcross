import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { BottomNav } from "@/components/layout/BottomNav";

export const Route = createFileRoute("/_layout")({
  component: LayoutShell,
});

function LayoutShell() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      {/*
       * The shell owns the page container and horizontal padding so the
       * sidebar and content stay aligned; routes only manage their own
       * vertical rhythm.
       */}
      <div className="mx-auto flex w-full max-w-[1440px] flex-1 items-start gap-6 px-4 sm:px-6">
        {/* Desktop rail; BottomNav covers the same ground below lg. */}
        <AppSidebar />
        <main className="min-w-0 flex-1 pb-10">
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
