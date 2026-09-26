import { useCallback, useEffect, useRef, useState } from "react";
import {
  AppState,
  type AppStateStatus,
  PermissionsAndroid,
  Platform,
} from "react-native";
import SmsAndroid from "react-native-get-sms-android";
import { storeFinancialMessages } from "@/features/transactions/services/sync-service";

const SMS_PERMISSION = PermissionsAndroid.PERMISSIONS.READ_SMS;

/**
 * Reading the SMS provider throws a SecurityException without `READ_SMS`, so the
 * permission has to be granted before `SmsAndroid.list` is ever called.
 */
const requestSmsPermission = async (): Promise<boolean> => {
  if (Platform.OS !== "android") return false;
  if (await PermissionsAndroid.check(SMS_PERMISSION)) return true;

  const result = await PermissionsAndroid.request(SMS_PERMISSION, {
    title: "Allow SMS access",
    message:
      "Pennywise reads your inbox to turn bank and M-PESA messages into transactions.",
    buttonPositive: "Allow",
    buttonNegative: "Not now",
  });

  return result === PermissionsAndroid.RESULTS.GRANTED;
};

export const useSyncEngine = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncDate, setLastSyncDate] = useState<number | null>(null);

  // These mirror the state above so performSync can keep a stable identity.
  // Depending on isSyncing/lastSyncDate directly made the mount effect below
  // re-run on every setState, which re-entered performSync forever.
  const isSyncingRef = useRef(false);
  const lastSyncDateRef = useRef<number | null>(null);

  // SmsAndroid.list is callback-based, so performSync returns before the sync
  // finishes. Every exit path has to clear the guard explicitly.
  const finishSync = useCallback(() => {
    isSyncingRef.current = false;
    setIsSyncing(false);
  }, []);

  const performSync = useCallback(async () => {
    if (isSyncingRef.current) return;
    isSyncingRef.current = true;
    setIsSyncing(true);

    try {
      // 0. Bail out early if we are not allowed to read the SMS provider
      if (!(await requestSmsPermission())) {
        console.log("Sync skipped: READ_SMS permission not granted.");
        finishSync();
        return;
      }

      // 1. Get last synced timestamp from local storage (or DB)
      // For now, we will just sync the last 7 days if no timestamp is present
      const minDate =
        lastSyncDateRef.current ?? Date.now() - 7 * 24 * 60 * 60 * 1000;

      // 2. Fetch recent SMS messages
      const filter = {
        box: "inbox" as const,
        minDate,
      };

      SmsAndroid.list(
        JSON.stringify(filter),
        (fail) => {
          console.error("Failed to read SMS:", fail);
          finishSync();
        },
        async (_count, smsList) => {
          // Wrapped so a parse/DB failure still clears the guard, otherwise
          // isSyncingRef stays true and no further sync can ever start.
          try {
            const messages = JSON.parse(smsList);
            const newRecords = await storeFinancialMessages(messages);

            lastSyncDateRef.current = Date.now();
            setLastSyncDate(lastSyncDateRef.current);
            console.log(`Sync complete. Added ${newRecords} new transactions.`);

            // Trigger background categorization for any uncategorized
            // transactions
            if (newRecords > 0) {
              import("@/features/transactions/services/llm-service").then(
                ({ llmService }) => {
                  llmService.processPendingCategorizations();
                },
              );
            }
          } catch (e) {
            console.error("Sync store error:", e);
          } finally {
            finishSync();
          }
        },
      );
    } catch (e) {
      console.error("Sync error:", e);
      finishSync();
    }
  }, [finishSync]);

  useEffect(() => {
    // Perform sync when the app comes to foreground
    const subscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        if (nextAppState === "active") {
          performSync();
        }
      },
    );

    // Also run once on mount
    performSync();

    return () => {
      subscription.remove();
    };
  }, [performSync]);

  return { isSyncing, performSync, lastSyncDate };
};
