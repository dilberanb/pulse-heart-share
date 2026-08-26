import type { UserProfile } from "@/features/onboarding/types/user";

export const LABEL_CONFIG: Record<
  string,
  { label: string; icon: string; color: "green" | "amber" | "red" | "blue" }
> = {
  elderly: { label: "+65", icon: "", color: "amber" },
  pet_owner: { label: "Hayvan Sahibi", icon: "\uD83D\uDC3E", color: "green" },
  surgery: { label: "Ameliyat", icon: "\uD83C\uDFE5", color: "red" },
  chronic: { label: "Kronik", icon: "\uD83D\uDC8A", color: "red" },
  disabled: { label: "Engelli", icon: "\u267F", color: "amber" },
  child: { label: "Cocuk", icon: "\uD83D\uDC76", color: "blue" },
};

export const mockFamilyMembers: UserProfile[] = [
  {
    id: "u-ali",
    name: "Ali",
    age: 72,
    phone: "05321001001",
    labels: [
      {
        type: "elderly",
        label: "+65",
        icon: "",
        color: "amber",
      },
    ],
    circle: "core_family",
    notificationPreference: "bar",
    createdAt: "2026-01-15T10:00:00Z",
  },
  {
    id: "u-ayse",
    name: "Ayse",
    age: 68,
    phone: "05321001002",
    labels: [
      {
        type: "elderly",
        label: "+65",
        icon: "",
        color: "amber",
      },
      {
        type: "pet_owner",
        label: "Hayvan Sahibi",
        icon: "\uD83D\uDC3E",
        color: "green",
      },
    ],
    circle: "core_family",
    notificationPreference: "bar",
    createdAt: "2026-01-15T10:00:00Z",
  },
  {
    id: "u-mehmet",
    name: "Mehmet",
    age: 25,
    phone: "05321001003",
    labels: [],
    circle: "core_family",
    notificationPreference: "bar",
    createdAt: "2026-02-10T08:30:00Z",
  },
  {
    id: "u-zeynep",
    name: "Zeynep",
    age: 42,
    phone: "05321001004",
    labels: [
      {
        type: "surgery",
        label: "Ameliyat",
        icon: "\uD83C\uDFE5",
        color: "red",
      },
    ],
    circle: "core_family",
    notificationPreference: "fullscreen",
    createdAt: "2026-03-01T14:00:00Z",
  },
  {
    id: "u-hasan",
    name: "Hasan",
    age: 35,
    phone: "05321001005",
    labels: [],
    circle: "close_circle",
    notificationPreference: "bar",
    createdAt: "2026-03-20T16:00:00Z",
  },
  {
    id: "u-fatma",
    name: "Fatma",
    age: 28,
    phone: "05321001006",
    labels: [],
    circle: "close_circle",
    notificationPreference: "bar",
    createdAt: "2026-04-05T09:15:00Z",
  },
];

export const mockBatteryLevels: Record<string, number> = {
  "u-ali": 87,
  "u-ayse": 45,
  "u-mehmet": 92,
  "u-zeynep": 12,
  "u-hasan": 78,
  "u-fatma": 65,
};

export const mockFamilyStatus: Record<
  string,
  "safe" | "pending" | "problem" | "unknown"
> = {
  "u-ali": "safe",
  "u-ayse": "safe",
  "u-mehmet": "safe",
  "u-zeynep": "problem",
  "u-hasan": "pending",
  "u-fatma": "safe",
};
