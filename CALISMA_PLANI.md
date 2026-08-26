# Nabız (Pulse Heart Share) — Kapsamlı Çalışma Planı

## Proje Genel Bakış

**Uygulama Adı:** Nabız (Pulse Heart Share)
**Tür:** Gerçek zamanlı durum bildirim ve acil durum yardımcı uygulaması
**Teknoloji Yığını:** React 19, TanStack Router/Start, Tailwind CSS 4, Zustand, Radix UI, Motion, Vite 8, TypeScript
**Hedef Platform:** Web (PWA) → Native (Capacitor)
**Durum:** Mock API ile çalışan MVP tamamlandı; gerçek zamanlı backend entegrasyonuna geçiş aşamasında

**Temel Farkındalık:** Bu bir sosyal medya uygulaması DEĞİL. Ciddi, profesyonel bir yardımcı uygulamadır. Yaşlılar, gençler, evcil hayvan sahipleri ve acil durumdaki kişilerin güvendiği hayati bir araçtır.

---

## Görev 1: Tasarım Sistemi ve UI Yeniden Yapılanması

**Hedef:** Uygulamanın profesyonel, ciddi ve güven veren bir görünüme kavuşturulması. Sosyal medya estetiğinden tamamen uzaklaşılarak sağlık/tip uygulamaları kalitesinde bir arayüz oluşturulması.

### Alt Görev 1.1: Renk Paleti ve Tipografi Standardizasyonu

**Aksiyonlar:**
- Mevcut oklch renk sistemi gözden geçirilecek; acil durum (urgent) tonları için kontrast oranları WCAG AAA standardına (7:1) çıkarılacak
- "Nabız" marka mavisi (`--primary`) tıbbi/güvenilir hissi verecek şekilde ayarlanacak (şu an çok koyu, tıbbi uygulamalardaki açık mavi tonları tercih edilecek)
- Ara yüzey (surface) renkleri için minimal palet tanımlanacak: beyaz, çok açık gri, acil durum için koyu kırmızı
- Tipografi hiyerarşisi yeniden oluşturulacak: Inter yerine "Inter Variable" veya "Plus Jakarta Sans" fontu entegre edilecek; acil durum başlıkları için ayrı fontWeight tanımlanacak
- Livingstone, altar vs. gibi font pairings test edilecek; okunabilirlik öncelikli olacak
- Tailwind `@theme inline` bloğuna yeni renkler ve font tanımları eklenecek
- `styles.css` içindeki `:root` ve `.dark` değişkenleri güncellenecek

**Beklenen Çıktılar:**
- Güncellenmiş `styles.css` dosyası (renk paleti, tipografi, spacing scale)
- Erişilebilirlik raporu (Lighthouse accessibility skoru ≥ 95)
- Renk contrast ratio dokümanı

**Bağımlılıklar:** Yok

---

### Alt Görev 1.2: bileşen(Components) Kütüphanesinin Profesyonelleştirilmesi

**Aksiyonlar:**
- `src/components/ui/` altındaki tüm Radix tabanlı bileşenlerin stilleri gözden geçirilecek; daha minimal ve ciddi bir görünüm kazandırılacak
- `Button` bileşeni için varyantlar yeniden tanımlanacak: `default`, `outline`, `ghost`, `danger`, `sos` (SOS için özel)
- `Card` bileşeni için `elevated`, `outlined`, `filled` varyantları eklenecek; acil durum kartları için `urgent` varyantı
- `Badge` bileşeni durum kategorilerine göre otomatik renklendirme altyapısı kazandırılacak
- `Avatar` bileşeni için çevrimiçi/çevrimdışı göstergesi (status indicator) eklenecek
- `Input` ve `Textarea` bileşenleri için hata durumu, başarılı durum varyantları eklenecek
- Tüm bileşenler için `data-testid` ve uygun `aria-*` nitelikleri eklenecek
- Storybook kurulumu yapılacak ve her bileşen için hikaye yazılacak

**Beklenen Çıktılar:**
- Güncellenmiş UI bileşenleri (`src/components/ui/`)
- Storybook konfigürasyonu ve bileşen hikayeleri
- Bileşen kataloğu (görsel doküman)

**Bağımlılıklar:** Alt Görev 1.1 (renk paleti)

---

### Alt Görev 1.3: SOS/Acil Durum Butonu ve Paneli Yeniden Tasarımı

**Aksiyonlar:**
- SOS butonu mevcut `LifeBuoy` ikonundan daha belirgin bir tasarıma taşınacak: 44x44px minimum dokunma hedefi, yansıma animasyonu (glow effect)
- `SosSheet` bileşeni tamamen yeniden tasarlanacak: altar sheet yerine tam ekran acil durum modu
- Acil durum ekranı: kırmızı arka plan, büyük beyaz ikonlar, 112 / 155 / 112 (UMKE) hotline butonları
- "Konumumu Paylaş" ve "Alarm Çaldır" butonları SOS paneline eklenecek
- SOS panelinde countdown timer (3 saniye) ile yanlış tetikleme önleme mekanizması
- Toutchi-purple pin code veya parmak izi ile doğrulama opsiyonu (opsiyonel)
- SOS tetiklendiğinde cihaz titreşimi (vibration API) entegrasyonu
- Acil durum durumları (`URGENT_STATUSES`) için ek kategoriler: yangın, deprem, sel, kaybolma

**Beklenen Çıktılar:**
- Yeniden tasarlanmış `SosSheet.tsx` (tam ekran modu)
- `SosButton` angepasst für alle Breakpoints
- Acil durum ekranı mockup ve prototipi

**Bağımlılıklar:** Alt Görev 1.2 (bileşen kütüphanesi)

---

### Alt Görev 1.4: Ana Sayfa (Dashboard) Yeniden Düzenlenmesi

**Aksiyonlar:**
- `MyStatusPanel` yeniden tasarlanacak: kullanıcının kendi durumu daha belirgin, tek dokunuşla güncelleme
- `PulseFeed` için yeni yerleşim: acil durum kartları üstte, normal durumlar grid şeklinde
- Durum kartları için yeni varyant: `compact` (dar ekran), `expanded` (geniş ekran), `urgent` (acil)
- Empty state (boş durum) ekranı yeniden tasarlanacak:温暖, davetkar bir mesaj ve net bir CTA
- "Son X saate göre özet" widget'ı eklenecek (yaşlılar için faydalı)
- Hızlı durum butonları: ana sayfada en çok kullanılan 3-4 durum için shortcut
- Pull-to-refresh animasyonu optimize edilecek

**Beklenen Çıktılar:**
- Güncellenmiş `index.tsx` route sayfası
- Yeni `MyStatusPanel.tsx` ve `PulseFeed.tsx` versiyonları
- Dashboard yerleşme şeması (responsive)

**Bağımlılıklar:** Alt Görev 1.1, Alt Görev 1.2

---

### Alt Görev 1.5: gezinme(Navigation) ve Uluslararasılaştırma Altyapısı

**Aksiyonlar:**
- Mobil alt gezinme çubuğu yeniden tasarlanacak: daha ince, daha profesyonel, safe area desteği
- Masaüstü kenar çubuğu için Collapsible menü desteği
- Profil sayfası eklenecek (kullanıcı adı, avatar, acil durum kişileri yönetimi)
- Sayfa geçiş animasyonları (`framer-motion` route transitions)
- `next-intl` veya basit bir i18n çözümü ile Türkçe/İngilizce dil desteği altyapısı
- URL tabanlı dil yönlendirmesi (`/tr/...`, `/en/...`)
- Tercih edilen dil Zustand store'a eklenecek
- Tüm hardcoded Türkçe string'ler çıkarılacak ve dosyaya taşınacak

