import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, Loader2, MoreHorizontal, X } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  QUICK_CHECK_QUESTIONS,
  QUICK_CHECK_OTHER_QUESTIONS,
} from "@/features/quickcheck/data/questions";
import { useSendQuickCheck } from "@/features/quickcheck/hooks/useQuickCheck";
import { initials } from "@/lib/time";
import { cn } from "@/lib/utils";
import type { FamilyMemberStatus, QuickCheckQuestionType } from "@/types/quickcheck";

interface QuickCheckModalProps {
  member: FamilyMemberStatus | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const QUESTION_STYLES: Record<QuickCheckQuestionType, string> = {
  how_are_you: "border-emerald-500/20 hover:bg-emerald-500/5",
  are_you_available: "border-violet-500/20 hover:bg-violet-500/5",
  are_you_safe: "border-sky-500/20 hover:bg-sky-500/5",
  pet_needs: "border-amber-500/20 hover:bg-amber-500/5",
  earthquake: "border-red-500/20 hover:bg-red-500/5",
};

export function QuickCheckModal({ member, open, onOpenChange }: QuickCheckModalProps) {
  const [sentQuestion, setSentQuestion] = useState<QuickCheckQuestionType | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showOther, setShowOther] = useState(false);
  const sendCheck = useSendQuickCheck();

  function handleSendQuestion(type: QuickCheckQuestionType) {
    if (!member) return;
    setSentQuestion(type);
    sendCheck.mutate(
      {
        receiverId: member.id,
        receiverName: member.name,
        questionType: type,
      },
      {
        onSuccess: () => {
          setShowConfirmation(true);
          setTimeout(() => {
            setShowConfirmation(false);
            setSentQuestion(null);
            setShowOther(false);
            onOpenChange(false);
          }, 1800);
        },
        onError: () => {
          setSentQuestion(null);
        },
      },
    );
  }

  function handleOpenChange(value: boolean) {
    if (!value) {
      setSentQuestion(null);
      setShowConfirmation(false);
      setShowOther(false);
    }
    onOpenChange(value);
  }

  const activeQuestions = showOther ? QUICK_CHECK_OTHER_QUESTIONS : QUICK_CHECK_QUESTIONS;

  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md border-border/50 bg-card">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-base">
            <Avatar className="h-9 w-9 shrink-0">
              <AvatarImage src={member.avatarUrl} alt="" />
              <AvatarFallback className="text-xs font-semibold">
                {initials(member.name)}
              </AvatarFallback>
            </Avatar>
            <span>{member.name} kontrol et</span>
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {showConfirmation ? (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center gap-3 py-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
              >
                <CheckCircle className="h-16 w-16 text-emerald-400" />
              </motion.div>
              <p className="text-sm font-medium text-foreground">Gönderildi!</p>
              <p className="text-xs text-muted-foreground">
                {member.name} cevapladığında bildirim alacaksın.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="questions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3 pt-2"
            >
              <div className="grid grid-cols-2 gap-3">
                {activeQuestions.map((q) => {
                  const isSending = sentQuestion === q.type;
                  return (
                    <motion.button
                      key={q.type}
                      whileTap={{ scale: 0.95 }}
                      disabled={isSending || sendCheck.isPending}
                      className={cn(
                        "flex flex-col items-center gap-2 rounded-xl border-2 p-5 transition-colors cursor-pointer",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        QUESTION_STYLES[q.type],
                      )}
                      onClick={() => handleSendQuestion(q.type)}
                    >
                      {isSending ? (
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      ) : (
                        <span className="text-3xl">{q.icon}</span>
                      )}
                      <span className="text-sm font-medium text-foreground">{q.label}</span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Diğer sekmesi toggle */}
              <button
                type="button"
                onClick={() => setShowOther(!showOther)}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <MoreHorizontal className="h-4 w-4" />
                {showOther ? "Günlük Sorular" : "Diğer (Evcil Hayvan, Deprem)"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
