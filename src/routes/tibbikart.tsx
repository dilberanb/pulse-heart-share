import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/layout/AppShell";
import { MedicalCard } from "@/features/medical/components/MedicalCard";

export const Route = createFileRoute("/tibbikart")({
  head: () => ({
    meta: [
      { title: "Tıbbi Kart — Nabız" },
      {
        name: "description",
        content: "Kan grubu, kronik hastalık, alerji ve ilaç bilgilerini acil durumlar için sakla.",
      },
    ],
  }),
  component: TibbiKartPage,
});

function TibbiKartPage() {
  return (
    <AppShell>
      <div className="space-y-5">
        <div>
          <h2 className="text-lg font-bold text-foreground">Tıbbi Kart</h2>
          <p className="text-xs text-muted-foreground">
            Acil durumda görevlilerin ve sevdiklerinin hızlıca erişebilmesi için tıbbi bilgilerin.
          </p>
        </div>
        <MedicalCard />
      </div>
    </AppShell>
  );
}
