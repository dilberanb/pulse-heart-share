import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, MessageSquare, X } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ANSWER_OPTIONS, QUESTION_TYPE_LABELS } from "@/features/quickcheck/data/questions";
import { useAnswerQuickCheck } from "@/features/quickcheck/hooks/useQuickCheck";
import { initials } from "@/lib/time";
import { cn } from "@/lib/utils";
import type { QuickCheck, QuickCheckQuestionType } from "@/types/quickcheck";

interface QuickCheckResponseProps {
  check: QuickCheck;
  onDismiss: () => void;
  onDetailedMessage?: () => void;
}

const STATUS_COLORS = {
  green: "border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20",
  amber: "border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20",
  red: "border-red-500/40 bg-red-500/10 hover:bg-red-500/20",
};

export function QuickCheckResponse({
  check,
  onDismiss,
  onDetailedMessage,
}: QuickCheckResponseProps) {
  const [answered, setAnswered] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("");
  const answerCheck = useAnswerQuickCheck();

  const answers = ANSWER_OPTIONS[check.questionType] ?? [];
  const questionLabel = QUESTION_TYPE_LABELS[check.questionType] ?? "Bir soru sordu";

  function handleAnswer(answerIndex: number) {
    const option = answers[answerIndex];
    if (!option) return;
    setSelectedLabel(option.label);
    answerCheck.mutate(
      {
        checkId: check.id,
        senderId: check.senderId,
        senderName: check.senderName,
        questionType: check.questionType,
        answer: option.answer,
      },
      {
        onSuccess: () => {
          setAnswered(true);
          setTimeout(() => onDismiss(), 2000);
        },
      },
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className="fixed inset-x-0 bottom-0 z-50 p-4 sm:bottom-4 sm:left-auto sm:right-4 sm:max-w-sm"
    >
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />

        <button
          onClick={onDismiss}
          className="absolute right-3 top-3 z-10 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative p-5">
          <AnimatePresence mode="wait">
            {answered ? (
              <motion.div
                key="confirmed"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-3 py-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                >
                  <CheckCircle className="h-14 w-14 text-emerald-400" />
                </motion.div>
                <p className="text-sm font-medium text-foreground">{selectedLabel}</p>
                <p className="text-xs text-muted-foreground">Cevabın gönderildi</p>
              </motion.div>
            ) : (
              <motion.div
                key="question"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage src="" alt="" />
                    <AvatarFallback className="text-xs font-semibold bg-primary/10">
                      {initials(check.senderName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">
                      {check.senderName} seni soruyor
                    </p>
                    <p className="text-xs text-muted-foreground">{questionLabel}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {answers.map((option, idx) => (
                    <motion.button
                      key={option.answer}
                      whileTap={{ scale: 0.95 }}
                      disabled={answerCheck.isPending}
                      className={cn(
                        "flex flex-col items-center gap-1.5 rounded-xl border-2 p-4 transition-colors cursor-pointer",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        STATUS_COLORS[option.statusColor],
                      )}
                      onClick={() => handleAnswer(idx)}
                    >
                      <span className="text-2xl">{option.icon}</span>
                      <span className="text-xs font-medium text-foreground text-center leading-tight">
                        {option.label}
                      </span>
                    </motion.button>
                  ))}
                </div>

                <button
                  onClick={onDetailedMessage}
                  className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-xs text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  Detaylı mesaj yaz
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
