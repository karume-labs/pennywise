import * as LocalAuthentication from "expo-local-authentication";
import * as ScreenCapture from "expo-screen-capture";
import { LockIcon } from "lucide-react-native";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { AppState, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useSettingsStore } from "@/store/settings";

export function AppLockGate({ children }: { children: React.ReactNode }) {
  const { appLockEnabled, _hasHydrated } = useSettingsStore();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    if (appLockEnabled) {
      ScreenCapture.preventScreenCaptureAsync().catch(() => {});
    } else {
      ScreenCapture.allowScreenCaptureAsync().catch(() => {});
    }
  }, [appLockEnabled]);

  const authenticate = useCallback(async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        setIsUnlocked(true);
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Unlock Pennywise",
        fallbackLabel: "Use Passcode",
      });

      if (result.success) {
        setIsUnlocked(true);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    if (!_hasHydrated) return;

    if (appLockEnabled && !isUnlocked) {
      authenticate();
    }

    if (!appLockEnabled && !isUnlocked) {
      setIsUnlocked(true);
    }
  }, [_hasHydrated, appLockEnabled, authenticate, isUnlocked]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        if (appLockEnabled) {
          setIsUnlocked(false);
          authenticate();
        }
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [appLockEnabled, authenticate]);

  if (!_hasHydrated) return null;

  if (appLockEnabled && !isUnlocked) {
    return (
      <View className="flex-1 bg-background items-center justify-center p-6">
        <LockIcon size={48} className="text-primary mb-6" />
        <Text className="text-foreground text-2xl font-serif mb-2">Locked</Text>
        <Text className="text-muted-foreground text-center mb-8">
          Pennywise is locked to protect your financial privacy.
        </Text>
        <Button onPress={authenticate} className="w-full rounded-full">
          <Text className="text-primary-foreground font-semibold">Unlock</Text>
        </Button>
      </View>
    );
  }

  return <>{children}</>;
}
