import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import {
  AlertCircleIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  PlusIcon,
  RefreshCwIcon,
} from "lucide-react-native";
import { useCallback, useRef, useState } from "react";
import { Pressable, ScrollView, Switch, TextInput, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useFormatCurrency } from "@/hooks/useFormatCurrency";
import { useSyncEngine } from "@/hooks/useSyncEngine";

const MOCK_TRANSACTIONS = [
  {
    id: "1",
    merchant: "Naivas Supermarket",
    amount: 4500,
    type: "EXPENSE",
    category: "Groceries",
    date: "Today, 14:30",
    aiConfidence: 0.9,
  },
  {
    id: "2",
    merchant: "John Doe",
    amount: 15000,
    type: "INCOME",
    category: "Transfer",
    date: "Yesterday",
    aiConfidence: 0.95,
  },
  {
    id: "3",
    merchant: "Uber BV",
    amount: 850,
    type: "EXPENSE",
    category: "Transport",
    date: "21 Sep",
    aiConfidence: 0.4,
  },
  {
    id: "4",
    merchant: "KPLC Tokens",
    amount: 2000,
    type: "EXPENSE",
    category: "Utilities",
    date: "20 Sep",
    aiConfidence: 0.88,
  },
];

export default function DashboardScreen() {
  const formatCurrency = useFormatCurrency();
  const addModalRef = useRef<BottomSheetModal>(null);
  const txModalRef = useRef<BottomSheetModal>(null);

  const { isSyncing, lastSyncDate, performSync } = useSyncEngine();

  const [selectedTx, setSelectedTx] = useState<
    (typeof MOCK_TRANSACTIONS)[0] | null
  >(null);
  const [createRule, setCreateRule] = useState(false);

  const handleOpenAddModal = useCallback(() => {
    addModalRef.current?.present();
  }, []);

  const handleOpenTxModal = useCallback((tx: (typeof MOCK_TRANSACTIONS)[0]) => {
    setSelectedTx(tx);
    setCreateRule(false);
    txModalRef.current?.present();
  }, []);

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1 px-4 pt-6">
        {/* Header / Balance */}
        <View className="mb-8 items-center">
          <Text className="text-muted-foreground text-sm font-medium mb-1 font-sans">
            Total Balance
          </Text>
          <Text className="text-foreground text-4xl font-serif tracking-tight">
            {formatCurrency(124500)}
          </Text>

          <View className="flex-row items-center gap-6 mt-4">
            <View className="flex-row items-center gap-2">
              <View className="bg-emerald-500/20 p-2 rounded-full">
                <ArrowDownIcon size={16} color="#10b981" />
              </View>
              <View>
                <Text className="text-muted-foreground text-xs">Income</Text>
                <Text className="text-foreground font-semibold">
                  {formatCurrency(45000)}
                </Text>
              </View>
            </View>
            <View className="flex-row items-center gap-2">
              <View className="bg-muted p-2 rounded-full">
                <ArrowUpIcon size={16} className="text-foreground" />
              </View>
              <View>
                <Text className="text-muted-foreground text-xs">Expenses</Text>
                <Text className="text-foreground font-semibold">
                  {formatCurrency(18250)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Sync Status */}
        <View className="flex-row items-center justify-between bg-secondary/50 p-4 rounded-2xl mb-6">
          <View className="flex-row items-center gap-3">
            <View className="bg-primary/10 p-2 rounded-full">
              <RefreshCwIcon
                size={18}
                className={`text-primary ${isSyncing ? "animate-spin" : ""}`}
              />
            </View>
            <View>
              <Text className="text-foreground font-medium">
                {isSyncing ? "Syncing SMS..." : "SMS Sync Active"}
              </Text>
              <Text className="text-muted-foreground text-xs">
                {lastSyncDate
                  ? `Last synced ${new Date(lastSyncDate).toLocaleTimeString()}`
                  : "Ready"}
              </Text>
            </View>
          </View>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full"
            onPress={performSync}
            disabled={isSyncing}
          >
            <Text className="text-primary">
              {isSyncing ? "Syncing..." : "Sync"}
            </Text>
          </Button>
        </View>

        {/* Transactions List */}
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-foreground text-lg font-serif">
            Recent Transactions
          </Text>
          <Button variant="ghost" size="sm">
            <Text className="text-primary">See All</Text>
          </Button>
        </View>

        <View className="gap-3 pb-8">
          {MOCK_TRANSACTIONS.map((tx) => (
            <Pressable
              key={tx.id}
              onPress={() => handleOpenTxModal(tx)}
              className="flex-row items-center justify-between bg-card p-4 rounded-2xl border border-border active:bg-muted/50"
            >
              <View className="flex-row items-center gap-3">
                <View
                  className={`w-10 h-10 rounded-full items-center justify-center ${tx.type === "EXPENSE" ? "bg-muted" : "bg-emerald-500/10"}`}
                >
                  {tx.type === "EXPENSE" ? (
                    <ArrowUpIcon size={18} className="text-foreground" />
                  ) : (
                    <ArrowDownIcon size={18} color="#10b981" />
                  )}
                </View>
                <View>
                  <View className="flex-row items-center gap-2">
                    <Text className="text-foreground font-medium">
                      {tx.merchant}
                    </Text>
                    {tx.aiConfidence < 0.5 && (
                      <View className="bg-amber-500/20 px-1.5 py-0.5 rounded flex-row items-center gap-1">
                        <AlertCircleIcon size={10} color="#f59e0b" />
                        <Text className="text-amber-500 text-[10px] font-bold">
                          REVIEW
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text className="text-muted-foreground text-xs">
                    {tx.category} • {tx.date}
                  </Text>
                </View>
              </View>
              <Text
                className={`font-semibold ${tx.type === "EXPENSE" ? "text-foreground" : "text-emerald-500"}`}
              >
                {formatCurrency(
                  tx.type === "EXPENSE" ? -tx.amount : tx.amount,
                  "KES",
                  true,
                )}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* FAB */}
      <Pressable
        onPress={handleOpenAddModal}
        className="absolute bottom-6 right-6 w-14 h-14 bg-primary rounded-full items-center justify-center shadow-lg active:scale-95 active:opacity-80"
      >
        <PlusIcon size={24} className="text-primary-foreground" />
      </Pressable>

      <BottomSheetModal
        ref={addModalRef}
        enableDynamicSizing={true}
        backgroundStyle={{ backgroundColor: "#2A2724" }}
        handleIndicatorStyle={{ backgroundColor: "#3A2E22" }}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            opacity={0.5}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
          />
        )}
      >
        <BottomSheetView className="p-6 pb-12 gap-4">
          <Text className="font-rye text-foreground text-2xl mb-2">
            Add Transaction
          </Text>

          <View className="gap-2">
            <Text className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">
              Amount
            </Text>
            <TextInput
              placeholder="KES 0.00"
              placeholderTextColor="#A69C8D"
              keyboardType="decimal-pad"
              className="bg-background text-foreground border border-border rounded-xl px-4 py-3 font-medium"
            />
          </View>

          <View className="gap-2">
            <Text className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">
              Merchant / Description
            </Text>
            <TextInput
              placeholder="E.g., Java House"
              placeholderTextColor="#A69C8D"
              className="bg-background text-foreground border border-border rounded-xl px-4 py-3 font-medium"
            />
          </View>

          <View className="gap-2">
            <Text className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">
              Category
            </Text>
            {/* Simple mock button for dropdown */}
            <Pressable className="bg-background border border-border rounded-xl px-4 py-3 flex-row items-center justify-between">
              <Text className="text-foreground font-medium">
                Select Category
              </Text>
              <ArrowDownIcon size={16} className="text-muted-foreground" />
            </Pressable>
          </View>

          <Button
            className="bg-primary w-full mt-4"
            onPress={() => addModalRef.current?.dismiss()}
          >
            <Text className="text-primary-foreground font-medium">
              Save Transaction
            </Text>
          </Button>
        </BottomSheetView>
      </BottomSheetModal>

      {/* Transaction Details Modal */}
      <BottomSheetModal
        ref={txModalRef}
        enableDynamicSizing={true}
        backgroundStyle={{ backgroundColor: "#2A2724" }}
        handleIndicatorStyle={{ backgroundColor: "#3A2E22" }}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            opacity={0.5}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
          />
        )}
      >
        <BottomSheetView className="p-6 pb-12 gap-6">
          <View>
            <Text className="text-muted-foreground text-xs uppercase tracking-wider font-semibold mb-1">
              Merchant
            </Text>
            <Text className="font-rye text-foreground text-2xl">
              {selectedTx?.merchant}
            </Text>
            <Text className="text-muted-foreground text-sm mt-1">
              {selectedTx?.date}
            </Text>
          </View>

          <View className="bg-background rounded-xl border border-border p-4 gap-2">
            <Text className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">
              Raw SMS Data
            </Text>
            <Text className="text-foreground text-sm font-mono opacity-80 leading-5">
              Paid KES {selectedTx?.amount.toLocaleString()} to{" "}
              {selectedTx?.merchant} on {selectedTx?.date}. Transaction cost,
              KES 15.00.
            </Text>
          </View>

          <View className="gap-2">
            <Text className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">
              Assigned Category
            </Text>
            <Pressable className="bg-background border border-border rounded-xl px-4 py-3 flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <Text className="text-foreground font-medium">
                  {selectedTx?.category}
                </Text>
                {selectedTx?.aiConfidence && selectedTx.aiConfidence < 0.5 && (
                  <View className="bg-amber-500/20 px-1.5 py-0.5 rounded">
                    <Text className="text-amber-500 text-[10px] font-bold">
                      LOW CONFIDENCE
                    </Text>
                  </View>
                )}
              </View>
              <ArrowDownIcon size={16} className="text-muted-foreground" />
            </Pressable>
          </View>

          <View className="flex-row items-center justify-between bg-card rounded-xl p-4 border border-border mt-2">
            <View className="flex-1 pr-4">
              <Text className="text-foreground font-medium">
                Create custom rule
              </Text>
              <Text className="text-muted-foreground text-xs mt-1">
                Always categorize {selectedTx?.merchant} as{" "}
                {selectedTx?.category}
              </Text>
            </View>
            <Switch
              value={createRule}
              onValueChange={setCreateRule}
              trackColor={{ true: "#B5652F", false: "#3A2E22" }}
            />
          </View>

          <Button
            className="bg-primary w-full mt-2"
            onPress={() => txModalRef.current?.dismiss()}
          >
            <Text className="text-primary-foreground font-medium">
              Update Transaction
            </Text>
          </Button>
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
}
