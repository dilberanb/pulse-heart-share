import { useEffect, useState, useCallback } from "react";
import { AlertTriangle, X, MessageCircle } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "motion/react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ANSWER_OPTIONS } from "@/features/quickcheck/data/questions";
import { useAnswerQuickCheck } from "@/features/quickcheck/hooks/useQuickCheck";
import { initials } from "@/lib/time";
import { cn } from "@/lib/utils";
import type {
  QuickCheck,
  QuickCheckAnswer,
  QuickCheckAnswerOption,
  QuickCheckQuestionType,
} from "@/types/quickcheck";

interface NotificationToastProps {
  notification: {
    id: string;
    senderName: string;
    senderInitials?: string;
    message: string;
    type: "status" | "quickcheck" | "emergency" | "sos";
    quickCheck?: QuickCheck;
  };
  onDismiss: () => void;
}

export function NotificationToast({ notification, onDismiss }: NotificationToastProps) {
  const isEmergency = notification.type === "emergency" || notification.type === "sos";
  const answerCheck = useAnswerQuickCheck();

  useEffect(() => {
    if (isEmergency) return;

    const timer = setTimeout(() => {
      onDismiss();
    }, 10_000);

    return () => clearTimeout(timer);
  }, [isEmergency, onDismiss]);

  const x = useMotionValue(0);
  const opacity = useTransform(x, [-150, 0, 150], [0, 1, 0]);

  const handleDragEnd = useCallback(
    (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
      if (Math.abs(info.offset.x) > 100 || Math.abs(info.velocity.x) > 500) {
        onDismiss();
      }
    },
    [onDismiss],
  );

  return (
    <motion.div
      initial={{ y: -80, opacity: 0, scale: 0.95 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: -80, opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="pointer-events-auto w-full max-w-sm"
    >
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.3}
        onDragEnd={handleDragEnd}
        style={{ x, opacity }}
        className={cn(
          "relative overflow-hidden rounded-xl border shadow-2xl backdrop-blur-md",
          isEmergency
            ? "border-sos/50 bg-sos-surface/95"
            : "border-border bg-[#1a2332]/95",
        )}
      >
        <div className="flex items-start gap-3 p-3">
          {/* Avatar / icon */}
          <Avatar className="h-9 w-9 shrink-0">
            <AvatarFallback
              className={cn(
                "text-xs font-semibold",
                isEmergency
                  ? "bg-sos/20 text-sos"
                  : "bg-slate-700 text-slate-200",
              )}
            >
              {notification.senderInitials ??
                initials(notification.senderName)}
            </AvatarFallback>
          </Avatar>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              {isEmergency && (
                <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-sos" />
              )}
              {!isEmergency && (
                <MessageCircle className="h-3.5 w-3.5 shrink-0 text-primary" />
              )}
              <p className="truncate text-xs font-semibold text-foreground">
                {notification.senderName}
              </p>
            </div>
            <p className="mt-0.5 line-clamp-2 text-xs text-slate-400">
              {notification.message}
            </p>

            {/* QuickCheck inline answer buttons */}
            {notification.type === "quickcheck" && notification.quickCheck && (
              <QuickCheckInlineButtons
                quickCheck={notification.quickCheck}
                onAnswer={(checkId, senderId, senderName, questionType, answer) => {
                  answerCheck.mutate({
                    checkId,
                    senderId,
                    senderName,
                    questionType,
                    answer,
                  });
                  onDismiss();
                }}
              />
            )}
          </div>

          {/* Close button */}
          {!isEmergency && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onDismiss}
              className="h-6 w-6 shrink-0 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>

        {/* Emergency accent bar */}
        {isEmergency && (
          <div className="h-1 w-full bg-gradient-to-r from-sos via-sos to-sos/50" />
        )}
      </motion.div>
    </motion.div>
  );
}

function QuickCheckInlineButtons({
  quickCheck,
  onAnswer,
}: {
  quickCheck: QuickCheck;
  onAnswer: (
    checkId: string,
    senderId: string,
    senderName: string,
    questionType: QuickCheckQuestionType,
    answer: QuickCheckAnswer,
  ) => void;
}) {
  const options: QuickCheckAnswerOption[] =
    ANSWER_OPTIONS[quickCheck.questionType] ?? [];

  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {options.map((option) => (
        <button
          key={option.answer}
          type="button"
          onClick={() =>
            onAnswer(
              quickCheck.id,
              quickCheck.senderId,
              quickCheck.senderName,
              quickCheck.questionType,
              option.answer,
            )
          }
          className={cn(
            "inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[10px] font-medium transition-colors",
            option.statusColor === "green" &&
              "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20",
            option.statusColor === "amber" &&
              "border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20",
            option.statusColor === "red" &&
              "border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20",
          )}
        >
          <span>{option.icon}</span>
          {option.label}
        </button>
      ))}
    </div>
  );
}

interface ToastNotification {
  id: string;
  senderName: string;
  senderInitials?: string;
  message: string;
  type: "status" | "quickcheck" | "emergency" | "sos";
  quickCheck?: QuickCheck;
}

let toastIdCounter = 0;

export function useNotificationToast() {
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const addToast = useCallback((toast: Omit<ToastNotification, "id">) => {
    const id = `toast-${++toastIdCounter}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
}

export function NotificationToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: ToastNotification[];
  onDismiss: (id: string) => void;
}) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex flex-col items-center gap-2 px-4 pt-4">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <NotificationToast
            key={toast.id}
            notification={toast}
            onDismiss={() => onDismiss(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
