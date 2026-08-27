import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Activity, AlertTriangle, MapPin, Settings, ShieldCheck, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";

const NAV_ITEMS = [
  { to: "/", label: "Nabız", Icon: Activity },
  { to: "/cevrem", label: "Çevrem", Icon: Users },
  { to: "/guvenli", label: "Güvenli Mod", Icon: ShieldCheck },
  { to: "/deprem", label: "Deprem", Icon: MapPin },
  { to: "/ayarlar", label: "Ayarlar", Icon: Settings },
] as const;

const MOBILE_NAV_ITEMS = [
  { to: "/", label: "Nabız", Icon: Activity },
  { to: "/cevrem", label: "Çevrem", Icon: Users },
  { to: "/guvenli", label: "Güvenli Mod", Icon: ShieldCheck },
  { to: "/deprem", label: "Deprem", Icon: MapPin },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const openSos = useAppStore((s) => s.openSos);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Desktop sidebar — dark slate-900 */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-56 flex-col border-r border-border bg-[#0b1120] md:flex">
        <Brand />

        <nav className="mt-6 flex flex-1 flex-col gap-0.5 px-3">
          {NAV_ITEMS.map(({ to, label, Icon }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800/60 hover:text-slate-200",
                pathname === to && "bg-slate-800 text-white",
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

      {/* Mobile header */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-[#0b1120]/95 px-4 py-2.5 backdrop-blur-md md:hidden">
        <Brand />
        <Button
          variant="ghost"
          size="icon"
          aria-label="Acil durum bildir"
          onClick={openSos}
          className="min-h-10 min-w-10 rounded-lg text-sos hover:bg-sos/10"
        >
          <AlertTriangle className="h-5 w-5" />
        </Button>
      </header>

      <div className="md:pl-56">
        <main className="mx-auto w-full max-w-5xl px-4 pt-4 pb-24 md:px-5 md:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-20 flex items-stretch border-t border-border/50 bg-[#0b1120]/95 px-2 pt-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-md md:hidden">
        {MOBILE_NAV_ITEMS.map(({ to, label, Icon }) => (
          <Link
            key={to}
            to={to}
            className={cn(
              "flex flex-1 flex-col items-center gap-0.5 rounded-lg py-1.5 text-[10px] font-medium text-slate-400",
              pathname === to && "text-white",
            )}
          >
            <Icon className="h-[18px] w-[18px]" />
            {label}
          </Link>
        ))}
        <button
          type="button"
          onClick={openSos}
          className="flex flex-1 flex-col items-center justify-center gap-0.5 rounded-lg py-1.5 text-[10px] font-semibold text-sos"
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
    <div className="flex items-center gap-2.5 border-b border-border/50 px-4 py-3.5">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
        <PulseIcon className="h-4 w-4" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold tracking-tight text-white">Nabız</span>
        <span className="block truncate text-[10px] leading-tight text-slate-500">
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
