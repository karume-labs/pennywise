import "@/global.css";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { PortalHost } from "@rn-primitives/portal";
import { Stack } from "expo-router";
import { ThemeProvider } from "expo-router/react-navigation";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useUniwind } from "uniwind";
import { NAV_THEME } from "@/lib/theme";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { Rye_400Regular, useFonts } from "@expo-google-fonts/rye";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { AppLockGate } from "@/components/AppLockGate";
import { Skeleton, skeletonKeys } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { db } from "@/db/client";
import migrations from "@/db/migrations/migrations";

SplashScreen.preventAutoHideAsync();

const BootSkeleton = () => (
  <View className="flex-1 bg-background px-4 pt-6">
    <View className="mb-8 items-center">
      <Skeleton className="h-4 w-24 rounded" />
      <Skeleton className="h-11 w-48 rounded-lg mt-2" />
    </View>
    <Skeleton className="h-20 w-full rounded-2xl mb-6" />
    <View className="gap-3">
      {skeletonKeys(4).map((key) => (
        <Skeleton key={key} className="h-[74px] w-full rounded-2xl" />
      ))}
    </View>
  </View>
);

const RootLayout = () => {
  const { theme } = useUniwind();
  const { success, error } = useMigrations(db, migrations);

  const [fontsLoaded, fontError] = useFonts({
    Rye_400Regular,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const fontsSettled = fontsLoaded || !!fontError;
  const isBooting = !success || !fontsSettled;

  useEffect(() => {
    // Hold the splash until migrations finish too, otherwise it hides while
    // this component still returns null and the user sees a blank frame.
    if (success && fontsSettled) {
      SplashScreen.hideAsync();
    }
  }, [success, fontsSettled]);

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Migration error: {error.message}</Text>
      </View>
    );
  }
  if (isBooting) {
    return <BootSkeleton />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={NAV_THEME[theme ?? "light"]}>
        <StatusBar style="light" />
        <SafeAreaProvider>
          <BottomSheetModalProvider>
            <AppLockGate>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              </Stack>
              <PortalHost />
            </AppLockGate>
          </BottomSheetModalProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