**Beklenen Çıktılar:**
- Güncellenmiş `AppShell.tsx` ve gezinme sistemi
- i18n konfigürasyonu ve çeviri dosyaları (`src/i18n/tr.json`, `src/i18n/en.json`)
- Profil sayfası (`/profil` route'u)

**Bağımlılıklar:** Alt Görev 1.1, Alt Görev 1.2

---

### Alt Görev 1.6: Responsive Tasarım ve Cihaz Uyumluluğu

**Aksiyonlar:**
- Mobil (320px-480px), Tablet (768px-1024px), Masaüstü (1280px+) olmak üzere 3 kırılma noktası için optimizasyon
- Touch-first tasarım: minimum 44x44px dokunma hedefleri (WCAG 2.2 AAA)
- Küçük ekranlarda acil durum butonunun erişilebilirlik kontrolü
- Foldable/cihazlar için esnek yerleşim testleri
- Safari iOS ve Chrome Android tarayıcılarında test
- Safe area insets (çentikli ekranlar) için CSS düzeltmeleri
- PWA manifest dosyası oluşturma (icon boyutları, theme color, splash screen)

**Beklenen Çıktılar:**
- Responsive CSS düzeltmeleri
- `manifest.json` dosyası
- Cihaz test raporu

**Bağımlılıklar:** Alt Görev 1.4 (dashboard yerleşimi)

---

### Alt Görev 1.7: Erişilebilirlik (a11y) Denetimi

**Aksiyonlar:**
- Tüm interactive bileşenler için keyboard navigation testi
- Screen reader (NVDA, VoiceOver) ile tam navigasyon testi
- Renk kontrast oranlarının tüm durumlar için doğrulanması (WCAG AA minimum)
- Focus management: modal açıldığında, SOS paneli açıldığında doğru focus ring
- `aria-live` region'ları: durum güncellendiğinde, SOS tetiklendiğinde bildirim
- Reduced motion preference desteği (`prefers-reduced-motion`)
- Font boyutu büyüklüğü tercihleri desteği
- Automated a11y testing: `axe-core` entegrasyonu

**Beklenen Çıktılar:**
- Accessibility denetim raporu
- Düzeltilmiş bileşenler
- `axe-core` test konfigürasyonu

**Bağımlılıklar:** Alt Görev 1.2, Alt Görev 1.3

---

**Görev 1 Toplam Süre Tahmini:** 3-4 hafta
**Kritik Bağımlılık:** Tüm sonraki görevler bu görevin tasarım kararlarına bağlıdır.

---

## Görev 2: Acil Durum / SOS Mimarisi

**Hedef:** Acil durum bildirimlerinin güvenilir, hızlı ve her koşulda çalışır şekilde çalışmasını sağlamak. Hayati önem taşıyan bu özellik, uygulamanın en kritik parçasıdır.

### Alt Görev 2.1: Acil Durum Bildirim Zincirinin Tasarlanması

**Aksiyonlar:**
- Acil durum bildirim akış şeması çizilecek: Tetikleme → Doğrulama → Konum Paylaşımı → Bildirim Gönderimi → Hotline Arama → Takip
- Her adım için zaman damgası (timestamp) kaydı tutulacak
- Acil durum seviyeleri tanımlanacak: `critical` (hayati tehlike), `high` (ciddi), `medium` (yardım gerekiyor)
- Her seviye için farklıbildirim stratejisi: critical → tüm çember + hotline, high → çekirdek çember, medium → yakın çember
- Acil durum geçmişi tablosu: hangi kullanıcı, ne zaman, ne tür acil durum bildirdi, kimler bilgilendirildi
- Hatalı tetikleme iptal mekanizması: 30 saniye içinde iptal etme hakkı
- Acil durum durdurulduğunda otomatik bildirim: "X kişisi acil durumu iptal etti"

**Beklenen Çıktılar:**
- Acil durum akış şeması (Mermaid/diagram)
- Veritabanı şeması (acil durum tabloları)
- Zaman damgası store mantığı

**Bağımlılıklar:** Yok

---

### Alt Görev 2.2: Acil Durum Veritabanı Tablolarının Oluşturulması

**Aksiyonlar:**
- `emergency_alerts` tablosu: `id`, `user_id`, `alert_type`, `severity`, `location` (PostGIS/geography), `message`, `status` (active/cancelled/resolved), `created_at`, `resolved_at`
- `emergency_contacts` tablosu: `id`, `user_id`, `contact_user_id`, `contact_phone`, `notify_order`, `is_primary`
- `emergency_history` tablosu: tüm acil durumların logu
- `emergency_settings` tablosu: kullanıcının tercihleri (otomatik konum paylaşımı, titreşim, ses)
- Row Level Security (RLS) politikaları: kullanıcılar yalnızca kendi acil durumlarını görebilir, çekirdek çemberdekiler ortak acil durumları görebilir
- PostGIS entegrasyonu: konum tabanlı sorgular için
- Index optimizasyonu: `user_id`, `created_at`, `status` üzerinde indeksler
- Trigger fonksiyonları: acil durum oluşturulduğunda otomatik bildirim tetikleme

**Beklenen Çıktılar:**
- Supabase migration dosyaları (`supabase/migrations/`)
- SQL şema dosyası
- RLS politika dosyaları

**Bağımlılıklar:** Alt Görev 2.1 (akış tasarımı)

---

### Alt Görev 2.3: Acil Durum Push Bildirim Servisi

**Aksiyonlar:**
- Web Push Notification API entegrasyonu (VAPID key çifti oluşturma)
- Service Worker kaydı ve push event handler
- Acil durum bildirimleri için özel şablon: yüksek öncelik, ses, titreşim
- Bildirim tıklama handler'ı: acil durum detay sayfasına yönlendirme
- iOS Safari push notification desteği (Apple Push Notification service)
- Android Chrome push notification desteği (Firebase Cloud Messaging)
- Bildirim izni isteme akışı: uygulama ilk açıldığında nazik, açıklamalı izin istemi
- Bildirim tercihleri: kullanıcı hangi tür bildirimleri alacağını kontrol edebilmeli
- Acil durum bildirimleri asla sessize alınamaz (override mechanism)

**Beklenen Çıktılar:**
- `public/sw.js` (Service Worker)
- Push notification servis dosyası (`src/lib/push.ts`)
- Bildirim şablonları
- Service Worker registration hook'u

**Bağımlılıklar:** Alt Görev 2.2 (veritabanı tabloları)

---

### Alt Görev 2.4: Acil Durum EşZamanlı Koordinasyonu

**Aksiyonlar:**
- Supabase Realtime channel'ları: `emergency:{userId}` ve `emergency:circle:{circleId}`
- Acil durum tetiklendiğinde canlı bildirim: çekirdek çemberdekiler anında看到
- Konum güncellemeleri real-time broadcast: acil durum sırasında konum değişiklikleri otomatik paylaşılacak
- "Ben güvendeyim" butonu: acil durumdaki kişi tek dokunuşla güvende olduğunu bildirebilir
- Acil durum süresince otomatik konum yenileme (her 30 saniye)
- Birden fazla kişi aynı anda acil durum bildirirse: koordinasyon paneli
- Aile içi acil durum zinciri: bir kişi acil durum bildirdiğinde ailesindeki diğer kişiler de bilgilendirilir

**Beklenen Çıktılar:**
- Realtime channel handler fonksiyonları
- Acil durum eş zamanlılık hook'u (`useEmergencySync`)
- Akış Diyagramı

**Bağımlılıklar:** Alt Görev 2.2, Görev 6 (Real-time Communication)

---

### Alt Görev 2.5: Acil Durum Durum Takibi ve Çözümleme

**Aksiyonlar:**
- Acil durum durumu yönetimi: `active` → `acknowledged` → `in_progress` → `resolved` / `cancelled`
- Her geçiş için zaman damgası ve sorumlu kullanıcı kaydı
- Otomatik çözümleme: 24 saat içinde çözümlenmemiş acil durumlar için otomatik hatırlatma
- Acil durum sonrası anket: "Durum çözüldü mü?" seçeneği
- İstatistik paneli: toplam acil durum sayısı, ortalama çözüm süresi, en sık bildirilen türler
- Acil durum geçmiş raporu: kullanıcıların kendi geçmişlerini görebilmesi
- Acil durum bildirim geri bildirimi: "Bu bildirim işe yaradı mı?"

**Beklenen Çıktılar:**
- Acil durum durum yönetimi hook'u
- Çözümleme UI bileşeni
- İstatistik dashboard'u

**Bağımlılıklar:** Alt Görev 2.2, Alt Görev 2.4

---

### Alt Görev 2.6: Acil Durum Güvenlik Protokolleri

**Aksiyonlar:**
- Rate limiting: bir kullanıcı günde en fazla 10 acil durum bildirebilir (ayarlama yapılabilir)
- Anti-spam: 5 dakika içinde同一 acil durum türünden yalnızca 1 bildirim
- Doğrulama: acil durum bildirimi için ikinci bir adım (hesap sahibi olduğunu doğrulama)
- Sahte alarm cezası: art arda yanlış bildirim yapan kullanıcılar için geçici kısıtlama
- Audit logging: tüm acil durum eylemleri loglanacak
- Veri şifreleme: hassas konum bilgileri sunucu tarafında şifrelenecek
- GDPR/KVKK uyumluluğu: acil durum verilerinin saklanma süresi ve silinme politikası
- Acil durum verilerine yalnızca yetkili kişiler erişebilir (RLS + admin paneli)

**Beklenen Çıktılar:**
- Rate limiting fonksiyonları
- Audit log tablosu ve trigger'ları
- Güvenlik politikası dokümanı

**Bağımlılıklar:** Alt Görev 2.2

---

### Alt Görev 2.7: Acil Durum Simülasyonu ve Test Ortamı

**Aksiyonlar:**
- Test modu: geliştirme ortamında gerçek acil durum tetiklemeden test edilebilir
- Mock acil durum verileri oluşturma
- Acil durum akışının otomatik testi: Tetikleme → Bildirim → Çözümleme
- Stress test: aynı anda 100+ acil durum bildirimi senaryosu
- Network connectivity testi: offline durumda acil durum bildirimi
- Hata senaryoları: sunucu hatası, bildirim gönderilemedi, konum alınamadı
- E2E test dosyaları: Playwright veya Cypress ile acil durum akışı testleri

**Beklenen Çıktılar:**
- Test dosyaları (`src/__tests__/emergency/`)
- Test verileri ve fixtures
- Test raporu

**Bağımlılıklar:** Alt Görev 2.1-2.6 (tüm SOS alt görevleri)

---

**Görev 2 Toplam Süre Tahmini:** 3-4 hafta
**Kritik Bağımlılık:** Görev 6 (Real-time), Görev 4 (Backend) ile paralel çalışılabilir

---

## Görev 3: Konum ve Harita Entegrasyonu

**Hedef:** Gerçek zamanlı konum paylaşımı, harita üzerinde gösterim ve acil durum konumları için güvenilir bir harita altyapısı kurulması.

### Alt Görev 3.1: Konum Servisi Altyapısı

**Aksiyonlar:**
- Geolocation API wrapper fonksiyonu: yüksek doğruluk, hata yönetimi, izin kontrolü
- Konum izni isteme akışı: açıklayıcı UI, izin reddedilirse alternatif çözüm (manuel konum girme)
- Arka planda konum izleme: acil durum sırasında otomatik konum yenileme
- Battery-aware konum izleme: pil durumuna göre konum yenileme sıklığı ayarlama
- Konum doğruluğu göstergesi: kullanıcının konumunun ne kadar hassas olduğunu gösterme
- Fallback mekanizması: GPS çalışmazsa IP tabanlı yaklaşık konum
- Konum geçmişi: acil durum sırasında konum izi bırakma (breadcrumb trail)

**Beklenen Çıktılar:**
- `src/lib/location.ts` (konum servisi)
- `useGeolocation` hook'u
- Konum izni UI bileşeni

**Bağımlılıklar:** Yok

---

### Alt Görev 3.2: Harita Bileşeni Entegrasyonu

**Aksiyonlar:**
- Harita kütüphanesi seçimi: Leaflet (açık kaynak) veya Mapbox GL JS
- `MapContainer` bileşeni: merkez, zoom, marker desteği
- Kullanıcı konumu gösterimi: animasyonlu marker, accuracy circle
- Birden fazla kullanıcı konumu: farklı renklerde marker'lar
- Acil durum konumu: özel marker (kırmızı pulsing marker)
- Harita stilleri: light/dark mod, sade harita stili (sosyal medya hissi vermeyecek)
- Cluster desteği: çoklu yakın konumları gruplandırma
- Harita yüklenme durumu: skeleton loading
- Responsive harita: mobilde tam ekran, masaüstünde kart içinde

**Beklenen Çıktılar:**
- `src/features/map/components/MapContainer.tsx`
- Harita marker bileşenleri
- Harita konfigürasyonu

**Bağımlılıklar:** Alt Görev 3.1 (konum servisi)

---

### Alt Görev 3.3: Gerçek Zamanlı Konum Paylaşımı

**Aksiyonlar:**
- Supabase Realtime ile konum channel'ı: `location:{userId}`
- Konum paylaşımı toggle'ı: aç/kapat, zaman sınırı (1 saat, 3 saat, 24 saat)
- Çember bazlı konum paylaşımı: yalnızca belirli kişilerle paylaşım
- Canlı konum haritası: seçili kişilerin harita üzerinde gerçek zamanlı gösterimi
- Konum güncelleme sıklığı: 10 saniye (normal), 30 saniye (acil durum dışı), 5 saniye (acil durum)
- Battery consumption optimizasyonu: hareket halindeyken daha sık, dururken daha seyrek
- Konum paylaşımı sona erdiğinde otomatik bildirim
- Son görülme zamanı: en son ne zaman konum güncellendiğini gösterme

**Beklenen Çıktılar:**
- `useLocationSharing` hook'u
- Canlı konum haritası sayfası
- Konum paylaşımı ayarları UI'ı

**Bağımlılıklar:** Alt Görev 3.1, Alt Görev 3.2, Görev 6 (Real-time)

---

### Alt Görev 3.4: Acil Durum Konum Özellikleri

**Aksiyonlar:**
- SOS tetiklendiğinde otomatik konum gönderimi
- Yakın acil durumlar haritası: çevredeki acil durumları gösterme (kişisel veriler gizli)
- En yakın hastane/emniyet/recamine istasyonu bulma (POI arama)
- Acil durum konumu için özel marker ve popup
- Konum geçmişini acil durum sırasında otomatik kaydetme
- Paylaşılan konumun doğrudan harita uygulamasında açılması (Google Maps, Apple Maps linkleri)
- Acil durum sonrası konum logunun dışa aktarılması (JSON/PDF)

**Beklenen Çıktılar:**
- Acil durum haritası bileşeni
- POI arama fonksiyonu
- Konum dışa aktarma servisi

**Bağımlılıklar:** Alt Görev 3.3, Görev 2 (SOS Mimarisi)

---

### Alt Görev 3.5: Konum Gizliliği ve Güvenliği

**Aksiyonlar:**
- Konum verilerinin sunucu tarafında şifrelenmesi (AES-256)
- Konum paylaşımı için süre bazlı otomatik silinme
- Yaklaşık konum modu: tam konum yerine semt/bölge gösterme seçeneği
- IP anonymization: sunucu tarafında IP adresi маскировка
- Konum verilerine erişim logları: kim ne zaman konumumu gördü?
- KVKK/CCPA uyumluluğu: konum verilerinin işlenmesi ve silinmesi
- Konum verilerinin üçüncü taraflarla paylaşılmaması garanti edilecek
- Acil durum sonrası konum verisi 7 gün sonra otomatik silinecek

**Beklenen Çıktılar:**
- Konum şifreleme modülü
- Gizlilik ayarları UI'ı
- Uyumluluk dokümanı

**Bağımlılıklar:** Alt Görev 3.3

---

**Görev 3 Toplam Süre Tahmini:** 2-3 hafta
**Kritik Bağımlılık:** Görev 6 (Real-time), Görev 4 (Backend) ile paralel çalışılabilir

---

## Görev 4: Backend Mimarisi (Supabase)

**Hedef:** Mock API katmanının tamamen Supabase ile değiştirilmesi, veritabanı şemasının oluşturulması, API fonksiyonlarının生产 готовность seviyesine çıkarılması.

### Alt Görev 4.1: Supabase Proje Kurulumu ve Veritabanı Şeması

**Aksiyonlar:**
- Supabase projesi oluşturulacak (Pro plan, Realtime enabled)
- `profiles` tablosu: `id` (UUID, auth.users FK), `full_name`, `phone`, `avatar_url`, `date_of_birth`, `created_at`, `updated_at`
- `statuses` tablosu: `id` (UUID), `user_id` (FK profiles), `status_id` (katalog ID), `privacy` (enum: everyone/close/inner), `note`, `created_at`, `expires_at` (otomatik 24 saat)
- `circles` tablosu: `id`, `owner_id` (FK profiles), `member_id` (FK profiles), `circle_type` (enum: inner/close), `created_at`
- `reactions` tablosu: `id`, `status_id` (FK), `user_id` (FK), `reaction_kind` (enum: hug/heart/coffee), `created_at` (unique constraint: status_id + user_id + reaction_kind)
- `nudges` tablosu: `id`, `sender_id` (FK), `receiver_id` (FK), `created_at`
- `notifications` tablosu: push bildirim geçmişi
- Tüm tablolarda appropriate indeksler
- Updated_at otomatik güncelleme trigger'ı (her tablo için)
- Soft delete stratejisi: `deleted_at` kolonu (durumlar için)

**Beklenen Çıktılar:**
- `supabase/migrations/001_initial_schema.sql`
- Veritabanı şema diyagramı
- Seed dosyası (test verileri)

**Bağımlılıklar:** Yok

---

### Alt Görev 4.2: Supabase Auth Entegrasyonu

**Aksiyonlar:**
- Telefon numarası ile giriş (SMS OTP): 112 acil durum entegrasyonu için kritik
- E-posta ile giriş (şifreli): alternatif yöntem
- Google OAuth entegrasyonu: genç kullanıcılar için
- Apple Sign In: iOS cihazlar için (PWA altında opsiyonel)
- Session yönetimi: JWT token yenileme, refresh token rotation
- Kullanıcı oturum süresi: 30 gün, hatırlanma
- Çıkış yapma: tüm cihazlardan çıkış seçeneği
- Hesap silme: KVKK kapsamında tam hesap silme
- EşZamanlı oturum limiti: maksimum 3 cihaz

**Beklenen Çıktılar:**
- `src/lib/supabase/auth.ts` (auth servisi)
- `useAuth` hook'u
- Giriş/kayıt sayfaları (`/giris`, `/kayit`)
- Auth middleware (route koruması)

**Bağımlılıklar:** Alt Görev 4.1 (veritabanı şeması)

---

### Alt Görev 4.3: Veri Erişim Katmanı (Data Access Layer)

**Aksiyonlar:**
- `src/features/status/api/statusApi.ts`: durum CRUD işlemleri
- `src/features/profile/api/profileApi.ts`: profil yönetimi
- `src/features/circles/api/circlesApi.ts`: çember yönetimi
- `src/features/emergency/api/emergencyApi.ts`: acil durum API'leri
- Her API dosyasında: `fetch`, `create`, `update`, `delete` fonksiyonları
- TypeScript type Definitions: Supabase tablolarıyla birebir eşleşen interface'ler
- Error handling wrapper: Supabase hatalarını uygulama hatalarına dönüştürme
- Query builder helpers: complex sorgular için yardımcı fonksiyonlar
- Optimistic update helper: React Query ile uyumlu
- Mock API ile aynı imza: `mockApi.ts` fonksiyonları replace edilecek

**Beklenen Çıktılar:**
- Data access layer dosyaları
- TypeScript type dosyaları (`src/types/database.ts`)
- Error handling utility

**Bağımlılıklar:** Alt Görev 4.1, Alt Görev 4.2

---

### Alt Görev 4.4: React Query Entegrasyonu ve Hook Güncelleme

**Aksiyonlar:**
- `useStatusFeed` hook'u güncellenecek: mockApi yerine Supabase calls
- `useMyStatus` hook'u güncellenecek
- `usePublishStatus` mutation'u güncellenecek
- `useToggleReaction` mutation'u güncellenecek: optimistic update korunacak
- `useNudge` mutation'u güncellenecek
- Yeni hook'lar: `useProfile`, `useCircles`, `useEmergencyAlerts`
- Query invalidation stratejisi: hangi mutation'dan sonra hangi query'ler invalidate edilmeli
- Cache politikası: staleTime, gcTime ayarları
- Background refetch: odaklandığında otomatik yenileme
- Error retry stratejisi: exponential backoff

**Beklenen Çıktılar:**
- Güncellenmiş hook dosyaları (`src/features/*/hooks/`)
- Query client konfigürasyonu
- Cache stratejisi dokümanı

**Bağımlılıklar:** Alt Görev 4.3 (data access layer)

---

### Alt Görev 4.5: Supabase Row Level Security (RLS) Politikaları

**Aksiyonlar:**
- `profiles` tablosu: herkes okuyabilir (public profiles), yalnızca sahipli güncelleyebilir
- `statuses` tablosu: privacy field'ına göre okuma izni
  - `everyone`: herkes okuyabilir
  - `close`: yalnızca yakın çemberdekiler okuyabilir
  - `inner`: yalnızca çekirdek çemberdekiler okuyabilir
  - Acil durumlar (`category = 'urgent'`): her zaman herkes okuyabilir
- `circles` tablosu: yalnızca kendi çemberlerini yönetebilir
- `reactions` tablosu: durumu görebilen herkes tepki bırakabilir
- `nudges` tablosu: yalnızca gönderen ve alıcı görebilir
- Acil durum tabloları: özel RLS politikaları (Görev 2'de detaylandırılacak)
- Admin politikaları: site yöneticileri için ek izinler
- Test politikaları: test ortamı için genişletilmiş izinler

**Beklenen Çıktılar:**
- `supabase/migrations/002_rls_policies.sql`
- RLS test dosyaları
- Politika Diyagramı

**Bağımlılıklar:** Alt Görev 4.1

---

### Alt Görev 4.6: Supabase Edge Functions

**Aksiyonlar:**
- `send-push-notification`: push bildirim gönderme (FCM/APNs entegrasyonu)
- `notify-emergency-contacts`: acil durum bildirimini kişilere yönlendirme
- `cleanup-expired-statuses`: 24 saatten eski durumları temizleme (cron job)
- `generate-location-share-link`: konum paylaşım linki oluşturma
- `process-reaction-notifications`: tepki bildirimi gönderme
- `user-deletion-cascade`: hesap silindiğinde cascade delete
- `analytics-daily`: günlük istatistik hesaplama
- Edge function testleri ve monitoring

**Beklenen Çıktılar:**
- `supabase/functions/` dizininde fonksiyonlar
- Edge function testleri
- Cron job konfigürasyonu

**Bağımlılıklar:** Alt Görev 4.2 (auth), Alt Görev 4.5 (RLS)

---

### Alt Görev 4.7: Veritabanı Optimizasyonu ve Monitoring

**Aksiyonlar:**
- Sorgu performans analizi: `EXPLAIN ANALYZE` ile yavaş sorguların tespiti
- Indeks optimizasyonu: composite indeksler, partial indeksler
- Connection pooling: Supabase connection pool ayarları
- Monitoring dashboard: Supabase dashboard'da özel paneller
- Error tracking: Sentry entegrasyonu
- Performance monitoring: response time tracking
- Backup stratejisi: günlük otomatik yedekleme
- Disaster recovery planı

**Beklenen Çıktılar:**
- Performans raporu
- Monitoring konfigürasyonu
- Backup/DR planı

**Bağımlılıklar:** Alt Görev 4.1-4.6 (tüm backend görevleri)

---

**Görev 4 Toplam Süre Tahmini:** 4-5 hafta
**Kritik Bağımlılık:** Tüm frontend entegrasyonları bu göreve bağlıdır

---

## Görev 5: Kimlik Doğrulama ve Kullanıcı Yönetimi

**Hedef:** Güvenilir, kullanıcı dostu bir kimlik doğrulama sistemi ve kapsamlı profil yönetimi.

### Alt Görev 5.1: Kimlik Doğrulama Akışlarının Tasarlanması

**Aksiyonlar:**
- Kullanıcı kayıt akışı: telefon numarası → SMS OTP → profil oluşturma
- Kullanıcı giriş akışı: telefon/SMS OTP → session başlatma
- Şifre sıfırlama akışı: telefon → SMS OTP → yeni şifre belirleme
- Hesap kurtarma: acil durum kişileri yardımıyla hesap kurtarma
- Misafir modu: kayıt olmadan acil durum bildirimi (sınırlı özellik)
- Otomatik oturum yenileme: sessizce token yenileme
- Cihaz yönetimi: hangi cihazlarda oturum açık?
- Güvenli çıkış: tüm cihazlardan çıkış

**Beklenen Çıktılar:**
- Auth akış diyagramları
- Sayfa tasarımları: `/giris`, `/kayit`, `/sifre-sifirla`, `/oturumlar`
- Auth middleware

**Bağımlılıklar:** Görev 4.2 (Supabase Auth)

---

### Alt Görev 5.2: Profil Yönetimi Sayfası

**Aksiyonlar:**
- Profil düzenleme: ad, soyad, telefon, e-posta
- Avatar yükleme ve kırpma: Supabase Storage entegrasyonu
- Doğum tarihi: yaş grubu tespiti için (yaşlı kullanıcılar için UX farklılığı)
- Acil durum bilgileri: kan grubu, kronik hastalıklar, ilaçlar (opsiyonel, şifreli)
- Acil durum kişileri yönetimi: ekleme, çıkarma, öncelik belirleme
- Profil görünürlüğü: herkese açık, yalnızca çemberdekiler, gizli
- Profil tamamlama yüzdesi: motivasyon için gamification
- Hesap silme: KVKK kapsamında tam silme

**Beklenen Çıktılar:**
- Profil sayfası (`/profil`)
- Profil düzenleme formu
- Avatar yükleme bileşeni

**Bağımlılıklar:** Alt Görev 5.1 (kimlik doğrulama)

---

### Alt Görev 5.3: Çember (Circle) Yönetimi

**Aksiyonlar:**
- Yeni çember oluşturma: isim, açıklama, tür (iç/dış)
- Kişi davet etme: telefon numarası veya e-posta ile
- Davet kabul/red akışı: bildirim + onay
- Çemberden çıkarma: kişi silme
- Çember türü değiştirme: inner ↔ close geçiş
- Varsayılan çember ayarlama
- Çember boyutu limiti: inner için max 10, close için max 50
- Çember istatistikleri: kim ne sıklıkla durum paylaşıyor

**Beklenen Çıktılar:**
- Çember yönetimi sayfası (`/cevrem` güncellenecek)
- Davet sistemi UI'ı
- Çember API fonksiyonları

**Bağımlılıklar:** Alt Görev 5.2 (profil yönetimi)

---

### Alt Görev 5.4: Bildirim Tercihleri Yönetimi

**Aksiyonlar:**
- Push bildirim açma/kapama
- Acil durum bildirimleri için öncelik ayarı
- Durum güncelleme bildirimleri: hangi çemberdekilerin durumunu takip etmek istiyorum
- Sessiz saatler: gece 22:00-07:00 arası bildirim sessizliği (acil durum hariç)
- Bildirim sesi seçimi: farklı türler için farklı sesler
- Titreşim tercihi: aç/kapat, şiddeti
- E-posta bildirimleri: haftalık özet
- SMS bildirimleri: yalnızca acil durumlar için

**Beklenen Çıktılar:**
- Bildirim tercihleri sayfası (`/ayarlar` içine entegre)
- Bildirim tercihleri API'si
- Servis worker bildirim şablonları

**Bağımlılıklar:** Alt Görev 5.1, Görev 2.3 (push bildirim)

---

### Alt Görev 5.5: Yaşlı Kullanıcılar için Özel UX

**Aksiyonlar:**
- Büyük font varsayılanı: yaş > 60 olan kullanıcılar için otomatik büyük font
- Basitleştirilmiş arayüz: yalnızca temel özellikler, daha az seçenek
- Sesli komut desteği: "Durumumu güncelle", "Acil durum" (Web Speech API)
- Yardım sistemi: her sayfada "Yardım" butonu, adım adım rehber
- Yüksek kontrast modu: yaşlılar için özel tema
- Basit navigasyon: daha büyük ikonlar, daha net etiketler
- Acil durum kısayolu: ana ekranda sürekli görünür SOS butonu
- Otomatik durum paylaşma: belirli saatlerde otomatik "güvendeyim" bildirimi

**Beklenen Çıktılar:**
- Yaşlı kullanıcı tema seçeneği
- Sesli komut hook'u (`useVoiceCommand`)
- Basitleştirilmiş görünüm modu

**Bağımlılıklar:** Alt Görev 5.2, Görev 1.1 (tasarım sistemi)

---

**Görev 5 Toplam Süre Tahmini:** 3-4 hafta
**Kritik Bağımlılık:** Görev 4.2 (auth), Görev 1.1 (tasarım)

---

## Görev 6: Gerçek Zamanlı İletişim

**Hedef:** Supabase Realtime ile anlık durum güncellemeleri, bildirimler ve etkileşimlerin sağlanması.

### Alt Görev 6.1: Supabase Realtime Kanalları

**Aksiyonlar:**
- `statuses` tablosu için Realtime kanalı: INSERT, UPDATE, DELETE event'leri
- `reactions` tablosu için Realtime kanalı
- `notifications` tablosu için Realtime kanalı
- Kanal abonelik yönetimi: sayfa görünürlüğüne göre abonelik açma/kapama
- Connection recovery: bağlantı koptuğunda otomatik yeniden bağlanma
- Heartbeat mekanizması: bağlantının canlı olduğunu doğrulama
- Channel naming stratejisi: `feed:all`, `feed:circle:{id}`, `user:{id}:status`
- Realtime event handler'ları: event geldiğinde React Query cache güncelleme

**Beklenen Çıktılar:**
- `src/lib/supabase/realtime.ts` (kanal yönetimi)
- Realtime hook'ları
- Connection manager

**Bağımlılıklar:** Görev 4.1 (veritabanı şeması)

---

### Alt Görev 6.2: Gerçek Zamanlı Feed Güncelleme

**Aksiyonlar:**
- Yeni durum eklendiğinde feed'in anında güncellenmesi (optimistic UI korunarak)
- Durum silindiğinde/güncellendiğinde feed'den kaldırılması/güncellenmesi
- Acil durum durumları feed'de otomatik olarak üste taşınması
- Yeni tepki geldiğinde sayaçların anında güncellenmesi
- "X kişi durumunu güncelledi" toast bildirimi
- Batch update:同一 anda birden fazla güncelleme geldiğinde debouncing
- Offline → Online geçişte cached data ile reconcile

**Beklenen Çıktılar:**
- Güncellenmiş `useStatusFeed` hook'u
- Realtime event processor
- Cache reconcile stratejisi

**Bağımlılıklar:** Alt Görev 6.1

---

### Alt Görev 6.3: Gerçek Zamanlı Bildirimler

**Aksiyonlar:**
- Durum bildirimi: "X kişisi durumunu güncelledi" (push + in-app)
- Tepki bildirimi: "X kişisi durumuna 💛 gönderdi" (in-app)
- Yoklama bildirimi: "X kişisi seni yokladı" (push + in-app)
- Acil durum bildirimi: "X kişisi acil durum bildirdi" (push + titreşim + ses)
- Çember daveti: "X seni çemberine davet etti" (push + in-app)
- Bildirim sayacı: okunmamış bildirim sayısı (header badge)
- Bildirim sayfası: tüm bildirimlerin listesi, okundu/okunmadı durumu
- Tek tıklamayla tümünü okundu olarak işaretleme

**Beklenen Çıktılar:**
- Bildirim sayfası (`/bildirimler`)
- `useNotifications` hook'u
- Bildirim badge bileşeni

**Bağımlılıklar:** Alt Görev 6.1, Alt Görev 6.2

---

### Alt Görev 6.4: Çevrimdışı → Çevrimiçi Geçiş Senkronizasyonu

**Aksiyonlar:**
- Service Worker ile istek kuyruğu: çevrimdışıyken yapılan istekler online olunca gönderilecek
- Local storage cache: son bilinen feed durumu
- Conflict resolution: çevrimdışıyken yapılan değişiklikler çakışırsa ne olacak?
- Optimistic locking: version field ile çakışma tespiti
- Retry mekanizması: başarısız istekler için exponential backoff
- Sync indicator: "Senkronize ediliyor..." göstergesi
- Offline indicator: "Çevrimdışısın, sınırlı erişim" uyarısı

**Beklenen Çıktılar:**
- Service Worker kuyruk yönetimi
- Offline cache stratejisi
- Conflict resolution fonksiyonları

**Bağımlılıklar:** Alt Görev 6.1

---

### Alt Görev 6.5: Gerçek Zamanlı Durum Takibi (Presence)

**Aksiyonlar:**
- Supabase Presence: kullanıcıların çevrimiçi/çevrimdışı durumu
- "Şu an aktif" göstergesi: yeşil nokta
- "Son görülme" zamanı: en son ne zaman aktif olduğunu gösterme
- Presence için minimal veri: yalnızca user_id ve last_seen
- Presence abonelik yönetimi: yalnızca çekirdek çemberdekilerin presence'ı
- battery/performance considerations: presence polling sıklığı

**Beklenen Çıktılar:**
- `usePresence` hook'u
- Presence indicator bileşeni
- Son görülme zamanı gösterimi

**Bağımlılıklar:** Alt Görev 6.1

---

**Görev 6 Toplam Süre Tahmini:** 2-3 hafta
**Kritik Bağımlılık:** Görev 4 (Backend) ile paralel çalışılabilir

---

## Görev 7: Acil Hat Entegrasyonu

**Hedef:** Acil durum hotline'larına doğrudan bağlantı, entegrasyon hazırlığı ve kullanıcıların acil servislere hızlı erişimi.

### Alt Görev 7.1: Acil Hat Telefon Entegrasyonu

**Aksiyonlar:**
- `tel:` protokolü ile doğrudan arama: 112 (Acil Sağlık), 110 (İtfaiye), 155 (Polis), 156 (Jandarma)
- Tek dokunuşla arama butonları: acil durum ekranında prominent
- Arama öncesi onay dialogu: yanlışlıkla arama önleme
- Arama sonrası otomatik bildirim: "X kişisi 112'yi aradı" (çekirdek çember)
- Konum bilgisi otomatik kopyalama: arama sırasında konum panoya kopyalanacak
- UMKE (112) ve AFAD hatları için özel butonlar
- KADES entegrasyonu hazırlığı: Kadın Acil Destek Elektronik Sistemi linki
- ALO 183 (Sosyal Destek Hattı) entegrasyonu

**Beklenen Çıktılar:**
- Acil hat bileşeni (`src/features/emergency/components/EmergencyHotlines.tsx`)
- Arama handler fonksiyonları
- Hotline konfigürasyonu

**Bağımlılıklar:** Görev 2 (SOS Mimarisi)

---

### Alt Görev 7.2: KADES Entegrasyonu Hazırlığı

**Aksiyonlar:**
- KADES uygulamasına yönlendirme linki: `kades:` deep link veya web URL
- KADES API dokümantasyonu araştırması: mevcut API'ler ve entegrasyon seçenekleri
- KADES entegrasyon mimarisi: Nabız → KADES yönlendirmesi veya doğrudan API çağrısı
- KADES durum senkronizasyonu: KADES'teki acil durum Nabız'a da yansıtılmalı mı?
- Kullanıcı KADES tercihi: "KADES'i de bildir" toggle'ı
- KADES使用 talimatı: kullanıcıları KADES'e nasıl yönlendireceğimiz
- KADES fallback: KADES çalışmıyorsa alternatif çözüm
- KADES test senaryosu: test ortamında KADES entegrasyonu

**Beklenen Çıktılar:**
- KADES yönlendirme bileşeni
- KADES entegrasyon dokümanı
- KADES konfigürasyonu

**Bağımlılıklar:** Alt Görev 7.1

---

### Alt Görev 7.3: Acil Durum Bilgi Kartları

**Aksiyonlar:**
- Her acil durum türü için bilgi kartı: ne yapılması gerektiği adım adım
- Tıbbi acil durum: ilk yardım adımları, bilinmesi gerekenler
- Yangın: tahliye prosedürü,.Schema.org markup
- Deprem: çök-korun-tutun, açık alan yönlendirmesi
- Sel: yüksek yerlere çıkış, su baskını
- Kaybolma: kaybolan kişi için yapılması gerekenler
- Akut ruh sağlığı krizi: panik atak, intihar riski → 112 ve ALO 183
- Hayvan acil durumu: en yakın veteriner bulma
- Tüm kartlar offline erişime uygun: Service Worker'da cache'lenecek

**Beklenen Çıktılar:**
- Acil durum bilgi kartları sayfası (`/acil-bilgiler`)
- Offline cache stratejisi
- Bilgi kartı içerikleri

**Bağımlılıklar:** Alt Görev 7.1

---

### Alt Görev 7.4: Yakın Çevre Acil Durum Noktaları (POI)

**Aksiyonlar:**
- OpenStreetMap / Nominatim API ilePOI arama: hastane, eczane, polis merkezi, itfaiye
- Yakın POI listesi: en yakın 5 hastane, en yakın 3 eczane
- POI harita üzerinde gösterimi
- Navigasyon linki: Google Maps / Apple Maps ile yol tarifi
- POI bilgileri: telefon numarası, çalışma saatleri, mesafe
- Offline POI cache: son bilinen POI'lar çevrimdışıyken gösterilecek
- Acil durum POI'ları için özel filtre: yalnızca acil servis açık olanlar

**Beklenen Çıktılar:**
- POI arama servisi (`src/lib/poi.ts`)
- POI listesi bileşeni
- POI harita entegrasyonu

**Bağımlılıklar:** Görev 3 (Konum/Harita)

---

### Alt Görev 7.5: Acil Durum Kişileri Otomatik Bildirim Sistemi

**Aksiyonlar:**
- Acil durum bildirildiğinde otomatik SMS gönderimi (Twilio/turkcell API)
- SMS şablonları: "X kişisi acil durum bildirdi. Konum: [link]"
- E-posta bildirimi: acil durum kişilerine e-posta
- Bildirim öncelik sırası: birinci kişi cevap vermezse ikinci kişiye geçme
- Bildirim döngüsü: tüm kişilere ulaşana kadar devam
- Kişiler cevap verdiğinde bildirim zinciri durdurulacak
- Bildirim logları: kimden kime, ne zaman, hangi kanaldan

**Beklenen Çıktılar:**
- Otomatik bildirim servisi
- SMS/e-posta şablonları
- Bildirim zinciri mantığı

**Bağımlılıklar:** Alt Görev 7.1, Görev 4.6 (Edge Functions)

---

**Görev 7 Toplam Süre Tahmini:** 2-3 hafta
**Kritik Bağımlılık:** Görev 2, Görev 3, Görev 4.6

---

## Görev 8: Durum Yönetim Sistemi

**Hedef:** Durum paylaşma, tipleme, filtreleme ve 24 saatlik yaşam döngüsünün eksiksiz yönetimi.

### Alt Görev 8.1: Durum Kataloğu ve Kategorilerinin Genişletilmesi

**Aksiyonlar:**
- Mevcut 100+ duruma ek olarak yeni kategoriler: beslenme, uyku kalitesi, sosyal etkinlik
- Kullanıcı tanımlı özel durumlar: "kendi durumunu oluştur" (özel emoji + özel label)
- Durum önerileri: kullanıcının geçmişine göre öneriler
- Durum kategorileri için görsel ikon güncellemesi: minimal, profesyonel ikon seti
- Durum arama performans optimizasyonu: debounce, indexed search
- Kullanım sıklığına göre sıralama: en çok kullanılan durumlar üstte
- Durum kalıpları: "her sabah huzurlu", "işten sonra yorgun" — tekrarlayan durumlar için şablon

**Beklenen Çıktılar:**
- Güncellenmiş `statusCatalog.ts`
- Özel durum oluşturma formu
- Durum önerisi hook'u

**Bağımlılıklar:** Yok

---

### Alt Görev 8.2: Durum Yayınlama ve Yayındın(Feed) Yönetimi

**Aksiyonlar:**
- Durum yayınla akışı: seçim → gizlilik → not → gönder
- Optimistic UI: gönderir göndermez feed'de görünmesi
- Durum güncelleme: mevcut durumu değiştirme
- Durum silme: published durumu silme
- 24 saatlik otomatik sona erme: `expires_at` alanı, cron job ile temizleme
- Efemer durum: 24 saat sonra "soluk" görünüm, "Bugün haber yok" mesajı
- Feed sıralaması: acil durumlar üstte, sonra en yeni
- Feed filtresi: çember, kategori, sadece aktif

**Beklenen Çıktılar:**
- Güncellenmiş `usePublishStatus` hook'u
- Feed yönetimi fonksiyonları
- Efemer durum mantığı

**Bağımlılıklar:** Görev 4.3 (data access), Görev 6.2 (realtime feed)

---

### Alt Görev 8.3: Tepki (Reaction) Sistemi

**Aksiyonlar:**
- Mevcut tepkiler: 💛 (hug), ❤️ (heart), ☕ (coffee) — salonWarmtrait, destek, dayanışma
- Yeni tepkiler: 🙏 (prayer/support), 💪 (strength), 🤗 (hug variant)
- Tepki sayısı sınırlaması: kullanıcı başına durum başına 1 tepki türü
- Tepki bildirimi: "X kişisi durumuna 💛 gönderdi"
- Tepki animasyonu: gönderirken küçük animasyon (confetti veya glow)
- Tepki istatistikleri: hangi tepkiler en çok gönderiliyor
- Tepki geri alma: gönderilen tepkiyi iptal etme

**Beklenen Çıktılar:**
- Güncellenmiş `ReactionBar` bileşeni
- Tepki API fonksiyonları
- Tepki animasyonları

**Bağımlılıklar:** Görev 4.3, Görev 6.2

---

### Alt Görev 8.4: Kişiselleştirilmiş Durum Önerileri

**Aksiyonlar:**
- Saat bazlı öneriler: sabah → enerjik/motive, gece → yorgun/uykulu
- Hava durumuna göre öneriler: yağmurlu → huzurlu, sıcak → bunalmış
- Gün bazlı öneriler: Pazartesi → işte, Cumartesi → tatil
- Kullanım geçmişine göre: en çok kullanılan 5 durum
- Duygu曆史 analizi: son 7 günün ruh hali dağılımı
- Öneri algoritması: basit scoring (ağırlıklı rastgele)
- Öneri UI'ı: "Bugün nasılsın?" başlangıç ekranı

**Beklenen Çıktılar:**
- Öneri motoru (`src/lib/suggestions.ts`)
- Öneri hook'u (`useStatusSuggestions`)
- Öneri UI bileşeni

**Bağımlılıklar:** Alt Görev 8.1

---

### Alt Görev 8.5: Durum İstatistikleri ve Raporlama

**Aksiyonlar:**
- Haftalık ruh hali dağılımı: pie chart / bar chart
- Aylık trend: line chart ile zaman içindeki değişim
- En sık paylaşılan durumlar: top 5
- Tepki analizi: en çok hangi tepki gönderiliyor
- Aktiflik metrikleri: haftada kaç kez güncelleme
- Ruh hali kalıpları: belirli günlerde belirli ruh halleri
- Kişisel rapor: "Bu ay en çok X oldun" — yıllık özet
- Rapor dışa aktarma: PDF/JSON olarak indirme

**Beklenen Çıktılar:**
- İstatistik sayfası (`/istatistikler`)
- Grafik bileşenleri (recharts entegrasyonu)
- Rapor oluşturma servisi

**Bağımlılıklar:** Alt Görev 8.2

---

### Alt Görev 8.6: Evcil Hayvan Durum Yönetimi

**Aksiyonlar:**
- Evcil hayvan profili oluşturma: isim, tür, yaş, fotoğraf
- Evcil hayvan durumları: "Mama yedi", "Yürüyüşe çıktı", "Veterinerde"
- Evcil hayvan acil durumu: "Kayboldu", "Hasta", "Kaçtı"
- Evcil hayvan bakıcısı bildirimi: bakıcıya otomatik bildirim
- Evcil hayvan konumu: GPS collar entegrasyonu hazırlığı
- Evcil hayvan bakımı hatırlatıcıları: mama saati, ilaç saati
- Evcil hayvan restore edilebilir: veterinary records

**Beklenen Çıktılar:**
- Evcil hayvan profil sayfası
- Evcil hayvan durum bileşenleri
- Evcil hayvan bakımı hatırlatma sistemi

**Bağımlılıklar:** Alt Görev 8.1, Alt Görev 8.2

---

**Görev 8 Toplam Süre Tahmini:** 3-4 hafta
**Kritik Bağımlılık:** Görev 4, Görev 6

---

## Görev 9: Çevrimdışı Performans ve Optimizasyon

**Hedef:** Zayıf internet bağlantısında bile çalışır, hızlı yüklenen ve pil tüketimi optimize edilmiş bir uygulama.

### Alt Görev 9.1: Service Worker ve PWA Altyapısı

**Aksiyonlar:**
- Vite PWA eklentisi (`vite-plugin-pwa`) kurulumu ve yapılandırması
- Service Worker oluşturma: cache-first stratejisi için static assets
- Runtime caching: API yanıtları için network-first stratejisi
- Offline fallback sayfası: internet yokken gösterilecek sayfa
- PWA manifest: icon, theme color, display: standalone, start_url
- Install prompt: "Ana ekrana ekle" yönlendirmesi
- Background sync: çevrimdışıyken yapılan istekleri online olunca gönderme
- Service Worker güncelleme: yeni versiyon mevcut olduğunda bildirim

**Beklenen Çıktılar:**
- `vite.config.ts` PWA entegrasyonu
- `public/manifest.json`
- Service Worker dosyaları
- Offline fallback sayfası

**Bağımlılıklar:** Yok

---

### Alt Görev 9.2: Veri Tabanı Optimizasyonu (IndexedDB / LocalStorage)

**Aksiyonlar:**
- IndexedDB yapısı: feed cache, kullanıcı tercihleri, offline queue
- `idb-keyval` veya `dexie.js` entegrasyonu
- Cache stratejisi: son 24 saatlik feed verisi offline erişime açık
- Cache temizleme: 24 saatten eski verileri otomatik silme
- Cache boyutu limiti: maksimum 50MB
- Cache versiyonlama: schema değişikliklerinde migration
- First paint optimizasyonu: cache'den ilk yükleme (instant load)

**Beklenen Çıktılar:**
- `src/lib/cache.ts` (IndexedDB management)
- Cache stratejisi dokümanı
- Cache temizleme fonksiyonları

**Bağımlılıklar:** Alt Görev 9.1

---

### Alt Görev 9.3: Performans Optimizasyonu

**Aksiyonlar:**
- Bundle analizi: `rollup-plugin-visualizer` ile büyük paketlerin tespiti
- Code splitting: route bazlı lazy loading
- Image optimizasyonu: WebP/AVIF format, lazy loading, responsive images
- Font optimizasyonu: font-display: swap, subset latin/tr
- Critical CSS extraction: above-the-fold CSS inline
- Tree shaking: kullanılmayan Radix UI component'lerinin çıkarılması
- Compression: Brotli/gzip compression
- HTTP/2 push: critical resource hint'leri
- Core Web Vitals hedefleri: LCP < 2.5s, FID < 100ms, CLS < 0.1
- Lighthouse skoru hedefi: Performance ≥ 90, Accessibility ≥ 95

**Beklenen Çıktılar:**
- Bundle analiz raporu
- Performans optimizasyon dosyaları
- Core Web Vitals ölçüm sonuçları

**Bağımlılıklar:** Alt Görev 9.1

---

### Alt Görev 9.4: Ağ Hataları ve Yeniden Deneme Stratejisi

**Aksiyonlar:**
- Network status monitor: online/offline durumu takibi
- Retry stratejisi: exponential backoff (1s, 2s, 4s, 8s, max 30s)
- Fallback verisi: cache'den son bilinen veriyi gösterme
- Error boundary: React error boundary ile yakalama ve kullanıcıya anlamlı hata mesajı
- Toast bildirimleri: "Bağlantı kesildi", "Yeniden bağlanılıyor", "Bağlantı kuruldu"
- Circuit breaker: art arda başarısız isteklerde geçici olarak istek göndermeme
- Health check: periyodik sunucu sağlık kontrolü
- Graceful degradation: yalnızca temel özellikler çalışır, gelişmiş özellikler devre dışı

**Beklenen Çıktılar:**
- Network monitor hook'u (`useNetworkStatus`)
- Retry utility fonksiyonları
- Error boundary bileşenleri

**Bağımlılıklar:** Alt Görev 9.2

---

### Alt Görev 9.5: Pil Tüketimi Optimizasyonu

**Aksiyonlar:**
- Battery API entegrasyonu: pil durumuna göre davranış ayarlama
- Düşük pil modu: konum güncelleme sıklığını azaltma, push bildirimleri sınırlama
- Realtime connection management: pil durumuna göre bağlantı sıklığı
- Background task management: arka plan görevlerinin optimizasyonu
- Wake lock: acil durum sırasında ekranın kapanmasını engelleme
- Animation reduction: pil durumuna göre animasyonları azaltma
- Image lazy loading: görüntülenmeyen görselleri yüklememe
- Periodic sync: belirli aralıklarla senkronizasyon (Background Sync API)

**Beklenen Çıktılar:**
- Battery-aware hook (`useBatteryStatus`)
- Power management stratejisi
- Düşük pil modu UI'ı

**Bağımlılıklar:** Alt Görev 9.3

---

### Alt Görev 9.6: Yükleme Performansı ve Skeleton UI

**Aksiyonlar:**
- Skeleton bileşenleri: her ana bileşen için skeleton varyantı
- Progressive loading: önce metin, sonra görseller, sonra interaktif elemanlar
- Susense (React 19): Suspense boundary'leri ile chunks loading
- Prefetching: hover'da sayfa prefetch
-字体 preload: kritik font'ların preload edilmesi
- Script loading: defer/async script loading strategy
- Image placeholder: blurhash veya placeholder image
- Loading states: her veri yükleme durumu için UI

**Beklenen Çıktılar:**
- Skeleton bileşenleri
- Loading state management
- Prefetch stratejisi

**Bağımlılıklar:** Alt Görev 9.3

---

**Görev 9 Toplam Süre Tahmini:** 2-3 hafta
**Kritik Bağımlılık:** Tüm önceki görevler tamamlandıktan sonra optimize edilmeli

---

## Görev 10: Dağıtım ve Altyapı

**Hedef:** Production ortamına güvenilir dağıtım, CI/CD pipeline, monitoring ve bakım altyapısı.

### Alt Görev 10.1: Build ve Dağıtım Pipeline'ı

**Aksiyonlar:**
- GitHub Actions CI/CD pipeline kurulumu
- Lint → Type Check → Test → Build → Deploy adımları
- Environment management: development, staging, production
- Build optimizasyonu: Vite production build ayarları
- Artifact yönetimi: build çıktılarının versionlanması ve saklanması
- Deploy preview: PR'lar için otomatik preview deployment
- Rollback stratejisi: başarısız deploy'da önceki versiyona dönme
- Branch stratejisi: main → staging → production

**Beklenen Çıktılar:**
- `.github/workflows/ci.yml`
- `.github/workflows/deploy.yml`
- Deploy script'leri
- README'de deploy talimatları

**Bağımlılıklar:** Tüm önceki görevler

---

### Alt Görev 10.2: Hosting ve CDN Yapılandırması

**Aksiyonlar:**
- Vercel veya Netlify hosting seçimi (Cloudflare Workers alternatif)
- Custom domain yapılandırması: `nabiz.app` veya `nabiz.com.tr`
- SSL sertifikası: otomatik Let's Encrypt
- CDN yapılandırması: static assets için global CDN
- Edge functions: latency-sensitive endpoint'ler için edge deployment
- Caching headers: `Cache-Control`, `ETag`, `Last-Modified`
- Redirect kuralları: www → apex, HTTP → HTTPS
- DNS yapılandırması: A, CAA, MX kayıtları

**Beklenen Çıktılar:**
- Hosting konfigürasyon dosyaları
- DNS yapılandırma talimatları
- SSL sertifika doğrulaması

**Bağımlılıklar:** Alt Görev 10.1

---

### Alt Görev 10.3: Monitoring ve Hata Takibi

**Aksiyonlar:**
- Sentry entegrasyonu: hata raporlama ve performans monitoring
- Uptime monitoring: UptimeRobot veya BetterStack
- Analytics: Plausible (privacy-first) veya Umami
- Core Web Vitals monitoring: web-vitals library
- Custom metrics: durum publish hızı, realtime connection süresi
- Alerting: hata oranı arttığında e-posta/SMS bildirimi
- Dashboard: operational metrics summary
- Log management: structured logging

**Beklenen Çıktılar:**
- Sentry konfigürasyonu
- Monitoring dashboard
- Alerting kuralları
- Log formatı standardı

**Bağımlılıklar:** Alt Görev 10.2

---

### Alt Görev 10.4: Güvenlik Denetimi ve Penetrasyon Testi

**Aksiyonlar:**
- OWASP Top 10 kontrol listesi
- XSS koruması: React'in otomatik escape'i + ek sanitizasyon
- CSRF koruması: SameSite cookie, CSRF token
- SQL Injection koruması: parameterized queries (Supabase handles)
- Rate limiting: API endpoint'leri için rate limiting
- Input validation: Zod ile tüm input validasyonu
- HTTPS zorlaması: Mixed content engelleme
- Content Security Policy (CSP) headers
- Sensitive data exposure kontrolü: API key'lerin istemciye sızması
- Third-party dependency audit: `npm audit`
- Penetrasyon testi:专业的 pentest firması ile test
- Vulnerability disclosure policy

**Beklenen Çıktılar:**
- Güvenlik denetim raporu
- Düzeltilmiş güvenlik açıkları
- Penetrasyon testi raporu
- Güvenlik politikası dokümanı

**Bağımlılıklar:** Alt Görev 10.2

---

### Alt Görev 10.5: Yasal Uyumluluk ve KVKK

**Aksiyonlar:**
- Gizlilik Politikası (Privacy Policy): İngilizce ve Türkçe
- Kullanım Şartları (Terms of Service)
- KVKK Aydınlatma Metni: kişisel verilerin işlenmesi
- Açık Rıza Metni: konum verisi, bildirim izni için
- Veri İşleme Sözleşmesi (DPA): Supabase ile
- Veri Saklama Politikası: ne kadar süre, ne tür veriler
- Veri Silme Talebi: kullanıcının tüm verilerini silme hakkı
- Çerez Politikası: kullandığımız çerezler ve amaçları
- 7/24 destek hattı bilgisi
- Yasal temsilci bilgisi
- KVKK Veri Sorumlusu Sicil Bilgisi

**Beklenen Çıktılar:**
- `/gizlilik-politikasi` sayfası
- `/kullanim-sartlari` sayfası
- KVKK dokümanları
- Çerez politikası

**Bağımlılıklar:** Alt Görev 10.2

---

### Alt Görev 10.6: Test Stratejisi ve Kalite Güvencesi

**Aksiyonlar:**
- Unit testler: Vitest ile tüm utility fonksiyonları ve hook'lar
- Component testleri: React Testing Library ile bileşen testleri
- Integration testleri: API entegrasyon testleri
- E2E testleri: Playwright ile tam akış testleri
- Acil durum akışı E2E: Tetikleme → Bildirim → Çözümleme
- Accessibility testleri: axe-core + Playwright
- Performance testleri: Lighthouse CI
- Visual regression testleri: Chromatic veya Percy
- Test coverage hedefi: %80 minimum
- Mock stratejisi: MSW (Mock Service Worker) ile API mocking

**Beklenen Çıktılar:**
- Test dosyaları (`src/__tests__/`)
- Test konfigürasyonu (vitest.config.ts)
- Test coverage raporu
- CI'da otomatik test çalıştırma

**Bağımlılıklar:** Alt Görev 10.1

---

### Alt Görev 10.7: Dokümantasyon ve Bakım Planı

**Aksiyonlar:**
- Teknik dokümantasyon: mimari kararlar, API referansı, veritabanı şeması
- Kullanıcı kılavuzu: adım adım kullanım talimatları
- Geliştirici kılavuzu: kurulum, katkıda bulunma
- API dokümantasyonu: tüm Supabase fonksiyonları için OpenAPI spec
- CHANGELOG: versiyon değişiklikleri
- DEPLOY.md: dağıtım talimatları
- Monitoring runbook: alarm durumunda yapılması gerekenler
- Backup/restore runbook: veri kurtarma prosedürü
- Quarterly review: 3 aylık teknik borç ve iyileştirme planı
- Versioning stratejisi: semantic versioning (v1.0.0)

**Beklenen Çıktılar:**
- README.md güncellenmesi
- docs/ dizininde teknik dokümanlar
- API dokümantasyonu
- Bakım takvimi

**Bağımlılıklar:** Alt Görev 10.1-10.6

---

**Görev 10 Toplam Süre Tahmini:** 3-4 hafta
**Kritik Bağımlılık:** Tüm geliştirme tamamlandıktan sonra

---

## Proje Zaman Çizelgesi Özeti

| Görev | Ad | Süre | Bağımlılık |
|-------|-----|------|-----------|
| 1 | Tasarım Sistemi ve UI | 3-4 hafta | Yok |
| 2 | Acil Durum/SOS Mimarisi | 3-4 hafta | Yok |
| 3 | Konum ve Harita | 2-3 hafta | Yok |
| 4 | Backend (Supabase) | 4-5 hafta | Yok |
| 5 | Kimlik Doğrulama | 3-4 hafta | Görev 4.2 |
| 6 | Gerçek Zamanlı İletişim | 2-3 hafta | Görev 4 |
| 7 | Acil Hat Entegrasyonu | 2-3 hafta | Görev 2, 3 |
| 8 | Durum Yönetim Sistemi | 3-4 hafta | Görev 4, 6 |
| 9 | Çevrimdışı/Performans | 2-3 hafta | Tümü |
| 10 | Dağıtım/Altyapı | 3-4 hafta | Tümü |

**Önerilen Paralel Çalışma:**
- **Hafta 1-4:** Görev 1 (Tasarım) + Görev 4 (Backend) paralel
- **Hafta 2-5:** Görev 2 (SOS) + Görev 3 (Harita) + Görev 6 (Realtime) paralel
- **Hafta 4-7:** Görev 5 (Auth) + Görev 7 (Hotline) + Görev 8 (Durum) paralel
- **Hafta 7-9:** Görev 9 (Performans) + Görev 10 (Dağıtım)

**Toplam Tahmini Süre:** 12-16 hafta (3-4 ay) — 2-3 kişilik bir ekip ile

---

## Kritik Başarı Faktörleri

1. **Güvenilirlik:** Acil durum özellikleri %99.9 uptime ile çalışmalıdır
2. **Hız:** İlk yükleme < 3 saniye, etkileşim < 100ms
3. **Erişilebilirlik:** WCAG 2.1 AA minimum, yaşlı kullanıcılar için özel optimizasyon
4. **Güvenlik:** KVKK/CCPA uyumluluğu, veri şifreleme
5. **Basitlik:** Tek dokunuşla temel işlemler, minimal öğrenme eğrisi

---

*Bu plan 26 Ağustos 2026 tarihinde oluşturulmuştur. Projelerin doğası gereği öncelikler ve süreler revize edilebilir.*
