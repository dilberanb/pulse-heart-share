import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Activity, AlertTriangle, Settings, Users } from "lucide-react";

import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";

const NAV_ITEMS = [
  { to: "/", label: "Nabız", Icon: Activity },
  { to: "/cevrem", label: "Çevrem", Icon: Users },
  { to: "/ayarlar", label: "Ayarlar", Icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const openSos = useAppStore((s) => s.openSos);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Masaüstü kenar çubuğu — ince ve profesyonel */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-56 flex-col border-r border-border bg-sidebar md:flex">
        <Brand />

        <nav className="mt-6 flex flex-1 flex-col gap-0.5 px-3">
          {NAV_ITEMS.map(({ to, label, Icon }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground",
                pathname === to && "bg-sidebar-accent text-sidebar-foreground",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="px-3 pb-4">
          <SosButton onClick={openSos} />
        </div>
      </aside>

      {/* Mobil üst başlık */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/90 px-4 py-2.5 backdrop-blur-md md:hidden">
        <Brand />
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            aria-label="Acil durum bildir"
            onClick={openSos}
            className="min-h-10 min-w-10 rounded-lg text-sos hover:bg-sos/10"
          >
            <AlertTriangle className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="md:pl-56">
        <div className="hidden justify-end px-5 pt-3 md:flex">
          <ThemeToggle />
        </div>
        <main className="mx-auto w-full max-w-5xl px-4 pt-4 pb-24 md:px-5 md:pb-8">
          {children}
        </main>
      </div>

      {/* Mobil alt gezinme */}
      <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-4 items-center border-t border-border bg-background/95 px-2 pt-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-md md:hidden">
        {NAV_ITEMS.map(({ to, label, Icon }) => (
          <Link
            key={to}
            to={to}
            className={cn(
              "flex min-h-10 flex-col items-center gap-0.5 rounded-lg py-1.5 text-[10px] font-medium text-muted-foreground",
              pathname === to && "text-primary",
            )}
          >
            <Icon className="h-[18px] w-[18px]" />
            {label}
          </Link>
        ))}
        <button
          type="button"
          onClick={openSos}
          className="mx-auto flex min-h-10 min-w-10 flex-col items-center justify-center gap-0.5 rounded-lg py-1.5 text-[10px] font-semibold text-sos"
        >
          <AlertTriangle className="h-[18px] w-[18px]" />
          SOS
        </button>
      </nav>
    </div>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-2.5 border-b border-border px-4 py-3.5">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
        <PulseIcon className="h-4 w-4" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold tracking-tight">Nabız</span>
        <span className="block truncate text-[10px] leading-tight text-muted-foreground">
          Acil Durum Takip
        </span>
      </span>
    </div>
  );
}

function PulseIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M2 12h4l3-9 4 18 3-9h6" />
    </svg>
  );
}

function SosButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className="h-10 w-full gap-2 rounded-lg border-2 border-sos bg-sos/10 font-semibold text-sos transition-colors hover:bg-sos/20"
    >
      <AlertTriangle className="h-4 w-4" />
      SOS
    </Button>
  );
}
