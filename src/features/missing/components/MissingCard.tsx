import { forwardRef } from "react";
import type { MissingProfile } from "@/features/missing/types";

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function todayTR() {
  return new Date().toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Paylaşıma hazır kayıp kimlik kartı.
 * Ekran görüntüsü alınabilir / PNG olarak indirilebilir ve sosyal medyada
 * veya yetkililerde paylaşılabilir. whitebackground, sabit tasarım.
 */
export const MissingCard = forwardRef<HTMLDivElement, { profile: MissingProfile }>(
  function MissingCard({ profile }, ref) {
    return (
      <div
        ref={ref}
        className="w-full max-w-sm overflow-hidden rounded-2xl border-2 border-red-500 bg-white text-slate-900"
      >
        {/* KAYIP banner */}
        <div className="flex items-center justify-between bg-red-600 px-4 py-2.5">
          <span className="text-lg font-black tracking-widest text-white">⚠️ KAYIP</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-red-100">
            {profile.kind === "pet" ? "Evcil Hayvan" : "Kayboldu"}
          </span>
        </div>

        {/* Foto + temel bilgiler */}
        <div className="flex items-center gap-4 p-4">
          <div className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-xl bg-slate-100 text-5xl">
            {profile.photo ? (
              <img src={profile.photo} alt={profile.name} className="h-full w-full object-cover" />
            ) : (
              profile.emoji ?? <span className="text-2xl font-bold text-slate-400">{initials(profile.name)}</span>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-xl font-black leading-tight">{profile.name}</p>
            <p className="text-sm font-semibold text-slate-600">
              {profile.subtitle} · {profile.ageLabel}
            </p>
            {profile.detail && <p className="text-sm text-slate-500">{profile.detail}</p>}
            <span className="mt-1.5 inline-block rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-bold text-red-700">
              {profile.lastSeenPlace} · {profile.lastSeenTime}
            </span>
          </div>
        </div>

        {/* Açıklama */}
        <div className="px-4 pb-3">
          <p className="text-sm leading-relaxed text-slate-700">{profile.description}</p>
        </div>

        {/* İletişim + adres */}
        <div className="space-y-1.5 border-t border-slate-200 bg-slate-50 px-4 py-3 text-sm">
          <p className="font-semibold text-slate-800">
            📞 İletişim: <span className="font-black">{profile.contact}</span>
          </p>
          <p className="text-slate-600">📍 Son görüldüğü yer: {profile.lastSeenPlace}</p>
          <p className="text-slate-600">🏠 Eve ait: {profile.homeAddress}</p>
          <p className="pt-0.5 text-xs font-medium text-slate-400">
            Nabız · İlan tarihi {todayTR()}
          </p>
        </div>
      </div>
    );
  },
);
