import { useMemo } from "react";
import { BarChart3, Flame, TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import type { StatusOption } from "@/types/status";

interface StatusStatsProps {
  recentStatuses: StatusOption[];
}

const GUNLER = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

const TONE_COLORS: Record<string, string> = {
  calm: "#6ee7b7",
  joy: "#fbbf24",
  low: "#93c5fd",
  need: "#f9a8d4",
  urgent: "#fca5a5",
};

export function StatusStats({ recentStatuses }: StatusStatsProps) {
  const weeklyData = useMemo(() => {
    const now = new Date();
    const dayOfWeek = (now.getDay() + 6) % 7;
    const weekCounts: Record<number, number> = {};

    for (let i = 0; i <= dayOfWeek; i++) {
      weekCounts[i] = 0;
    }

    recentStatuses.forEach((_, idx) => {
      const dayIdx = dayOfWeek - (idx % (dayOfWeek + 1));
      if (dayIdx >= 0) {
        weekCounts[dayIdx] = (weekCounts[dayIdx] || 0) + 1;
      }
    });

    return GUNLER.slice(0, dayOfWeek + 1).map((gun, idx) => ({
      gun,
      sayi: weekCounts[idx] || 0,
    }));
  }, [recentStatuses]);

  const mostUsed = useMemo(() => {
    const counts = new Map<string, { option: StatusOption; count: number }>();
    recentStatuses.forEach((s) => {
      const existing = counts.get(s.id);
      if (existing) {
        existing.count++;
      } else {
        counts.set(s.id, { option: s, count: 1 });
      }
    });
    return Array.from(counts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [recentStatuses]);

  const streak = useMemo(() => {
    const dates = new Set<string>();
    recentStatuses.forEach((_, idx) => {
      const d = new Date();
      d.setDate(d.getDate() - idx);
      dates.add(d.toISOString().slice(0, 10));
    });

    let count = 0;
    for (let i = 0; i < 365; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      if (dates.has(d.toISOString().slice(0, 10))) {
        count++;
      } else {
        break;
      }
    }
    return count;
  }, [recentStatuses]);

  const chartConfig = {
    sayi: {
      label: "Durum sayısı",
      color: "hsl(var(--primary))",
    },
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Haftalık ruh hali dağılımı */}
      <Card className="md:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChart3 className="h-4 w-4" />
            Haftalık Durum Dağılımı
          </CardTitle>
        </CardHeader>
        <CardContent>
          {weeklyData.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Henüz yeterli veri yok. Durum paylaşmaya başla!
            </p>
          ) : (
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <BarChart data={weeklyData}>
                <XAxis dataKey="gun" tickLine={false} axisLine={false} />
                <YAxis hide />
                <ChartTooltip
                  content={<ChartTooltipContent formatter={(value) => `${value} durum`} />}
                />
                <Bar dataKey="sayi" fill="var(--color-sayi)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      {/* Aktivite serisi */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Flame className="h-4 w-4" />
            Aktivite Serisi
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-3 py-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-500/10">
            <span className="text-3xl font-bold text-orange-500">{streak}</span>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            {streak === 0
              ? "Henüz seri yok. Her gün durumunu paylaş!"
              : `Gün ardışık aktifsin!`}
          </p>
        </CardContent>
      </Card>

      {/* En çok kullanılan durumlar */}
      <Card className="md:col-span-3">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-4 w-4" />
            En Çok Kullanılan Durumlar
          </CardTitle>
        </CardHeader>
        <CardContent>
          {mostUsed.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              Henüz yeterli veri yok.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {mostUsed.map(({ option, count }) => (
                <Badge
                  key={option.id}
                  variant="secondary"
                  className="gap-1.5 rounded-full px-3 py-1.5 text-sm"
                >
                  <span>{option.emoji}</span>
                  <span>{option.label}</span>
                  <span className="ml-1 text-xs text-muted-foreground">×{count}</span>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
