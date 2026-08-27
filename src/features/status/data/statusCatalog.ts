import type { MoodTone, StatusCategory, StatusOption } from "@/types/status";

/**
 * 120+ mikro-durum kataloğu.
 * Bu dosya saf veridir; backend'e taşınırken bir `statuses` tablosuna
 * doğrudan seed edilebilir. Bileşenler bu katalogu asla kopyalamaz,
 * sadece okur.
 */

/** Kategori meta verisi — sekme başlıkları ve ikonlar için. */
export const STATUS_CATEGORIES: {
  id: StatusCategory;
  label: string;
  emoji: string;
}[] = [
  { id: "emotion", label: "Duygular", emoji: "🫧" },
  { id: "physical", label: "Bedensel", emoji: "🫀" },
  { id: "need", label: "İhtiyaçlar", emoji: "🤝" },
  { id: "situation", label: "Durumlar", emoji: "🧭" },
  { id: "urgent", label: "Acil", emoji: "🆘" },
];

/** Ruh hali tonu -> Tailwind semantik sınıfları. */
export const TONE_STYLES: Record<
  MoodTone,
  { surface: string; ink: string; border: string; dot: string }
> = {
  calm: {
    surface: "bg-mood-calm-surface",
    ink: "text-mood-calm-ink",
    border: "border-mood-calm/25",
    dot: "bg-mood-calm",
  },
  joy: {
    surface: "bg-mood-joy-surface",
    ink: "text-mood-joy-ink",
    border: "border-mood-joy/30",
    dot: "bg-mood-joy",
  },
  low: {
    surface: "bg-mood-low-surface",
    ink: "text-mood-low-ink",
    border: "border-mood-low/25",
    dot: "bg-mood-low",
  },
  need: {
    surface: "bg-mood-need-surface",
    ink: "text-mood-need-ink",
    border: "border-mood-need/25",
    dot: "bg-mood-need",
  },
  urgent: {
    surface: "bg-mood-urgent-surface",
    ink: "text-mood-urgent-ink",
    border: "border-mood-urgent/60",
    dot: "bg-mood-urgent",
  },
};

/** Küçük yardımcı: katalog girdisini kısa yazımla oluşturur. */
const s = (
  id: string,
  label: string,
  emoji: string,
  category: StatusCategory,
  tone: MoodTone,
  keywords?: string[],
): StatusOption => ({ id, label, emoji, category, tone, keywords });

