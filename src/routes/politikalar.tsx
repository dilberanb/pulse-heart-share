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

        <p className="text-sm text-muted-foreground">Son güncelleme: 27 Ağustos 2026</p>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">1. Giriş</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Nabız ("Uygulama"), duygusal, bedensel ve durumsal hâlinizi seçtiğiniz kişilerle
            paylaşmanızı sağlayan bir durum / konum / yardım iletişim uygulamasıdır. Bu Gizlilik
            Politikası, Uygulamayı kullandığınızda hangi verilerin işlendiğini, nerede saklandığını
            ve en önemlisi <strong className="text-foreground">nereye gönderilmediğini</strong>{""}
            açıklamaktadır.
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Mevcut sürüm bir <strong className="text-foreground">ön gösterim (demo)</strong>{""}
            sürümüdür. Bu nedenle şu an tüm veriler yalnızca kendi cihazının belleğinde tutulur;
            sunucularımıza kişisel veya konum verisi aktarılmaz.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">2. Toplanan Veriler</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Uygulamayı kullandığınızda aşağıdaki veriler işlenebilir:
          </p>
          <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
            <li>
              <strong className="text-foreground">Hesap bilgileri:</strong> Kayıt sırasında telefon
              numarası ve doğrulama (OTP) kodu kullanılır. Ad soyad, e-posta veya profil fotoğrafı
              zorunlu değildir.
            </li>
            <li>
              <strong className="text-foreground">Durum paylaşımları:</strong> Paylaştığınız duygusal
              ve durumsal hâl bilgileri ve seçtiğiniz durumlar.
            </li>
            <li>
              <strong className="text-foreground">Konum verisi:</strong> SOS, yol arkadaşlığı ve
              "Beni Eve Götür" gibi işlevlerde, yalnızca ilgili butonu kullandığınızda ve sizin
              izninizle anlık konum alınır. Konum, sunucumuza gönderilmez; hizmetin türüne göre
              harita bağlantısı olarak açılır veya (mobilde) yanınıza seçtiğiniz kişilere mesaj/SMS
              yoluyla iletilmesi için kullanılır.
            </li>
            <li>
              <strong className="text-foreground">Cihaz bilgileri:</strong> Tarayıcı türü ve işletim
              sistemi (istatistik ve uyumluluk amaçlı).
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">3. Verilerin Kullanımı</h2>
          <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
            <li>Hizmeti sunmak ve deneyimini iyileştirmek.</li>
            <li>Paylaşımlarını görüntülemeni sağlamak (istemci tarafında).</li>
            <li>Acil durum (SOS) işlevinde konum bilgisiyle harita bağlantısı üretmek veya (mobilde)
            mesaj/SMS göndermek.</li>
            <li>Kayıp kimlik kartı oluşturmanı ve paylaşmanı sağlamak.</li>
            <li>Teknik sorunları tespit etmek ve çözmek.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">4. Gizlilik Çemberleri</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Nabız, paylaşımlarını üç farklı gizlilik çemberi ile kontrol etmeni sağlar:
          </p>
          <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
            <li>
              <strong className="text-foreground">Herkes:</strong> Tüm bağlantıların görebilir.
            </li>
            <li>
              <strong className="text-foreground">Yakın Arkadaşlar:</strong> Yalnızca seçtiğin
              kişiler görebilir.
            </li>
            <li>
              <strong className="text-foreground">Çekirdek (Aile):</strong> Yalnızca çekirdek aile
              üyelerin görebilir.
            </li>
          </ul>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Konum ve durumunu yalnızca senin seçtiğin kişiler görebilir. Varsayılan gizlilik ayarını
            dilediğin zaman Ayarlar sayfasından değiştirebilirsin.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">5. Veri Saklama</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Demo sürümünde paylaşımlar yalnızca cihazının geçici belleğinde tutulur ve uygulama
            yenilendiğinde veya tarayıcı kapatıldığında silinir. Kalıcı hesap ve sunucu kayıtları
            devreye alındığında bu madde güncellenecek ve saklama süreleri ayrıca duyurulacaktır.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">6. Veri Güvenliği</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Demo sürümünde veriler sunucuya gönderilmediği için cihazdan dışarı aktarılmaz. İşlevler
            tarayıcı-dışı hizmetlere (WhatsApp, X, Telegram gibi paylaşım hedeflerine) yalnızca
            <em> sen</em> kendin paylaşım yaptığında, senin başlattığın bağlantı yoluyla gider.
            İnternet üzerinde hiçbir iletimin %100 güvenli olmadığını lütfen unutma.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">7. Üçüncü Taraf Hizmetler</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Paylaşım işlevleri (WhatsApp, X, Telegram, indirilebilir görsel) doğrudan ilgili üçüncü
            tarafın sağladığı standart bağlantılardan yararlanır. Bu hizmetlere kalıcı kişisel veri
            aktarılmaz; paylaşımı başlatan sen olduğun için içeriğin kime gideceğini de sen
            belirlersin.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">8. Hakların (KVKK)</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında aşağıdaki haklara
            sahipsin:
          </p>
          <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
            <li>Kişisel verilerinin işlenip işlenmediğini öğrenme.</li>
            <li>İşlenen kişisel verilerin hakkında bilgi talep etme.</li>
            <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme.</li>
            <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme.</li>
            <li>Kişisel verilerinin eksik veya yanlış işlenmesi hâlinde düzeltilmesini isteme.</li>
            <li>Kişisel verilerinin silinmesini veya yok edilmesini isteme.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">9. İletişim</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Bu Gizlilik Politikası hakkında soruların varsa veya haklarını kullanmak istiyorsan
            lütfen bizimle iletişime geç:
          </p>
          <p className="text-sm text-muted-foreground">
            E-posta: <span className="text-primary">gizlilik@nabiz.app</span>
          </p>
        </section>
      </div>
    </AppShell>
  );
}
