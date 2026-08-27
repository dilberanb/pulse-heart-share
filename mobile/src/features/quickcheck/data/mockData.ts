import type { FamilyMemberStatus } from "@/types";

export const MOCK_FAMILY_MEMBERS: FamilyMemberStatus[] = [
  {
    id: "fam-ali",
    name: "Ali",
    relation: "Baba · +65",
    status: "safe",
    statusLabel: "Her Şey Yolunda",
    batteryLevel: 87,
    lastSeenAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    hasPendingCheck: false,
  },
  {
    id: "fam-ayse",
    name: "Ayşe",
    relation: "Anne · 🐕",
    status: "busy",
    statusLabel: "Meşgul",
    batteryLevel: 45,
    lastSeenAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    hasPendingCheck: false,
  },
  {
    id: "fam-mehmet",
    name: "Mehmet",
    relation: "Oğul",
    status: "pending",
    statusLabel: "Cevap Bekleniyor",
    batteryLevel: 92,
    lastSeenAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    hasPendingCheck: true,
  },
  {
    id: "fam-zeynep",
    name: "Zeynep",
    relation: "Kız · 🏥",
    status: "problem",
    statusLabel: "Sorun Var",
    batteryLevel: 12,
    lastSeenAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    hasPendingCheck: false,
  },
  {
    id: "fam-hasan",
    name: "Hasan",
    relation: "Yakın Çevre",
    status: "safe",
    statusLabel: "Güvende",
    batteryLevel: 78,
    lastSeenAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    hasPendingCheck: false,
  },
];

export const MOCK_FAMILY_PHONES = [
  { id: "fam-1", name: "Baba Mehmet", phone: "+905321112233", priority: 1, relation: "Baba" },
  { id: "fam-2", name: "Anne Ayşe", phone: "+905324445566", priority: 2, relation: "Anne" },
  { id: "fam-3", name: "Kardeş Elif", phone: "+905327778899", priority: 3, relation: "Kardeş" },
];