export const STATUS_CATALOG: StatusOption[] = [
  // ---------------------------------------------------------------- Duygular
  s("happy", "Mutlu", "😊", "emotion", "joy", ["keyifli", "iyi"]),
  s("joyful", "Neşeli", "😄", "emotion", "joy"),
  s("excited", "Heyecanlı", "🤩", "emotion", "joy"),
  s("grateful", "Şükran dolu", "🙏", "emotion", "joy", ["minnettar"]),
  s("hopeful", "Umutlu", "🌱", "emotion", "joy"),
  s("proud", "Gururlu", "🎖️", "emotion", "joy"),
  s("inlove", "Aşık", "🥰", "emotion", "joy"),
  s("playful", "Şakacı", "😜", "emotion", "joy"),
  s("motivated", "Motive", "🚀", "emotion", "joy", ["azimli"]),
  s("relieved", "Rahatlamış", "😮‍💨", "emotion", "calm"),
  s("peaceful", "Huzurlu", "🕊️", "emotion", "calm", ["sakin", "dingin"]),
  s("calm", "Sakin", "🌊", "emotion", "calm"),
  s("content", "Halinden memnun", "🙂", "emotion", "calm"),
  s("focused", "Odaklanmış", "🎯", "emotion", "calm"),
  s("thoughtful", "Düşünceli", "💭", "emotion", "calm"),
  s("nostalgic", "Nostaljik", "📻", "emotion", "calm"),
  s("curious", "Meraklı", "🔍", "emotion", "calm"),
  s("okay", "İdare eder", "😐", "emotion", "calm", ["normal", "fena degil"]),
  s("anxious", "Kaygılı", "😟", "emotion", "low", ["endişeli", "anksiyete"]),
  s("stressed", "Stresli", "😖", "emotion", "low", ["gergin"]),
  s("overwhelmed", "Bunalmış", "🌀", "emotion", "low", ["boğulmuş"]),
  s("sad", "Üzgün", "😢", "emotion", "low", ["mutsuz"]),
  s("lonely", "Yalnız", "🫥", "emotion", "low"),
  s("homesick", "Memleket özlemi", "🏡", "emotion", "low", ["özlem"]),
  s("angry", "Öfkeli", "😠", "emotion", "low", ["sinirli", "kızgın"]),
  s("frustrated", "Bıkmış", "😤", "emotion", "low"),
  s("disappointed", "Hayal kırıklığı", "😞", "emotion", "low"),
  s("guilty", "Suçlu hissediyor", "😔", "emotion", "low"),
  s("insecure", "Kendinden emin değil", "🫤", "emotion", "low"),
  s("numb", "Hissizleşmiş", "🪫", "emotion", "low"),
  s("grieving", "Yas tutuyor", "🖤", "emotion", "low", ["kayıp"]),
  s("scared", "Korkmuş", "😨", "emotion", "low"),
  s("confused", "Kafası karışık", "🤔", "emotion", "low"),
  s("impatient", "Sabırsız", "⏳", "emotion", "low"),
  s("sensitive", "Kırılgan", "🫧", "emotion", "low", ["hassas"]),

  // ---------------------------------------------------------------- Bedensel
  s("energetic", "Enerjik", "⚡", "physical", "joy", ["dinç"]),
  s("wellrested", "Dinlenmiş", "🛌", "physical", "calm"),
  s("workingout", "Spor yapıyor", "🏋️", "physical", "joy", ["egzersiz"]),
  s("walking", "Yürüyüşte", "🚶", "physical", "calm"),
  s("stretching", "Esniyor", "🧘", "physical", "calm", ["yoga"]),
  s("healthy", "Sağlıklı", "💚", "physical", "calm"),
  s("recovering", "İyileşiyor", "🩹", "physical", "calm", ["nekahet"]),
  s("tired", "Yorgun", "🥱", "physical", "low"),
  s("exhausted", "Bitkin", "🫠", "physical", "low", ["tükenmiş"]),
  s("sleepy", "Uykulu", "😴", "physical", "low"),
  s("insomnia", "Uykusuz", "🌙", "physical", "low", ["uyuyamıyor"]),
  s("sick", "Hasta", "🤒", "physical", "low"),
  s("fever", "Ateşi var", "🌡️", "physical", "low"),
  s("headache", "Baş ağrısı", "🤯", "physical", "low", ["migren"]),
  s("stomachache", "Mide ağrısı", "🫄", "physical", "low", ["karın"]),
  s("backpain", "Sırt ağrısı", "🦴", "physical", "low", ["bel"]),
  s("nauseous", "Midesi bulanıyor", "🤢", "physical", "low"),
  s("dizzy", "Başı dönüyor", "💫", "physical", "low"),
  s("allergies", "Alerjisi azdı", "🤧", "physical", "low"),
  s("injured", "Yaralandı", "🩼", "physical", "low", ["sakatlık"]),
  s("indoctor", "Doktorda", "🩺", "physical", "need", ["hastane", "muayene"]),
  s("takingmeds", "İlaç saati", "💊", "physical", "calm", ["tedavi"]),
  s("hungry", "Aç", "🍽️", "physical", "low"),
  s("eating", "Yemek yiyor", "🍲", "physical", "calm"),
  s("hydrating", "Su içiyor", "💧", "physical", "calm"),
  s("coffeetime", "Kahve molası", "☕", "physical", "joy"),
  s("cold", "Üşüyor", "🧣", "physical", "low"),
  s("hot", "Sıcaktan bunaldı", "🥵", "physical", "low"),
  s("pms", "Regl dönemi", "🌸", "physical", "low", ["adet"]),
  s("pregnancy", "Hamilelik yorgunluğu", "🤰", "physical", "low"),

  // ------------------------------------------------------------- İhtiyaçlar
  s("needcall", "Aranmak istiyor", "📞", "need", "need", ["telefon", "sesini duymak"]),
  s("needcompany", "Eşlik edilsin", "🫂", "need", "need", ["birlikte", "yanımda ol"]),
  s("needtalk", "Konuşmak istiyor", "💬", "need", "need", ["dertleşmek"]),
  s("needlisten", "Dinlenmek istiyor", "👂", "need", "need"),
  s("needhelp", "Yardım gerekiyor", "🆘", "need", "need", ["destek"]),
  s("needadvice", "Fikir alacak", "🧠", "need", "need", ["tavsiye"]),
  s("needhug", "Sarılmaya ihtiyacı var", "🤗", "need", "need"),
  s("needspace", "Biraz alan istiyor", "🌫️", "need", "need", ["yalnız kalmak"]),
  s("needquiet", "Sessizlik istiyor", "🤫", "need", "need"),
  s("needride", "Yol/araç lazım", "🚗", "need", "need", ["ulaşım"]),
  s("needgroceries", "Alışveriş lazım", "🛒", "need", "need", ["market"]),
  s("needchildcare", "Çocuğa bakılsın", "🧒", "need", "need"),
  s("needmoneyhelp", "Maddi destek gerek", "🪙", "need", "need"),
  s("needprayer", "Dua istiyor", "🤲", "need", "need"),
  s("needmotivation", "Motivasyon lazım", "🔥", "need", "need"),
  s("needdistraction", "Kafa dağıtmak istiyor", "🎲", "need", "need"),
  s("needfood", "Yemek gerek", "🥘", "need", "need"),
  s("needdoctor", "Doktora gitmesi gerek", "🏥", "need", "need"),
  s("needcheckin", "Kontrol edilsin", "✅", "need", "need", ["haber al"]),
  s("needtech", "Teknik yardım", "🛠️", "need", "need", ["telefon bozuk"]),
  s("needpatience", "Anlayış istiyor", "🫶", "need", "need"),
  s("needsleep", "Uyumaya ihtiyacı var", "😪", "need", "need"),
  s("needwalk", "Yürüyüş arkadaşı", "🚶‍♀️", "need", "need"),
  s("needpickup", "Alınması gerek", "📍", "need", "need", ["gel al"]),
  s("nothingneeded", "Bir şeye ihtiyacı yok", "👌", "need", "calm", ["iyiyim"]),

  // ---------------------------------------------------------------- Durumlar
  s("atwork", "İşte", "💼", "situation", "calm", ["mesai"]),
  s("inmeeting", "Toplantıda", "📊", "situation", "calm"),
  s("studying", "Ders çalışıyor", "📚", "situation", "calm", ["sınav"]),
  s("commuting", "Yolda", "🚌", "situation", "calm", ["trafik"]),
  s("driving", "Araba kullanıyor", "🚙", "situation", "calm"),
  s("traveling", "Seyahatte", "✈️", "situation", "joy", ["tatil"]),
  s("athome", "Evde", "🏠", "situation", "calm"),
  s("withfamily", "Ailesiyle", "👨‍👩‍👧", "situation", "joy"),
  s("withfriends", "Arkadaşlarıyla", "🎉", "situation", "joy"),
  s("alonetime", "Kendine vakit", "🕯️", "situation", "calm"),
  s("cooking", "Yemek yapıyor", "👩‍🍳", "situation", "calm"),
  s("cleaning", "Ev işleri", "🧺", "situation", "calm"),
  s("shopping", "Alışverişte", "🛍️", "situation", "calm"),
  s("praying", "İbadette", "🕌", "situation", "calm"),
  s("offline", "Çevrimdışı", "🔌", "situation", "low", ["ulaşılamaz"]),
  s("lowbattery", "Şarjı azalıyor", "🔋", "situation", "low"),
  s("busy", "Meşgul", "⛔", "situation", "low"),
  s("celebrating", "Kutlama var", "🎂", "situation", "joy", ["doğum günü"]),
  s("caregiving", "Hasta bakımı yapıyor", "🧑‍⚕️", "situation", "need"),
  s("waitingnews", "Haber bekliyor", "📮", "situation", "low"),

  // --------------------------------------------------------- Evcil Hayvan
  s("petatheme", "Mama yedi", "🍖", "situation", "calm", ["mama", "beslenme", "evcil"]),
  s("petwalking", "Yürüyüşe çıktı", "🐕", "situation", "joy", ["köpek", "dışarı", "evcil"]),
  s("petvet", "Veterinerde", "🏥", "situation", "need", ["doktor", "muayene", "evcil"]),
  s("petlost", "Kayboldu", "🐾", "situation", "urgent", ["kayıp", "evcil", "arama"]),
  s("petsick", "Hasta", "🤒", "situation", "low", ["hasta", "hastalık", "evcil"]),
  s("petescaped", "Kaçtı", "💨", "situation", "urgent", ["kaçtı", "evcil", "arama"]),
  s("petplayful", "Oyun oynuyor", "🧶", "situation", "joy", ["eğlence", "kedi", "evcil"]),
  s("petresting", "Dinleniyor", "😴", "situation", "calm", ["uyku", "dinlenme", "evcil"]),
  s("petgrooming", "Taranıyor", "✨", "situation", "calm", ["bakım", "temizlik", "evcil"]),
  s("petfeeding", "Besleniyor", "🥩", "situation", "calm", ["mama", "yemek", "evcil"]),
  s("pethome", "Evde değilim", "🏠", "situation", "calm", ["dışarıda", "evde yok"]),
  s("petalone", "evde tek", "🐾", "situation", "need", ["yalnız", "tek başına"]),
  s("petneedfood", "Beslenmesi gerek", "🍖", "situation", "need", ["mama", "aç", "besle"]),
  s("petbathing", "Yıkanıyor", "🛁", "situation", "calm", ["banyo", "temizlik", "evcil"]),
  s("pettraining", "Eğitimde", "🎓", "situation", "calm", ["eğitim", "öğrenme", "evcil"]),
  s("pettraveling", "Yolculukta", "🚗", "situation", "calm", ["seyahat", "taşıma", "evcil"]),

  // ------------------------------------------------------- Yaşlı / Büyüklere Özel
  s("elsafe", "Güvendeyim", "🛡️", "situation", "calm", ["güvenli", "yaşlı", "büyük"]),
  s("elmeds", "İlaçlarımı aldım", "💊", "situation", "calm", ["ilaç", "tedavi", "yaşlı"]),
  s("elfed", "Yemek yedim", "🍽️", "situation", "calm", ["yemek", "beslenme", "yaşlı"]),
  s("elresting", "Dinleniyorum", "🪑", "situation", "calm", ["dinlenme", "rahat", "yaşlı"]),
  s("elwalking", "Yürüyüş yapıyorum", "🚶", "situation", "calm", ["yürüyüş", "egzersiz", "yaşlı"]),
  s("elvisitor", "Misafir var", "👥", "situation", "joy", ["misafir", "sosyal", "yaşlı"]),
  s("elcall", "Telefon bekliyorum", "📱", "situation", "calm", ["telefon", "görüşme", "yaşlı"]),
  s("elwatching", "Tv izliyorum", "📺", "situation", "calm", ["televizyon", "eğlence", "yaşlı"]),
  s("elreading", "Okuyorum", "📖", "situation", "calm", ["kitap", "okuma", "yaşlı"]),
  s("elpraying", "İbadet ediyorum", "🤲", "situation", "calm", ["ibadet", "dua", "yaşlı"]),
  s("elnotfine", "İyi değilim", "😟", "situation", "low", ["hasta", "kötü", "yaşlı"]),
  s("elalone", "Yalnızım", "😔", "situation", "low", ["yalnız", "yaşlı", "bırakılmış"]),
  s("elconfused", "Kafam karışık", "🤔", "situation", "low", ["kafa karışıklığı", "yaşlı"]),

  // ------------------------------------------------------- Genç / Gençlere Özel
  s("yathome", "Eve geldim", "🏠", "situation", "calm", ["ev", "dönüş", "genç"]),
  s("yaoutside", "Dışarıdayım", "🌆", "situation", "joy", ["dışarı", "gezi", "genç"]),
  s("yaschool", "Okulda", "🏫", "situation", "calm", ["okul", "ders", "eğitim"]),
  s("yawork", "İşteyim", "💼", "situation", "calm", ["çalışma", "mesai", "genç"]),
  s("yahangout", "Arkadaşlarla takılıyorum", "🎉", "situation", "joy", ["arkadaş", "eğlence", "genç"]),
  s("yagaming", "Oyun oynuyorum", "🎮", "situation", "joy", ["oyun", "eğlence", "genç"]),
  s("yalisten", "Müzik dinliyorum", "🎵", "situation", "calm", ["müzik", "kulaklık", "genç"]),
  s("yastudying", "Ders çalışıyorum", "📖", "situation", "calm", ["ders", "sınav", "çalışma"]),
  s("yacafe", "Kafedeyim", "☕", "situation", "calm", ["kafe", "kahve", "genç"]),
  s("yagym", "Spor salonunda", "🏋️", "situation", "joy", ["spor", "egzersiz", "genç"]),
  s("yalate", "Geç kaldım", "⏰", "situation", "low", ["gecikme", "saat", "genç"]),
  s("yabored", "Sıkıldım", "😒", "situation", "low", ["sıkıntı", "bıkkınlık", "genç"]),
  s("yastressed", "Sınav stresi", "😰", "situation", "low", ["stres", "sınav", "genç"]),
  s("yaparty", "Partideyim", "🥳", "situation", "joy", ["parti", "eğlence", "genç"]),
  s("yatraveling", "Seyahat ediyorum", "✈️", "situation", "joy", ["seyahat", "tatil", "genç"]),

  // ------------------------------------------------------------------- Acil
  s("medical", "Tıbbi acil durum", "🚑", "urgent", "urgent", ["ambulans", "sos"]),
  s("stranded", "Mahsur kaldı", "🧭", "urgent", "urgent", ["yolda kaldım"]),
  s("unsafe", "Güvende değil", "⚠️", "urgent", "urgent", ["tehlike"]),
  s("accident", "Kaza geçirdi", "💥", "urgent", "urgent"),
  s("panicattack", "Panik atak", "😰", "urgent", "urgent", ["kriz"]),
  s("callnow", "Hemen arayın", "☎️", "urgent", "urgent", ["acil ara"]),
  s("petemergency", "Evcil hayvan acil", "🚨", "urgent", "urgent", ["evcil", "acil", "hayvan"]),
  s("personmissing", "Kayıp — kişi", "🚨", "urgent", "urgent", ["kayıp", "arama", "kayboldu", "alzheimer"]),
];

