import { Link } from "@tanstack/react-router";
import {
  Brain,
  Phone,
  Shield,
  Route,
  Accessibility,
  Home,
  HeartHandshake,
  ArrowRight,
  MapPin,
  AlertTriangle,
} from "lucide-react";

import { useAppStore } from "@/store/useAppStore";
import { PROFILE_LABEL } from "@/types/profile";

/**
 * Profil tabanlı hızlı erişim panosu.
 * Kullanıcının seçtiği profile göre ana ekranın üstünde öne çıkan araçları
 * ve kısa bir karşılama mesajını gösterir.
 */
export function ProfileHub() {
  const profile = useAppStore((s) => s.profile);

  return (
    <section className="space-y-3">
      <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
        <p className="text-sm text-foreground">
          <HeartHandshake className="mr-1.5 inline h-4 w-4 text-primary" />
          Merhaba! Nabız&apos;ı <strong>{PROFILE_LABEL[profile]}</strong> profiline göre düzenledik.
        </p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">{renderTools(profile)}</div>
    </section>
  );
}

function ToolLink({
  to,
  icon,
  title,
  desc,
  accent,
}: {
  to: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  accent: string;
}) {
  return (
    <Link
      to={to}
      className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
    >
      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${accent}`}>
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1 text-sm font-bold text-foreground">
          {title}
          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </span>
        <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">{desc}</span>
      </span>
    </Link>
  );
}

function renderTools(profile: ReturnType<typeof useAppStore.getState>["profile"]) {
  switch (profile) {
    case "memory":
      return (
        <>
          <ToolLink
            to="/guvenli"
            icon={<Brain className="h-5 w-5 text-violet-400" />}
            title="Hafıza Desteği"
            desc="Kimlik kartı, hatırlatıcılar ve 'Beni Eve Götür'."
            accent="bg-violet-500/10"
          />
          <ToolLink
            to="/guvenli"
            icon={<Home className="h-5 w-5 text-sky-400" />}
            title="Beni Eve Götür"
            desc="Kaybolma anında evine dönüş yön tarifi."
            accent="bg-sky-500/10"
          />
        </>
      );
    case "child":
      return (
        <>
          <a
            href="tel:+905321234567"
            className="flex items-center gap-3 rounded-xl border-2 border-amber-400/40 bg-amber-400/10 p-4 transition-colors hover:bg-amber-400/20"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-500/20 text-2xl">
              📞
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-black text-foreground">Annemi Ara</span>
              <span className="block text-xs text-muted-foreground">Tek dokunuşla anneni ara.</span>
            </span>
          </a>
          <ToolLink
            to="/guvenli"
            icon={<Shield className="h-5 w-5 text-emerald-400" />}
            title="Güvendeyim"
            desc="Sevdiklerine anlık 'iyiyim' bildir."
            accent="bg-emerald-500/10"
          />
        </>
      );
    case "safety":
      return (
        <>
          <ToolLink
            to="/guvenli"
            icon={<Route className="h-5 w-5 text-violet-400" />}
            title="Güvenli Yol Arkadaşı"
            desc="Gece yürüyüşünde konumunu sevdiklerinle paylaş."
            accent="bg-violet-500/10"
          />
          <ToolLink
            to="/guvenli"
            icon={<MapPin className="h-5 w-5 text-red-400" />}
            title="Acil Durum & Konum"
            desc="Anlık konum paylaşımı ve SOS bildirimi."
            accent="bg-red-500/10"
          />
        </>
      );
    case "senior":
      return (
        <>
          <Link
            to="/"
            className="flex h-20 items-center justify-center gap-3 rounded-xl bg-emerald-500 text-2xl font-black text-white transition-colors hover:bg-emerald-600"
          >
            <HeartHandshake className="h-7 w-7" />
            Güvendeyim
          </Link>
          <a
            href="tel:112"
            className="flex h-20 items-center justify-center gap-3 rounded-xl bg-red-500 text-2xl font-black text-white transition-colors hover:bg-red-600"
          >
            <AlertTriangle className="h-7 w-7" />
            Yardım Lazım
          </a>
          <a
            href="tel:+905321234567"
            className="flex h-20 items-center justify-center gap-3 rounded-xl bg-amber-500 text-2xl font-black text-black transition-colors hover:bg-amber-600 sm:col-span-2"
          >
            <Phone className="h-7 w-7" />
            Ailemi Ara
          </a>
        </>
      );
    case "disabled":
      return (
        <>
          <ToolLink
            to="/guvenli"
            icon={<Accessibility className="h-5 w-5 text-blue-400" />}
            title="Erişilebilirlik"
            desc="Yüksek kontrast ve büyük, rahat dokunma alanları."
            accent="bg-blue-500/10"
          />
          <ToolLink
            to="/tibbikart"
            icon={<HeartHandshake className="h-5 w-5 text-rose-400" />}
            title="Tıbbi Kart"
            desc="Acil durumda gerekli sağlık bilgilerin hazır."
            accent="bg-rose-500/10"
          />
        </>
      );
    default:
      return (
        <>
          <ToolLink
            to="/guvenli"
            icon={<Shield className="h-5 w-5 text-emerald-400" />}
            title="Güvenli Mod"
            desc="Hafıza, erişilebilirlik, yol arkadaşlığı ve acil durum araçları."
            accent="bg-emerald-500/10"
          />
          <ToolLink
            to="/deprem"
            icon={<MapPin className="h-5 w-5 text-orange-400" />}
            title="Deprem Hazırlığı"
            desc="Tahliye planı, hazırlık durumu ve eylemler."
            accent="bg-orange-500/10"
          />
        </>
      );
  }
}
