import { useState } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  Loader2,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useMarkAllAsRead,
  useMarkAsRead,
  useNotifications,
  useNotificationSummary,
  NOTIFICATION_META,
  type Notification,
  type NotificationType,
} from "@/features/notifications/hooks/useNotifications";
import { initials } from "@/lib/time";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

export function NotificationPanel() {
  const { data: summary } = useNotificationSummary();
  const unreadCount = summary?.unread ?? 0;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-10 w-10 rounded-full"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 sm:w-96"
      >
        <SheetHeader className="gap-1 px-5 pt-5 pb-3 text-left">
          <SheetTitle className="flex items-center justify-between text-xl">
            Bildirimler
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {unreadCount} yeni
              </Badge>
            )}
          </SheetTitle>
          <SheetDescription>
            Son bildirimlerin ve güncellemelerin.
          </SheetDescription>
        </SheetHeader>

        <NotificationContent />
      </SheetContent>
    </Sheet>
  );
}

function NotificationContent() {
  const [activeTab, setActiveTab] = useState<"all" | NotificationType>(
    "all",
  );
  const { data: notifications = [], isLoading } = useNotifications();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();

  const filtered = notifications.filter(
    (n) => activeTab === "all" || n.type === activeTab,
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Üst bar */}
      <div className="flex flex-col gap-2 px-5 py-2">
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as typeof activeTab)}
        >
          <TabsList className="h-9 w-full rounded-full">
            <TabsTrigger value="all" className="flex-1 rounded-full text-xs">
              Tümü
            </TabsTrigger>
            <TabsTrigger
              value="status"
              className="flex-1 rounded-full text-xs"
            >
              💓 Durum
            </TabsTrigger>
            <TabsTrigger
              value="emergency"
              className="flex-1 rounded-full text-xs"
            >
              🚨 Acil
            </TabsTrigger>
            <TabsTrigger
              value="circle_invite"
              className="flex-1 rounded-full text-xs"
            >
              ⭕ Çember
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Button
          variant="ghost"
          size="sm"
          className="self-end gap-1 rounded-full text-xs"
          disabled={markAllAsRead.isPending}
          onClick={() => markAllAsRead.mutate()}
        >
          <CheckCheck className="h-3.5 w-3.5" />
          Tümünü okundu işaretle
        </Button>
      </div>

      <Separator />

      {/* Liste */}
      <ScrollArea className="flex-1">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Bell className="h-10 w-10 text-muted-foreground/30" />
            <p className="mt-3 text-sm text-muted-foreground">
              {activeTab === "all"
                ? "Henüz bildirimin yok."
                : "Bu türde bildirim bulunamadı."}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {filtered.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkRead={() => markAsRead.mutate(notification.id)}
              />
            ))}
          </ul>
        )}
      </ScrollArea>
    </div>
  );
}

function NotificationItem({
  notification,
  onMarkRead,
}: {
  notification: Notification;
  onMarkRead: () => void;
}) {
  const meta = NOTIFICATION_META[notification.type];
  const actorName =
    (notification.data["actor_name"] as string) ?? "Birisi";
  const actorInitials =
    (notification.data["actor_initials"] as string) ??
    initials(actorName);

  return (
    <li
      className={cn(
        "flex gap-3 px-5 py-3 transition-colors",
        !notification.isRead && "bg-primary/5",
      )}
    >
      <div className="relative shrink-0">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="text-sm">
            {actorInitials}
          </AvatarFallback>
        </Avatar>
        <span className="absolute -bottom-1 -right-1 text-base leading-none">
          {meta.emoji}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn("text-sm", !notification.isRead && "font-medium")}
          >
            <span className="font-semibold">{actorName}</span>{" "}
            {notification.title}
          </p>
          {!notification.isRead && (
            <button
              type="button"
              onClick={onMarkRead}
              className="shrink-0 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted"
              aria-label="Okundu olarak işaretle"
            >
              <Check className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
          {notification.body}
        </p>
        <time className="mt-1 block text-[11px] text-muted-foreground/70">
          {formatDistanceToNow(new Date(notification.createdAt), {
            addSuffix: true,
            locale: tr,
          })}
        </time>
      </div>
    </li>
  );
}
