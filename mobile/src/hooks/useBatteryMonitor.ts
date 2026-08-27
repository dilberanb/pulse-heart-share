import { useCallback, useEffect, useState } from "react";
import * as Battery from "expo-battery";

import type { BatteryStatus } from "@/types";

/**
 * useBatteryMonitor — cihaz şarjını dinler.
 * Web inşa: Expo Go'da expo-battery çalışır; web'de fallback varsayılan değer.
 */
export function useBatteryMonitor(): BatteryStatus {
  const [battery, setBattery] = useState<BatteryStatus>({
    percentage: 100,
    isCharging: false,
    isLowBattery: false,
  });

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const level = await Battery.getBatteryLevelAsync(); // 0..1
        const state = await Battery.getBatteryStateAsync();
        const charging =
          state === Battery.BatteryState.CHARGING ||
          state === Battery.BatteryState.FULL;
        const percentage = Math.round((level ?? 1) * 100);
        if (mounted) {
          setBattery({
            percentage,
            isCharging: charging,
            isLowBattery: percentage <= 5,
          });
        }
      } catch {
        // Expo Go olmayan ortamda sessizce yoksay
      }
    }

    void load();
    const sub = Battery.addBatteryLevelListener(({ batteryLevel }) => {
      const percentage = Math.round((batteryLevel ?? 1) * 100);
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      Battery.getBatteryStateAsync().then((state) => {
        if (mounted) {
          setBattery((prev) => ({
            percentage,
            isCharging:
              state === Battery.BatteryState.CHARGING ||
              state === Battery.BatteryState.FULL,
            isLowBattery: percentage <= 5,
          }));
        }
      });
    });

    return () => {
      mounted = false;
      sub.remove();
    };
  }, []);

  return battery;
}
