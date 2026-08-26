import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ShieldCheck, ShieldAlert, ShieldQuestion } from "lucide-react";
import { toast } from "sonner";

import { QuickCheckCard } from "@/features/quickcheck/components/QuickCheckCard";
import { QuickCheckModal } from "@/features/quickcheck/components/QuickCheckModal";
import { QuickCheckResponse } from "@/features/quickcheck/components/QuickCheckResponse";
import {
  useFamilyMembers,
  usePendingReceivedChecks,
} from "@/features/quickcheck/hooks/useQuickCheck";
import type { FamilyMemberStatus, QuickCheck } from "@/types/quickcheck";

export function QuickCheckDashboard() {
  const { data: members, isLoading: membersLoading } = useFamilyMembers();
  const { data: receivedChecks } = usePendingReceivedChecks();
  const [selectedMember, setSelectedMember] = useState<FamilyMemberStatus | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeResponse, setActiveResponse] = useState<QuickCheck | null>(null);

  const safeCount = members?.filter((m) => m.status === "safe").length ?? 0;
  const pendingCount = members?.filter((m) => m.status === "pending").length ?? 0;
  const problemCount = members?.filter((m) => m.status === "problem").length ?? 0;

  const sortedMembers = [...(members ?? [])].sort((a, b) => {
    const order: Record<FamilyMemberStatus["status"], number> = {
      problem: 0,
      pending: 1,
      unknown: 2,
      busy: 3,
      safe: 4,
    };
    return order[a.status] - order[b.status];
  });

  useEffect(() => {
    if (receivedChecks && receivedChecks.length > 0 && !activeResponse) {
      const first = receivedChecks[0];
      if (first) setActiveResponse(first);
    }
  }, [receivedChecks, activeResponse]);

  function handleSendCheck(member: FamilyMemberStatus) {
    setSelectedMember(member);
    setModalOpen(true);
  }

  function handleCall(member: FamilyMemberStatus) {
    toast.info(`Arama başlatılıyor: ${member.name}`);
  }

  function handleViewLocation(member: FamilyMemberStatus) {
    toast.info(`${member.name} konumu haritada gösterilecek`);
  }

  return (
    <div className="space-y-5">
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2"
      >
        <h2 className="text-lg font-bold text-foreground">QuickCheck</h2>
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
          {members?.length ?? 0} kişi
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap items-center gap-3 rounded-xl border border-border/50 bg-card p-3.5"
      >
        <div className="flex items-center gap-1.5 text-xs">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span className="text-emerald-400 font-medium">{safeCount}</span>
          <span className="text-muted-foreground">güvende</span>
        </div>
        <div className="h-3 w-px bg-border" />
        <div className="flex items-center gap-1.5 text-xs">
          <ShieldQuestion className="h-4 w-4 text-amber-400" />
          <span className="text-amber-400 font-medium">{pendingCount}</span>
          <span className="text-muted-foreground">cevap bekliyor</span>
        </div>
        <div className="h-3 w-px bg-border" />
        <div className="flex items-center gap-1.5 text-xs">
          <ShieldAlert className="h-4 w-4 text-red-400" />
          <span className="text-red-400 font-medium">{problemCount}</span>
          <span className="text-muted-foreground">sorunlu</span>
        </div>
      </motion.div>

      {membersLoading ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl border bg-card p-4"
            >
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-24 rounded bg-muted" />
                  <div className="h-2.5 w-16 rounded bg-muted" />
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <div className="h-8 flex-1 rounded-lg bg-muted" />
                <div className="h-8 w-14 rounded-lg bg-muted" />
                <div className="h-8 w-14 rounded-lg bg-muted" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          <AnimatePresence>
            {sortedMembers.map((member, idx) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <QuickCheckCard
                  member={member}
                  onSendCheck={() => handleSendCheck(member)}
                  onCall={() => handleCall(member)}
                  onViewLocation={() => handleViewLocation(member)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <QuickCheckModal
        member={selectedMember}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />

      <AnimatePresence>
        {activeResponse && (
          <QuickCheckResponse
            key={activeResponse.id}
            check={activeResponse}
            onDismiss={() => setActiveResponse(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
