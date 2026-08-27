import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { colors } from "@/theme";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="sos" options={{ presentation: "fullScreenModal" }} />
        <Stack.Screen name="quickcheck" options={{ presentation: "modal" }} />
        <Stack.Screen name="deprem" />
        <Stack.Screen name="yasli" options={{ presentation: "fullScreenModal" }} />
      </Stack>
    </SafeAreaProvider>
  );
}
