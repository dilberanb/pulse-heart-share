export interface MeetingPoint {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  distance: string;
}

export interface EmergencyKitItem {
  id: string;
  label: string;
  checked: boolean;
}

export interface EarthquakePlanStep {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export const MOCK_MEETING_POINTS: MeetingPoint[] = [
  {
    id: "mp-1",
    name: "Evimin Önü",
    address: "Atatürk Mah. Cumhuriyet Cad. No:12, Kadıköy/İstanbul",
    lat: 40.9828,
    lng: 29.0312,
    distance: "350m uzağında",
  },
  {
    id: "mp-2",
    name: "Okul Bahçesi",
    address: "İstiklal Mah. Eğitim Sok. No:5, Kadıköy/İstanbul",
    lat: 40.9845,
    lng: 29.0285,
    distance: "520m uzağında",
  },
  {
    id: "mp-3",
    name: "Park Alanı",
    address: "Yeşilvadi Parkı, Bağdat Cad. Kükürtlü Durağı, Kadıköy/İstanbul",
    lat: 40.981,
    lng: 29.035,
    distance: "780m uzağında",
  },
];

export const EMERGENCY_KIT_ITEMS: EmergencyKitItem[] = [
  { id: "kit-1", label: "Su (kişi başı 3 litre)", checked: false },
  { id: "kit-2", label: "Kuru gıda ve konserve", checked: false },
  { id: "kit-3", label: "El feneri ve yedek piller", checked: false },
  { id: "kit-4", label: "İlk yardım çantası", checked: false },
  { id: "kit-5", label: "Önemli evraklar (nüfus cüzdanı, sigorta)", checked: false },
  { id: "kit-6", label: "Nakit para", checked: false },
  { id: "kit-7", label: "Şarj aleti ve powerbank", checked: false },
  { id: "kit-8", label: "Radyo", checked: false },
  { id: "kit-9", label: "Kalın battaniye", checked: false },
  { id: "kit-10", label: "Gıda intoleransı / ilaç", checked: false },
];

export const EARTHQUAKE_PLAN_STEPS: EarthquakePlanStep[] = [
  {
    id: 1,
    title: "Deprem Anı — ÇÖK, KORUN, BEKLE",
    description:
      "Yere çökün, sağlam bir masanın altına girin veya başınızı iki elinizle koruyun. Sarsıntı bitene kadar bekleyin.",
    icon: "🫨",
  },
  {
    id: 2,
    title: "Sakin Ol ve Çevreni Kontrol Et",
    description:
      "Panik yapmayın. Gaz kaçağı, yangın veya yaralı olup olmadığını kontrol edin.",
    icon: "👁️",
  },
  {
    id: 3,
    title: "Bina Terk Etme Kararı",
    description:
      "Hasar gördüyseniz veya yangın riski varsa binaları hemen terk edin. Asansör kullanmayın.",
    icon: "🚪",
  },
  {
    id: 4,
    title: "Toplanma Noktasına Git",
    description:
      "Aile bireyleriyle belirlenmiş toplanma noktasına gidin. Kalabalık alanlardan uzak durun.",
    icon: "📍",
  },
  {
    id: 5,
    title: "Aile Bireylerini Kontrol Et",
    description:
      "Aile bireylerine ulaşmaya çalışın. Ulaşılamıyorsa SMS veya sosyal medya üzerinden bağlantı kurmaya çalışın.",
    icon: "📱",
  },
  {
    id: 6,
    title: "AFAD ve Resmi Kaynakları Takip Et",
    description:
      "Radyo, televizyon veya AFAD resmi web sitesinden güncel bilgileri takip edin. Dedikodulara itibar etmeyin.",
    icon: "📻",
  },
];
