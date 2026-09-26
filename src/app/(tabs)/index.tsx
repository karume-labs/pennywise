import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { PlusIcon } from "lucide-react-native";
import { useCallback, useRef, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import type { transactions } from "@/db/schema";
import { AddTransactionModal } from "@/features/transactions/components/AddTransactionModal";
import { DashboardHeader } from "@/features/transactions/components/DashboardHeader";
import { RecentTransactionsList } from "@/features/transactions/components/RecentTransactionsList";
import { SyncStatusCard } from "@/features/transactions/components/SyncStatusCard";
import {
  type Transaction,
  TransactionDetailModal,
} from "@/features/transactions/components/TransactionDetailModal";
import { useSyncEngine } from "@/features/transactions/hooks/use-sync-engine";
import {
  allTransactionsQuery,
  recentTransactionsQuery,
} from "@/features/transactions/queries";
import { useFormatCurrency } from "@/shared/hooks/use-format-currency";

const DashboardScreen = () => {
  const formatCurrency = useFormatCurrency();
  const addModalRef = useRef<BottomSheetModal>(null);
  const txModalRef = useRef<BottomSheetModal>(null);

  const { isSyncing, lastSyncDate, performSync } = useSyncEngine();

  const { data: recentTxs } = useLiveQuery(recentTransactionsQuery);
  const { data: allTxs } = useLiveQuery(allTransactionsQuery);

  const totalIncome =
    allTxs?.reduce(
      (acc, tx) => acc + (tx.type === "INCOME" ? tx.amount : 0),
      0,
    ) || 0;
  const totalExpenses =
    allTxs?.reduce(
      (acc, tx) => acc + (tx.type === "EXPENSE" ? tx.amount : 0),
      0,
    ) || 0;
  // If we had starting balance, we'd add it here. For now: Income - Expenses
  const currentBalance =
    allTxs && allTxs.length > 0
      ? (allTxs[0].accountBalance ?? totalIncome - totalExpenses)
      : 0;

  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [createRule, setCreateRule] = useState(false);

  const handleOpenAddModal = useCallback(() => {
    addModalRef.current?.present();
  }, []);

  const handleOpenTxModal = useCallback(
    (tx: typeof transactions.$inferSelect) => {
      setSelectedTx({
        id: tx.id,
        amount: tx.amount,
        type: tx.type,
        merchant: tx.merchantOrSender ?? "Unknown",
        category: tx.category ?? "Uncategorized",
        aiConfidence: tx.aiConfidence,
        date: new Date(tx.date).toLocaleDateString(), // Modal expects string
      });
      setCreateRule(false);
      txModalRef.current?.present();
    },
    [],
  );

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1 px-4 pt-6">
        <DashboardHeader
          currentBalance={currentBalance}
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          formatCurrency={formatCurrency}
        />

        <SyncStatusCard
          isSyncing={isSyncing}
          lastSyncDate={lastSyncDate}
          performSync={performSync}
        />

        <RecentTransactionsList
          recentTxs={recentTxs}
          formatCurrency={formatCurrency}
          handleOpenTxModal={handleOpenTxModal}
        />
      </ScrollView>

      {/* FAB */}
      <Pressable
        onPress={handleOpenAddModal}
        className="absolute bottom-6 right-6 w-14 h-14 bg-primary rounded-full items-center justify-center shadow-lg active:scale-95 active:opacity-80"
      >
        <PlusIcon size={24} className="text-primary-foreground" />
      </Pressable>

      <AddTransactionModal ref={addModalRef} />

      <TransactionDetailModal
        ref={txModalRef}
        selectedTx={selectedTx}
        createRule={createRule}
        setCreateRule={setCreateRule}
      />
    </View>
  );
};

export default DashboardScreen;
