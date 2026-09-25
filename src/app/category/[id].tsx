import { useRouter } from "expo-router";
import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowUpIcon,
  ShoppingCart,
} from "lucide-react-native";
import { Pressable, ScrollView, View } from "react-native";
import { Text } from "@/components/ui/text";
import { useFormatCurrency } from "@/shared/hooks/use-format-currency";

const MOCK_CATEGORY_TRANSACTIONS = [
  {
    id: "101",
    merchant: "Naivas Supermarket",
    amount: 4500,
    type: "EXPENSE",
    date: "Today, 14:30",
  },
  {
    id: "102",
    merchant: "Carrefour Mega",
    amount: 10900,
    type: "EXPENSE",
    date: "18 Sep",
  },
];

const CategoryDetailScreen = () => {
  const router = useRouter();
  const formatCurrency = useFormatCurrency();

  const categoryTotal = 15400;

  return (
    <View className="flex-1 bg-background">
      <View className="px-4 pt-12 pb-4 border-b border-border/50 flex-row items-center gap-4">
        <Pressable
          onPress={() => router.back()}
          className="p-2 -ml-2 rounded-full active:bg-muted"
        >
          <ArrowLeftIcon size={24} className="text-foreground" />
        </Pressable>
        <Text className="text-foreground text-xl font-serif">Groceries</Text>
      </View>

      <ScrollView className="flex-1 px-4 pt-6">
        <View className="items-center mb-8">
          <View className="w-16 h-16 rounded-2xl bg-secondary items-center justify-center mb-4">
            <ShoppingCart size={32} color="#6C391A" strokeWidth={1.5} />
          </View>
          <Text className="text-muted-foreground uppercase tracking-widest text-xs font-semibold mb-2">
            Total Spent
          </Text>
          <Text className="text-foreground text-4xl font-serif tracking-tight">
            {formatCurrency(categoryTotal)}
          </Text>
        </View>

        <Text className="text-foreground text-lg font-serif mb-4">
          Transactions
        </Text>

        <View className="gap-3 pb-12">
          {MOCK_CATEGORY_TRANSACTIONS.map((tx) => (
            <View
              key={tx.id}
              className="flex-row items-center justify-between bg-card p-4 rounded-2xl border border-border"
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
                  <Text className="text-foreground font-medium">
                    {tx.merchant}
                  </Text>
                  <Text className="text-muted-foreground text-xs">
                    {tx.date}
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
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default CategoryDetailScreen;
