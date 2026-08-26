import { STATUS_BY_ID, STATUS_CATALOG } from "@/features/status/data/statusCatalog";
import type {
  FeedFilters,
  Person,
  PublishStatusInput,
  ReactionKind,
  StatusEntry,
} from "@/types/status";

/**
 * Sahte (mock) API katmanı.
 * TEK amacı: gerçek backend gelene kadar UI'ı beslemek.
 * Gerçek entegrasyonda bu dosyadaki fonksiyon gövdeleri Supabase
 * çağrılarıyla değiştirilir; imzalar aynı kalır, bu yüzden hiçbir
 * bileşen veya hook değişmek zorunda kalmaz.
 */

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;

/** Ağ gecikmesi simülasyonu — iskelet (skeleton) durumlarını test etmek için. */
const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

const emptyReactions = (): Record<ReactionKind, number> => ({ hug: 0, heart: 0, coffee: 0 });

export const CURRENT_USER: Person = {
  id: "me",
  name: "Sen",
  relation: "Ben",
  circle: "inner",
};

const PEOPLE: Person[] = [
  { id: "p1", name: "Ayşe Yılmaz", relation: "Anne", circle: "inner" },
  { id: "p2", name: "Mehmet Yılmaz", relation: "Baba", circle: "inner" },
  { id: "p3", name: "Elif", relation: "Kardeş", circle: "inner" },
  { id: "p4", name: "Zeynep Kaya", relation: "En yakın arkadaş", circle: "close" },
  { id: "p5", name: "Can Demir", relation: "Arkadaş", circle: "close" },
  { id: "p6", name: "Fatma Nine", relation: "Babaanne", circle: "inner" },
  { id: "p7", name: "Burak", relation: "Kuzen", circle: "close" },
  { id: "p8", name: "Selin", relation: "Ev arkadaşı", circle: "close" },
];

/** Basit yardımcı: kişi + durum + yaş(dakika) ile kayıt üretir. */
function entry(
  id: string,
  personId: string,
  statusId: string,
  minutesAgo: number,
  extra?: Partial<StatusEntry>,
): StatusEntry {
  const person = PEOPLE.find((p) => p.id === personId)!;
  const status = STATUS_BY_ID.get(statusId)!;
  return {
    id,
    person,
    status,
    createdAt: new Date(Date.now() - minutesAgo * MINUTE).toISOString(),
    privacy: person.circle,
    reactions: emptyReactions(),
    myReactions: [],
    ...extra,
  };
}

/** Bellek içi "veritabanı". Mutasyonlar bu diziyi günceller. */
let feed: StatusEntry[] = [
  entry("s1", "p1", "peaceful", 8, {
    note: "Balkonda çay içiyorum, hava çok güzel.",
    reactions: { hug: 2, heart: 4, coffee: 1 },
  }),
  entry("s2", "p6", "medical", 3, {
    note: "Tansiyonum çok düştü, yalnızım.",
    reactions: { hug: 3, heart: 1, coffee: 0 },
  }),
  entry("s3", "p3", "anxious", 25, {
    note: "Yarınki sınav için çok gerginim.",
    reactions: { hug: 1, heart: 2, coffee: 0 },
  }),
  entry("s4", "p2", "atwork", 55),
  entry("s5", "p4", "needcall", 70, { note: "Müsait olunca ararsan çok iyi olur." }),
  entry("s6", "p5", "energetic", 130, { reactions: { hug: 0, heart: 3, coffee: 2 } }),
  entry("s7", "p8", "sick", 300, { note: "Grip oldum, yatıyorum." }),
  entry("s8", "p7", "traveling", 9 * 60, { note: "İzmir yolundayım." }),
  // 24 saati geçmiş -> "Bugün haber yok" durumunu tetikler
  entry("s9", "p1", "tired", 30 * 60),
];

/** Mevcut kullanıcının en son durumu (yoksa null). */
let myStatus: StatusEntry | null = entry("me1", "p1", "focused", 45);
myStatus = myStatus ? { ...myStatus, id: "me-1", person: CURRENT_USER, privacy: "close" } : null;

/** 24 saatten yeni mi? (efemer durum kuralı) */
export function isActive(entryItem: StatusEntry): boolean {
  return Date.now() - new Date(entryItem.createdAt).getTime() < 24 * HOUR;
}

/** Feed'i getirir. Gerçekte: `supabase.from("statuses").select(...)`. */
export async function fetchFeed(filters: FeedFilters): Promise<StatusEntry[]> {
  await delay();
  return feed
    .filter((e) => (filters.circle === "everyone" ? true : e.person.circle === filters.circle))
    .filter((e) => (filters.onlyActive ? isActive(e) : true))
    .sort((a, b) => {
      // Acil durumlar her zaman en üstte, sonra en yeni.
      const urgency = Number(b.status.category === "urgent") - Number(a.status.category === "urgent");
      if (urgency !== 0) return urgency;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
}

export async function fetchMyStatus(): Promise<StatusEntry | null> {
  await delay(200);
  return myStatus;
}

/** Yeni durum yayınlar. Gerçekte: insert + realtime broadcast. */
export async function publishStatus(input: PublishStatusInput): Promise<StatusEntry> {
  await delay(350);
  const status = STATUS_BY_ID.get(input.statusId);
  if (!status) throw new Error(`Bilinmeyen durum: ${input.statusId}`);

  const created: StatusEntry = {
    id: `me-${Date.now()}`,
    person: CURRENT_USER,
    status,
    createdAt: new Date().toISOString(),
    privacy: input.privacy,
    note: input.note,
    reactions: emptyReactions(),
    myReactions: [],
  };
  myStatus = created;
  return created;
}

/** Tek dokunuş empati tepkisi gönderir / geri alır. */
export async function toggleReaction(
  entryId: string,
  kind: ReactionKind,
): Promise<StatusEntry | null> {
  await delay(150);
  let updated: StatusEntry | null = null;
  feed = feed.map((e) => {
    if (e.id !== entryId) return e;
    const has = e.myReactions.includes(kind);
    updated = {
      ...e,
      reactions: { ...e.reactions, [kind]: Math.max(0, e.reactions[kind] + (has ? -1 : 1)) },
      myReactions: has ? e.myReactions.filter((k) => k !== kind) : [...e.myReactions, kind],
    };
    return updated;
  });
  return updated;
}

/** "Nabız yokla" — kişiden güncelleme ister. Gerçekte: bildirim gönderir. */
export async function nudgePerson(personId: string): Promise<{ personId: string }> {
  await delay(250);
  return { personId };
}

/** Katalog uzaktan da gelebilir; hook'lar bu fonksiyonu kullanır. */
export async function fetchStatusCatalog() {
  return STATUS_CATALOG;
}

export const MOCK_PEOPLE = PEOPLE;
