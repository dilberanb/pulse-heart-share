import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, FileText } from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";

export const Route = createFileRoute("/kullanim-sartlari")({
  head: () => ({
    meta: [
      { title: "Kullanım Şartları — Nabız" },
      {
        name: "description",
        content: "Nabız uygulamasının kullanım şartları ve sorumluluk reddi beyanı.",
      },
      { property: "og:title", content: "Kullanım Şartları — Nabız" },
      { property: "og:description", content: "Nabız'ı kullanırken uyulması gereken kurallar." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="flex items-center gap-3">
          <Link
            to="/ayarlar"
            className="inline-flex items-center justify-center rounded-xl border border-border bg-background p-2 text-muted-foreground transition-colors hover:bg-accent"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-semibold tracking-tight">Kullanım Şartları</h1>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">Son güncelleme: 27 Ağustos 2026</p>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">1. Kabul</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Nabız ("Uygulamayı") kullanarak bu Kullanım Şartları'nı okuduğunuzu, anladığınızı ve
            kabul ettiğinizi beyan etmiş olursunuz. Bu şartları kabul etmiyorsanız, Uygulamayı
            kullanmamalısınız.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">2. Hizmet Tanımı</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Nabız, duygusal, bedensel ve durumsal hâlinizi seçtiğiniz kişilerle paylaşmanızı sağlayan
            bir web (ve yakında mobil) uygulamasıdır. Uygulama aşağıdaki temel özellikleri sunar:
          </p>
          <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
            <li>Durum (mikro-durum) paylaşımları ve hızlı yoklama (quickcheck) soruları.</li>
            <li>Gizlilik çemberleri ile paylaşım kontrolü.</li>
            <li>Acil durum (SOS) butonu — konum ve yardım çağrısı.</li>
            <li>Yol arkadaşlığı, "Beni Eve Götür", yaşlı ve evcil hayvan güvenlik modları.</li>
            <li>Kayıp ilanı ve paylaşıma hazır kimlik kartı.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">3. Sorumluluklar</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Uygulamayı kullanırken aşağıdaki kurallara uymayı kabul edersiniz:
          </p>
          <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
            <li>Yalnızca gerçek ve doğru bilgiler paylaşmak.</li>
            <li>Başkalarının gizliliğine ve haklarına saygı göstermek.</li>
            <li>Uygulamayı yasadışı veya zararlı amaçlar için kullanmamak.</li>
            <li>Acil durum (SOS) işlevini yalnızca gerçek acil durumlarda kullanmak.</li>
            <li>Uygulamanın altyapısına zarar verecek eylemlerde bulunmamak.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">4. Sorumluluk Reddi</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Nabız tıbbi tavsiye, teşhis veya tedavi hizmeti sunmaz. Uygulama üzerinden paylaşılan
            durum bilgileri yalnızca bilgilendirme amaçlıdır ve profesyonel tıbbi görüşün yerine
            geçmez. Acil tıbbi durumlarda 112 acil servis numarasını arayın.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">5. Fikri Mülkiyet</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Uygulamadaki tüm içerik, tasarım, logo ve yazılım kodları Nabız'a aittir veya lisans
            altında kullanılmaktadır. İzinsiz kopyalanması, çoğaltılması veya dağıtılması
            yasaktır.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">6. Hesap Askıya Alma ve Sonlandırma</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Bu şartları ihlal eden kullanıcıların hizmeti haber verilmeksizin kısıtlanabilir veya
            sonlandırılabilir. Demo sürümünde hesap ve paylaşım verileri sunucuda tutulmadığından,
            cihazdaki verilerini tarayıcı geçmişini/uygulama verisini temizleyerek ya da ilgili
            işlevde paylaşımı iptal ederek silmiş olursun.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">7. Sorumlulukların Sınırı</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Nabız, Uygulamanın kesintisiz veya hatasız çalışacağına dair garanti vermez. Teknik
            sorunlar, bakım çalışmaları veya öngörülemeyen durumlar nedeniyle hizmet geçici olarak
            kesintiye uğrayabilir. Bu tür kesintilerden dolayı oluşabilecek zararlardan sorumlu
            değiliz.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">8. Değişiklikler</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Bu Kullanım Şartları zaman zaman güncellenebilir. Önemli değişiklikler yapıldığında
            Uygulama içinde bildirim yayınlanacaktır. Güncellemelerden sonra Uygulamayı kullanmaya
            devam etmeniz, değişiklikleri kabul ettiğiniz anlamına gelir.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">9. Uygulanacak Hukuk</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Bu Kullanım Şartları Türkiye Cumhuriyeti kanunlarına tabidir. Olası uyuşmazlıklarda
            İstanbul mahkemeleri yetkilidir.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">10. İletişim</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Kullanım Şartları hakkında sorularınız için bizimle iletişime geçin:
          </p>
          <p className="text-sm text-muted-foreground">
            E-posta: <span className="text-primary">destek@nabiz.app</span>
          </p>
        </section>
      </div>
    </AppShell>
  );
}
