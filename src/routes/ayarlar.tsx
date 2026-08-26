import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/layout/AppShell";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PrivacySelect } from "@/features/status/components/PrivacySelect";
import { SosSheet } from "@/features/status/components/SosSheet";
import { StatusComposer } from "@/features/status/components/StatusComposer";
import { useAppStore } from "@/store/useAppStore";

export const Route = createFileRoute("/ayarlar")({
  head: () => ({
    meta: [
      { title: "Ayarlar — Nabız" },
      {
        name: "description",
        content: "Varsayılan gizlilik çemberi ve akış tercihlerini yönet.",
      },
      { property: "og:title", content: "Ayarlar — Nabız" },
      { property: "og:description", content: "Nabız tercihlerini kendine göre ayarla." },
    ],
  }),
  component: SettingsPage,
});

/** Tercihler (Zustand tarafından tutulan istemci state'i). */
function SettingsPage() {
  const defaultPrivacy = useAppStore((s) => s.defaultPrivacy);
  const setDefaultPrivacy = useAppStore((s) => s.setDefaultPrivacy);
  const onlyActive = useAppStore((s) => s.onlyActive);
  const setOnlyActive = useAppStore((s) => s.setOnlyActive);

  return (
    <AppShell>
      <div className="max-w-xl space-y-6">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight">Ayarlar</h1>
          <p className="mt-1 text-sm text-muted-foreground">Paylaşım ve akış tercihleri.</p>
        </header>

        <div className="space-y-4 rounded-xl border border-border bg-card p-5">
          <div className="space-y-1.5">
            <Label htmlFor="default-privacy">Varsayılan gizlilik çemberi</Label>
            <PrivacySelect
              value={defaultPrivacy}
              onChange={setDefaultPrivacy}
              className="h-10 w-full rounded-lg"
              ariaLabel="Varsayılan gizlilik çemberi"
            />
          </div>

          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-t border-border pt-4">
            <div className="min-w-0">
              <Label htmlFor="settings-only-active">Sadece aktif durumları göster</Label>
              <p className="mt-0.5 text-xs text-muted-foreground">
                24 saatten eski durumları akıştan gizle.
              </p>
            </div>
            <Switch
              id="settings-only-active"
              checked={onlyActive}
              onCheckedChange={setOnlyActive}
            />
          </div>
        </div>
      </div>

      <StatusComposer />
      <SosSheet />
    </AppShell>
  );
}
