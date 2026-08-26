import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Activity, Heart, LifeBuoy, Plus, Settings, Users } from "lucide-react";

import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";

/** Gezinme öğeleri — masaüstünde kenar çubuğu, mobilde alt bar. */
const NAV_ITEMS = [
  { to: "/", label: "Nabız", Icon: Activity },
  { to: "/cevrem", label: "Çevrem", Icon: Users },
  { to: "/ayarlar", label: "Ayarlar", Icon: Settings },
] as const;

/**
 * Mobil öncelikli uygulama kabuğu.
 * < md: üst başlık + alt gezinme çubuğu
 * >= md: sol kenar çubuğu
 */
export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const openComposer = useAppStore((s) => s.openComposer);
  const openSos = useAppStore((s) => s.openSos);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Masaüstü kenar çubuğu */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-border bg-sidebar p-5 md:flex">
        <Brand />

        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {NAV_ITEMS.map(({ to, label, Icon }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent",
                pathname === to && "bg-sidebar-accent text-sidebar-accent-foreground",
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="space-y-2">
          <Button className="h-12 w-full gap-2 rounded-2xl" onClick={openComposer}>
            <Plus className="h-4 w-4" />
            Durum paylaş
          </Button>
          <SosButton onClick={openSos} />
        </div>
      </aside>

      {/* Mobil üst başlık */}
      <header className="sticky top-0 z-20 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur-md md:hidden">
        <Brand />
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            aria-label="Acil durum bildir"
            onClick={openSos}
            className="min-h-11 min-w-11 rounded-full text-mood-urgent-ink"
          >
            <LifeBuoy className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="md:pl-64">
        {/* Masaüstünde tema anahtarı sağ üstte durur */}
        <div className="hidden justify-end px-6 pt-4 md:flex">
          <ThemeToggle />
        </div>
        <main className="mx-auto w-full max-w-6xl px-4 pt-4 pb-28 md:px-6 md:pb-10">
          {children}
        </main>
      </div>

      {/* Mobil alt gezinme + hızlı paylaşma */}
      <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-4 items-center border-t border-border bg-background/95 px-2 pt-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-md md:hidden">
        {NAV_ITEMS.map(({ to, label, Icon }) => (
          <Link
            key={to}
            to={to}
            className={cn(
              "flex min-h-11 flex-col items-center gap-1 rounded-xl py-1.5 text-[11px] font-medium text-muted-foreground",
              pathname === to && "text-primary",
            )}
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        ))}
        <button
          type="button"
          onClick={openComposer}
          className="mx-auto flex min-h-11 min-w-11 flex-col items-center justify-center gap-1 rounded-2xl bg-primary px-3 py-1.5 text-[11px] font-semibold text-primary-foreground"
        >
          <Plus className="h-5 w-5" />
          Paylaş
        </button>
      </nav>
    </div>
  );
}

function Brand() {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground">
        <Heart className="h-4.5 w-4.5" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-base font-semibold tracking-tight">Nabız</span>
        <span className="block truncate text-[11px] text-muted-foreground">
          Sevdiklerinle bağlantıda
        </span>
      </span>
    </div>
  );
}

function SosButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className="h-11 w-full gap-2 rounded-2xl border-2 border-mood-urgent bg-mood-urgent-surface font-semibold text-mood-urgent-ink hover:bg-mood-urgent-surface/80"
    >
      <LifeBuoy className="h-4 w-4" />
      Acil durum (SOS)
    </Button>
  );
}
