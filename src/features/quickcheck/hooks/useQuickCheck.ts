import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  answerQuickCheck,
  fetchCheckHistory,
  fetchFamilyMembers,
  fetchPendingChecks,
  fetchPendingReceivedChecks,
  sendQuickCheck,
} from "@/features/quickcheck/api/mockQuickCheck";
import type { QuickCheckAnswer, QuickCheckQuestionType } from "@/types/quickcheck";

export const quickCheckKeys = {
  family: ["quickcheck", "family"] as const,
  pending: ["quickcheck", "pending"] as const,
  pendingReceived: ["quickcheck", "pendingReceived"] as const,
  history: ["quickcheck", "history"] as const,
};

export function useFamilyMembers() {
  return useQuery({
    queryKey: quickCheckKeys.family,
    queryFn: fetchFamilyMembers,
    staleTime: 30_000,
  });
}

export function usePendingChecks() {
  return useQuery({
    queryKey: quickCheckKeys.pending,
    queryFn: fetchPendingChecks,
    staleTime: 10_000,
  });
}

export function usePendingReceivedChecks() {
  return useQuery({
    queryKey: quickCheckKeys.pendingReceived,
    queryFn: fetchPendingReceivedChecks,
    staleTime: 10_000,
  });
}

export function useQuickCheckHistory() {
  return useQuery({
    queryKey: quickCheckKeys.history,
    queryFn: fetchCheckHistory,
    staleTime: 30_000,
  });
}

export function useSendQuickCheck() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      receiverId,
      receiverName,
      questionType,
    }: {
      receiverId: string;
      receiverName: string;
      questionType: QuickCheckQuestionType;
    }) => sendQuickCheck(receiverId, receiverName, questionType),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["quickcheck"] });
      toast.success(`${variables.receiverName} kontrol ediliyor...`);
    },
    onError: () => toast.error("QuickCheck gönderilemedi, tekrar dener misin?"),
  });
}

export function useAnswerQuickCheck() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      checkId,
      senderId,
      senderName,
      questionType,
      answer,
    }: {
      checkId: string;
      senderId: string;
      senderName: string;
      questionType: QuickCheckQuestionType;
      answer: QuickCheckAnswer;
    }) => answerQuickCheck(checkId, senderId, senderName, questionType, answer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quickcheck"] });
      toast.success("Cevabın gönderildi ✓");
    },
    onError: () => toast.error("Cevap gönderilemedi, tekrar dener misin?"),
  });
}
