import { Bell, BellOff, Moon, Volume2, VolumeX } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

export function NotificationPreferences() {
  const notificationPreference = useAppStore((s) => s.notificationPreference);
  const setNotificationPreference = useAppStore((s) => s.setNotificationPreference);
  const seniorMode = useAppStore((s) => s.seniorMode);
  const setSeniorMode = useAppStore((s) => s.setSeniorMode);

  return (
    <section className="space-y-6">
      <h2 className="text-lg font-semibold text-foreground">Bildirim Tercihleri</h2>

      {/* Bildirim Stili */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-4">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-medium text-foreground">Bildirim Stili</h3>
        </div>

        <RadioGroup
          value={notificationPreference}
          onValueChange={(v) => setNotificationPreference(v as "bar" | "fullscreen")}
          className="space-y-3"
        >
          <Label
            htmlFor="notif-bar"
            className={cn(
              "flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors",
              notificationPreference === "bar"
                ? "border-primary/50 bg-primary/5"
                : "border-border hover:border-border/80 hover:bg-muted/30",
            )}
          >
            <RadioGroupItem value="bar" id="notif-bar" className="mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Bildirim Çubuğu</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Durum çubuğunda küçük bildirim görüntülenir. Minimum dikkat dağıtıcı.
              </p>
            </div>
            <Bell className="h-5 w-5 shrink-0 text-muted-foreground" />
          </Label>

          <Label
            htmlFor="notif-fullscreen"
            className={cn(
              "flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors",
              notificationPreference === "fullscreen"
                ? "border-primary/50 bg-primary/5"
                : "border-border hover:border-border/80 hover:bg-muted/30",
            )}
          >
            <RadioGroupItem value="fullscreen" id="notif-fullscreen" className="mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Tam Ekran</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Önemli bildirimler için tam ekran açılır pencere. Acil durum bildirimleri için önerilir.
              </p>
            </div>
            <Volume2 className="h-5 w-5 shrink-0 text-muted-foreground" />
          </Label>
        </RadioGroup>
      </div>

      {/* Bildirim Kanalları */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-4">
        <h3 className="text-sm font-medium text-foreground">Bildirim Kanalları</h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Label htmlFor="quickcheck-notif" className="text-sm text-foreground cursor-pointer">
                QuickCheck Bildirimleri
              </Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Yakınlarındaki QuickCheck taleplerini al.
              </p>
            </div>
            <Switch id="quickcheck-notif" defaultChecked />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Label htmlFor="emergency-notif" className="text-sm text-foreground cursor-pointer">
                  Acil Durum Bildirimleri
                </Label>
                <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                  Her Zaman Açık
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Acil durum ve SOS bildirimleri her zaman etkin. Devre dışı bırakılamaz.
              </p>
            </div>
            <Switch id="emergency-notif" checked disabled />
          </div>
        </div>
      </div>

      {/* Sessiz Saatler */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-4">
        <div className="flex items-center gap-2">
          <Moon className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-medium text-foreground">Sessiz Saatler</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Bu saatler arasında bildirimler sessize alınır. Acil durum bildirimleri her zaman sesli gelir.
        </p>

        <div className="flex items-center gap-3">
          <div className="flex-1 space-y-1.5">
            <Label className="text-xs text-muted-foreground">Başlangıç</Label>
            <div className="flex items-center gap-2">
              <BellOff className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">22:00</span>
            </div>
          </div>
          <span className="text-muted-foreground">—</span>
          <div className="flex-1 space-y-1.5">
            <Label className="text-xs text-muted-foreground">Bitiş</Label>
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">07:00</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2">
          <Label htmlFor="senior-mode" className="text-sm text-foreground cursor-pointer">
            Büyük Mod (Yaşlı Modu)
          </Label>
          <Switch id="senior-mode" checked={seniorMode} onCheckedChange={setSeniorMode} />
        </div>
        {seniorMode && (
          <p className="text-xs text-primary">
            Büyük Mod açık: Bildirimler daha büyük yazı tipi ve daha belirgin görsellerle gösterilir.
          </p>
        )}
      </div>
    </section>
  );
}
