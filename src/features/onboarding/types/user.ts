export interface UserProfile {
  id: string;
  name: string;
  age: number;
  phone: string;
  avatarUrl?: string;
  labels: UserLabel[];
  circle: "core_family" | "close_circle";
  notificationPreference: "bar" | "fullscreen";
  createdAt: string;
}

export type UserLabelType =
  | "elderly"
  | "pet_owner"
  | "surgery"
  | "chronic"
  | "disabled"
  | "child";

export interface UserLabel {
  type: UserLabelType;
  label: string;
  icon: string;
  color: "green" | "amber" | "red" | "blue";
}

export interface CircleMember {
  id: string;
  name: string;
  phone: string;
  relation: "core_family" | "close_circle";
}
