import { motion } from "motion/react";

import { PROFILE_META } from "@/types/profile";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

/**
 * Profil seçim ekranı (Onboarding).
 * İlk açılışta kullanıcı profilini seçene kadar tam ekran kaplar; seçim yapılınca
 * arayüz o profile göre kişiselleştirilir.
 */
export function ProfileOnboarding() {
  const profileOnboarded = useAppStore((s) => s.profileOnboarded);
  const setProfile = useAppStore((s) => s.setProfile);
  const setProfileOnboarded = useAppStore((s) => s.setProfileOnboarded);
  const setSeniorMode = useAppStore((s) => s.setSeniorMode);

  if (profileOnboarded) return null;

  function choose(profile: (typeof PROFILE_META)[number]) {
    setProfile(profile.id);
    setProfileOnboarded(true);
    // Yaşlı profili seçilince yaşlı (büyük buton) modunu varsayılan aç
    if (profile.id === "senior") setSeniorMode(true);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] overflow-y-auto bg-[#0a0e1a] px-4 py-8 text-white"
    >
      <div className="mx-auto flex min-h-full w-full max-w-2xl flex-col justify-center">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-primary text-2xl">
            <span>❤️</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Nabız&apos;a Hoş Geldin</h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-white/60">
            Burayı <strong className="text-white">sana göre</strong> kuruyoruz. Aşağıdan en uygun
            profili seç; uygulama önceliklerini ve arayüzü ona göre düzenlesin. (İstersen daha sonra
            Ayarlar&apos;dan değiştirebilirsin.)
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {PROFILE_META.map((p, i) => (
            <motion.button
              key={p.id}
              type="button"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              onClick={() => choose(p)}
              className={cn(
                "group flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition-colors hover:border-primary/50 hover:bg-white/10",
              )}
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/10 text-2xl">
                {p.emoji}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-base font-bold">{p.label}</span>
                <span className="block text-xs font-medium text-primary">{p.tagline}</span>
                <span className="mt-1 block text-xs leading-relaxed text-white/55">
                  {p.description}
                </span>
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
