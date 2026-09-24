import {
  AlertCircleIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  RefreshCwIcon,
} from "lucide-react-native";
import { SafeAreaView, ScrollView, View } from "react-native";
import { useUniwind } from "uniwind";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

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
  const { theme } = useUniwind();
  const _isDark = theme === "dark";

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 px-4 pt-6">
        {/* Header / Balance */}
        <View className="mb-8 items-center">
          <Text className="text-muted-foreground text-sm font-medium mb-1">
            Total Balance
          </Text>
          <Text className="text-foreground text-4xl font-bold tracking-tight">
            KES 124,500
          </Text>

          <View className="flex-row items-center gap-6 mt-4">
            <View className="flex-row items-center gap-2">
              <View className="bg-emerald-500/20 p-2 rounded-full">
                <ArrowDownIcon size={16} color="#10b981" />
              </View>
              <View>
                <Text className="text-muted-foreground text-xs">Income</Text>
                <Text className="text-foreground font-semibold">
                  KES 45,000
                </Text>
              </View>
            </View>
            <View className="flex-row items-center gap-2">
              <View className="bg-rose-500/20 p-2 rounded-full">
                <ArrowUpIcon size={16} color="#f43f5e" />
              </View>
              <View>
                <Text className="text-muted-foreground text-xs">Expenses</Text>
                <Text className="text-foreground font-semibold">
                  KES 18,250
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Sync Status */}
        <View className="flex-row items-center justify-between bg-secondary/50 p-4 rounded-2xl mb-6">
          <View className="flex-row items-center gap-3">
            <View className="bg-primary/10 p-2 rounded-full">
              <RefreshCwIcon size={18} className="text-primary" />
            </View>
            <View>
              <Text className="text-foreground font-medium">
                SMS Sync Active
              </Text>
              <Text className="text-muted-foreground text-xs">
                Last synced 2 mins ago
              </Text>
            </View>
          </View>
          <Button variant="ghost" size="sm" className="rounded-full">
            <Text className="text-primary">Sync</Text>
          </Button>
        </View>

        {/* Transactions List */}
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-foreground text-lg font-semibold">
            Recent Transactions
          </Text>
          <Button variant="ghost" size="sm">
            <Text className="text-primary">See All</Text>
          </Button>
        </View>

        <View className="gap-3 pb-8">
          {MOCK_TRANSACTIONS.map((tx) => (
            <View
              key={tx.id}
              className="flex-row items-center justify-between bg-card p-4 rounded-2xl border border-border"
            >
              <View className="flex-row items-center gap-3">
                <View
                  className={`w-10 h-10 rounded-full items-center justify-center ${tx.type === "EXPENSE" ? "bg-rose-500/10" : "bg-emerald-500/10"}`}
                >
                  {tx.type === "EXPENSE" ? (
                    <ArrowUpIcon size={18} color="#f43f5e" />
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
                {tx.type === "EXPENSE" ? "-" : "+"}KES{" "}
                {tx.amount.toLocaleString()}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
