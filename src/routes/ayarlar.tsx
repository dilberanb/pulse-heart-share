import { createFileRoute, Link } from "@tanstack/react-router";

import { AppShell } from "@/components/layout/AppShell";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PrivacySelect } from "@/features/status/components/PrivacySelect";
import { SosSheet } from "@/features/status/components/SosSheet";
import { StatusComposer } from "@/features/status/components/StatusComposer";
import { useAppStore } from "@/store/useAppStore";
import { FileText, Shield, HeartPulse, UserRound } from "lucide-react";
import { PROFILE_META, type UserProfile } from "@/types/profile";
import { cn } from "@/lib/utils";

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
  const profile = useAppStore((s) => s.profile);
  const setProfile = useAppStore((s) => s.setProfile);
  const setSeniorMode = useAppStore((s) => s.setSeniorMode);

  const changeProfile = (id: UserProfile) => {
    setProfile(id);
    setSeniorMode(id === "senior");
  };

  return (
    <AppShell>
      <div className="max-w-xl space-y-6">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight">Ayarlar</h1>
          <p className="mt-1 text-sm text-muted-foreground">Profil ve paylaşım tercihleri.</p>
        </header>

        <div className="space-y-3 rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2">
            <UserRound className="h-4 w-4 text-primary" />
            <h2 className="text-base font-bold text-foreground">Profilim</h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Arayüz ve öne çıkan araçlar seçtiğin profile göre düzenlenir. Dilediğin zaman değiştirebilirsin.
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {PROFILE_META.map((p) => {
              const active = profile === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => changeProfile(p.id)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-colors",
                    active
                      ? "border-primary bg-primary/10"
                      : "border-border hover:bg-muted/30",
                  )}
                >
                  <span className="text-2xl">{p.emoji}</span>
                  <span className={cn("text-xs font-semibold", active ? "text-primary" : "text-foreground")}>
                    {p.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

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

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Sağlık
          </p>
          <Link
            to="/tibbikart"
            className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-accent"
          >
            <HeartPulse className="h-5 w-5 text-red-500" />
            <span className="text-sm font-medium">Tıbbi Kart</span>
          </Link>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Yasal
          </p>
          <Link
            to="/politikalar"
            className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-accent"
          >
            <Shield className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Gizlilik Politikası</span>
          </Link>
          <Link
            to="/kullanim-sartlari"
            className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-accent"
          >
            <FileText className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Kullanım Şartları</span>
          </Link>
        </div>
      </div>

      <StatusComposer />
      <SosSheet />
    </AppShell>
  );
}
