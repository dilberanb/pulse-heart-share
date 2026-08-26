import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Shield } from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";

export const Route = createFileRoute("/politikalar")({
  head: () => ({
    meta: [
      { title: "Gizlilik Politikası — Nabız" },
      {
        name: "description",
        content: "Nabız uygulamasının gizlilik politikası ve kişisel veri işleme koşulları.",
      },
      { property: "og:title", content: "Gizlilik Politikası — Nabız" },
      { property: "og:description", content: "Verileriniz nasıl korunuyor, nasıl işleniyor." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
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
            <Shield className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-semibold tracking-tight">Gizlilik Politikası</h1>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">Son güncelleme: 26 Ağustos 2026</p>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">1. Giriş</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Nabız ("Uygulama"), duygusal, bedensel ve durumsal hâlinizi sevdiklerinizle paylaşmanızı
            sağlayan bir durum paylaşım platformudur. Bu Gizlilik Politikası, Uygulamayı
            kullandığınızda kişisel verilerinizin nasıl toplandığını, kullanıldığını, saklandığını
            ve paylaşıldığını açıklamaktadır.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">2. Toplanan Veriler</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Uygulamayı kullandığınızda aşağıdaki veriler işlenebilir:
          </p>
          <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
            <li>
              <strong className="text-foreground">Hesap bilgileri:</strong> Ad soyad, e-posta adresi
              ve profil fotoğrafı (varsa).
            </li>
            <li>
              <strong className="text-foreground">Durum paylaşımları:</strong> Paylaştığınız duygusal
              ve durumsal hâl bilgileri, mesajlar ve seçtiğiniz emojiler.
            </li>
            <li>
              <strong className="text-foreground">Konum verisi:</strong> Acil durum (SOS) durumunda
              yakınlardaki kişilere iletilebilir. Normal kullanımda konum toplanmaz.
            </li>
            <li>
              <strong className="text-foreground">Cihaz bilgileri:</strong> Tarayıcı türü, işletim
              sistemi ve cihaz türü (istatistik amaçlı).
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">3. Verilerin Kullanımı</h2>
          <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
            <li>Hizmeti sunmak ve geliştirmek.</li>
            <li>Durum paylaşımlarınızı yalnızca seçtiğiniz gizlilik çemberindeki kişilere göstermek.</li>
            <li>Acil durum bildirimlerini ilgili kişilere iletmek.</li>
            <li>Uygulama içi deneyimi kişiselleştirmek.</li>
            <li>Teknik sorunları tespit etmek ve çözmek.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">4. Gizlilik Çemberleri</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Nabız, paylaşımlarınızı üç farklı gizlilik çemberi ile kontrol etmenizi sağlar:
          </p>
          <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
            <li>
              <strong className="text-foreground">Herkes:</strong> Tüm bağlantılarınız görebilir.
            </li>
            <li>
              <strong className="text-foreground">Yakın Arkadaşlar:</strong> Yalnızca yakın
              arkadaşlarınız görebilir.
            </li>
            <li>
              <strong className="text-foreground">Çekirdek (Aile):</strong> Yalnızca çekirdek
              aile üyeleriniz görebilir.
            </li>
          </ul>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Varsayılan gizlilik ayarınızı dilediğiniz zaman Ayarlar sayfasından
            değiştirebilirsiniz.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">5. Veri Saklama</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Durum paylaşımlarınız paylaşım tarihinden itibaren 24 saat sonra otomatik olarak
            silinir. Hesap bilgileriniz, hesabınız aktif kaldığı sürece saklanır. Hesabınızı
            sildiğinizde tüm kişisel verileriniz kalıcı olarak silinir.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">6. Veri Güvenliği</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Kişisel verileriniz endüstri standartlarında şifreleme ve güvenlik önlemleriyle
            korunmaktadır. Verileriniz HTTPS üzerinden aktarılır ve sunucularımızda şifreli olarak
            saklanır. Ancak internet üzerinde hiçbir iletim yönteminin %100 güvenli olmadığını
            lütfen unutmayın.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">7. Üçüncü Taraf Hizmetler</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Uygulama, altyapı sağlamak amacıyla güvenilir üçüncü taraf hizmet sağlayıcıları
            kullanabilir (örn. Supabase, Cloudflare). Bu sağlayıcılar yalnızca hizmetin sunulması
            amacıyla verilere erişebilir ve kendi gizlilik politikalarına tabidir.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">8. Haklarınız (KVKK)</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında aşağıdaki haklara
            sahipsiniz:
          </p>
          <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
            <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme.</li>
            <li>İşlenen kişisel verileriniz hakkında bilgi talep etme.</li>
            <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme.</li>
            <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme.</li>
            <li>Kişisel verilerinizin eksik veya yanlış işlenmiş olması hâlinde düzeltilmesini isteme.</li>
            <li>Kişisel verilerinizin silinmesini veya yok edilmesini isteme.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">9. İletişim</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Bu Gizlilik Politikası hakkında sorularınız varsa veya haklarınızı kullanmak
            istiyorsanız lütfen bizimle iletişime geçin:
          </p>
          <p className="text-sm text-muted-foreground">
            E-posta: <span className="text-primary">gizlilik@nabiz.app</span>
          </p>
        </section>
      </div>
    </AppShell>
  );
}
