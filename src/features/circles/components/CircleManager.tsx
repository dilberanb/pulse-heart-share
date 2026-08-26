import { useState } from "react";
import {
  Globe,
  Heart,
  Loader2,
  Mail,
  MoreHorizontal,
  Phone,
  Plus,
  ShieldCheck,
  Trash2,
  UserPlus,
  Users,
  X,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useAddToCircleByPhone,
  useCircles,
  useRemoveFromCircle,
  type CircleMember,
  type CircleType,
} from "@/features/circles/hooks/useCircles";
import { initials } from "@/lib/time";
import { cn } from "@/lib/utils";

const CIRCLE_TYPE_CONFIG: Record<
  CircleType,
  { label: string; icon: typeof ShieldCheck; description: string }
> = {
  family: {
    label: "Aile",
    icon: ShieldCheck,
    description: "En yakın aile fertlerin.",
  },
  close_friend: {
    label: "Yakın Arkadaşlar",
    icon: Heart,
    description: "Yakın arkadaşların.",
  },
  friend: {
    label: "Arkadaşlar",
    icon: Users,
    description: "Tanıdığın kişiler.",
  },
  acquaintance: {
    label: "Tanıdıklık",
    icon: Globe,
    description: "Uzaktan tanıdığın kişiler.",
  },
};

const CIRCLE_TYPE_ORDER: CircleType[] = [
  "family",
  "close_friend",
  "friend",
  "acquaintance",
];

export function CircleManager() {
  const { data: members = [], isLoading } = useCircles();
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Çember türüne göre grupla
  const grouped = CIRCLE_TYPE_ORDER.map((type) => ({
    type,
    config: CIRCLE_TYPE_CONFIG[type],
    members: members.filter((m) => m.circleType === type),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Çevrem</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Durumlarını kimin göreceğini çemberler belirler.
          </p>
        </div>
        <Button
          size="sm"
          className="gap-1.5 rounded-2xl"
          onClick={() => setIsInviteOpen(true)}
        >
          <UserPlus className="h-4 w-4" />
          Kişi ekle
        </Button>
      </div>

      {grouped.map(({ type, config, members: groupMembers }) => {
        const Icon = config.icon;

        return (
          <div key={type} className="space-y-3">
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium text-muted-foreground">
                {config.label}
              </h3>
              <Badge variant="secondary" className="text-xs">
                {groupMembers.length}
              </Badge>
            </div>

            {groupMembers.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-border p-6 text-center">
                <Users className="mx-auto h-8 w-8 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">
                  {config.description}
                </p>
              </div>
            ) : (
              <ul className="grid gap-2 sm:grid-cols-2">
                {groupMembers.map((member) => (
                  <CircleMemberItem
                    key={member.userId}
                    member={member}
                  />
                ))}
              </ul>
            )}
          </div>
        );
      })}

      {/* Üye ekleme dialogu */}
      <InviteMemberDialog
        open={isInviteOpen}
        onOpenChange={setIsInviteOpen}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Üye satırı                                                          */
/* ------------------------------------------------------------------ */

function CircleMemberItem({ member }: { member: CircleMember }) {
  const removeMember = useRemoveFromCircle();

  return (
    <li className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-3xl border border-border bg-card p-4">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarFallback>{initials(member.fullName)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate font-medium">{member.fullName}</p>
          {member.phone && (
            <p className="truncate text-xs text-muted-foreground">
              {member.phone}
            </p>
          )}
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 shrink-0 rounded-full text-muted-foreground hover:text-destructive"
        disabled={removeMember.isPending}
        onClick={() => {
          if (
            confirm(
              `"${member.fullName}" kişisini çemberinden çıkarmak istediğine emin misin?`,
            )
          ) {
            removeMember.mutate(member.userId);
          }
        }}
        aria-label={`${member.fullName} kişisini çıkar`}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </li>
  );
}

/* ------------------------------------------------------------------ */
/*  Üye ekleme dialogu                                                  */
/* ------------------------------------------------------------------ */

function InviteMemberDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [phone, setPhone] = useState("");
  const [circleType, setCircleType] = useState<CircleType>("close_friend");
  const addToCircle = useAddToCircleByPhone();

  function formatTurkishPhone(raw: string): string {
    const digits = raw.replace(/\D/g, "");
    if (digits.length === 0) return "";
    if (digits.startsWith("0")) return digits;
    return digits;
  }

  function toE164TR(raw: string): string {
    const digits = raw.replace(/\D/g, "");
    if (digits.startsWith("0")) return `+90${digits.slice(1)}`;
    if (digits.startsWith("90")) return `+${digits}`;
    return `+90${digits}`;
  }

  function handleInvite() {
    if (!phone.trim()) return;
    const e164 = toE164TR(phone);
    addToCircle.mutate(
      { phone: e164, circleType },
      {
        onSuccess: () => {
          setPhone("");
          onOpenChange(false);
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Çembere kişi ekle</DialogTitle>
          <DialogDescription>
            Telefon numarası ile kişiyi bul ve çembere ekle.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="invite-phone">Telefon numarası</Label>
            <div className="relative">
              <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
                🇹🇷
              </span>
              <Input
                id="invite-phone"
                type="tel"
                inputMode="numeric"
                placeholder="05XX XXX XX XX"
                maxLength={11}
                value={phone}
                onChange={(e) => setPhone(formatTurkishPhone(e.target.value))}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleInvite();
                }}
                className="h-12 rounded-2xl pl-10 text-base tracking-wider"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Hangi çembere eklenecek?</Label>
            <div className="grid grid-cols-2 gap-2">
              {CIRCLE_TYPE_ORDER.map((type) => {
                const config = CIRCLE_TYPE_CONFIG[type];
                const Icon = config.icon;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setCircleType(type)}
                    className={cn(
                      "flex items-center gap-2 rounded-2xl border p-3 text-left transition-colors",
                      circleType === type
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-muted",
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0",
                        circleType === type
                          ? "text-primary"
                          : "text-muted-foreground",
                      )}
                    />
                    <span className="text-sm font-medium">{config.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            className="rounded-2xl"
            onClick={() => onOpenChange(false)}
          >
            İptal
          </Button>
          <Button
            className="gap-2 rounded-2xl"
            disabled={!phone.trim() || addToCircle.isPending}
            onClick={handleInvite}
          >
            {addToCircle.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <UserPlus className="h-4 w-4" />
            )}
            Ekle
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
