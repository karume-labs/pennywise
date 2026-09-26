import { eq } from "drizzle-orm";
import { useCallback, useEffect, useState } from "react";
import { AppState, type AppStateStatus } from "react-native";
import SmsAndroid from "react-native-get-sms-android";
import { db } from "@/db/client";
import { transactions } from "@/db/schema";
import { parseFinancialSms } from "@/features/transactions/services/parsers";

export const useSyncEngine = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncDate, setLastSyncDate] = useState<number | null>(null);

  const performSync = useCallback(async () => {
    if (isSyncing) return;
    setIsSyncing(true);

    try {
      // 1. Get last synced timestamp from local storage (or DB)
      // For now, we will just sync the last 7 days if no timestamp is present
      const minDate = lastSyncDate ?? Date.now() - 7 * 24 * 60 * 60 * 1000;

      // 2. Fetch recent SMS messages
      const filter = {
        box: "inbox" as const,
        minDate,
      };

      SmsAndroid.list(
        JSON.stringify(filter),
        (fail) => {
          console.error("Failed to read SMS:", fail);
          setIsSyncing(false);
        },
        async (_count, smsList) => {
          const messages = JSON.parse(smsList);
          let newRecords = 0;

          for (const msg of messages) {
            const parsed = parseFinancialSms(msg.body);
            if (parsed) {
              // Check if already exists (transactions.id is the M-PESA code)
              const existing = await db
                .select()
                .from(transactions)
                .where(eq(transactions.id, parsed.transactionCode))
                .limit(1);

              if (existing.length === 0) {
                await db.insert(transactions).values({
                  id: parsed.transactionCode,
                  merchantOrSender: parsed.merchantOrSender,
                  amount: parsed.amount,
                  type: parsed.type,
                  date: parsed.date,
                  transactionFee: parsed.transactionFee,
                  accountBalance: parsed.accountBalance,
                  originalCurrency: parsed.originalCurrency,
                  originalAmount: parsed.originalAmount,
                  rawSms: msg.body,
                  aiConfidence: 0, // Default to 0 until categorized by AI
                });
                newRecords++;
              }
            }
          }

          setLastSyncDate(Date.now());
          setIsSyncing(false);
          console.log(`Sync complete. Added ${newRecords} new transactions.`);

          // Trigger background categorization for any uncategorized transactions
          if (newRecords > 0) {
            import("@/features/transactions/services/llm-service").then(
              ({ llmService }) => {
                llmService.processPendingCategorizations();
              },
            );
          }
        },
      );
    } catch (e) {
      console.error("Sync error:", e);
      setIsSyncing(false);
    }
  }, [isSyncing, lastSyncDate]);

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