/** Acil (SOS) durumları — SOS panelinde ayrı gösterilir. */
export const URGENT_STATUSES = STATUS_CATALOG.filter((o) => o.category === "urgent");

/** Evcil hayvan durumları. */
export const PET_STATUSES = STATUS_CATALOG.filter(
  (o) =>
    o.id.startsWith("pet") ||
    o.keywords?.some((k) => k === "evcil"),
);

/** Kimlik ile hızlı erişim için indeks. */
export const STATUS_BY_ID = new Map(STATUS_CATALOG.map((o) => [o.id, o]));

/**
 * Türkçe karakterleri sadeleştirerek arama uyumunu artırır
 * ("üzgün" -> "uzgun"), böylece klavye farklarında da eşleşme olur.
 */
export function normalizeTr(value: string): string {
  return value
    .toLocaleLowerCase("tr")
    .replaceAll("ı", "i")
    .replaceAll("İ", "i")
    .replaceAll("ş", "s")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c")
    .trim();
}

/** Katalogda etiket + anahtar kelime üzerinden arama yapar. */
export function searchStatuses(query: string, options = STATUS_CATALOG): StatusOption[] {
  const q = normalizeTr(query);
  if (!q) return options;
  return options.filter((o) => {
    const haystack = normalizeTr([o.label, ...(o.keywords ?? [])].join(" "));
    return haystack.includes(q);
  });
}
