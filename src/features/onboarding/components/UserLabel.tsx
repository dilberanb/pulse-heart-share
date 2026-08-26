import { cn } from "@/lib/utils";

interface UserLabelProps {
  label: string;
  icon?: string;
  color: "green" | "amber" | "red" | "blue";
  size?: "sm" | "md";
}

const colorMap = {
  green: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  amber: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  red: "bg-red-500/15 text-red-400 border-red-500/25",
  blue: "bg-blue-500/15 text-blue-400 border-blue-500/25",
};

const sizeMap = {
  sm: "px-1.5 py-0.5 text-[10px] gap-0.5",
  md: "px-2 py-0.5 text-xs gap-1",
};

export function UserLabel({ label, icon, color, size = "sm" }: UserLabelProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-medium whitespace-nowrap",
        colorMap[color],
        sizeMap[size],
      )}
    >
      {icon && <span className="leading-none">{icon}</span>}
      {label}
    </span>
  );
}
