import { useRouter } from "expo-router";
import { Car, ShoppingCart, Tv, Zap } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";
import type { transactions } from "@/db/schema";

type Props = {
  thisMonthTxs: (typeof transactions.$inferSelect)[] | undefined;
  formatCurrency: (
    amount: number,
    currency?: string,
    includeSymbol?: boolean,
  ) => string;
};

export const TopCategoriesList = ({ thisMonthTxs, formatCurrency }: Props) => {
  const router = useRouter();

  if (!thisMonthTxs) return null;

  const categoryMap = new Map<string, number>();
  let totalSpend = 0;
  thisMonthTxs.forEach((tx) => {
    if (tx.type === "EXPENSE") {
      const cat = tx.category || "Uncategorized";
      categoryMap.set(cat, (categoryMap.get(cat) || 0) + tx.amount);
      totalSpend += tx.amount;
    }
  });

  const topCategories = Array.from(categoryMap.entries())
    .map(([name, amount]) => ({
      name,
      amount,
      pct: totalSpend > 0 ? Math.round((amount / totalSpend) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 4)
    .map((cat, idx) => {
      let icon = ShoppingCart;
      if (cat.name === "Transport") icon = Car;
      if (cat.name === "Utilities") icon = Zap;
      if (cat.name === "Entertainment") icon = Tv;

      return {
        ...cat,
        rank: idx + 1,
        sub: "Category",
        icon,
      };
    });

  if (topCategories.length === 0) {
    return (
      <View className="bg-card border border-border rounded-3xl overflow-hidden mb-8 p-4 items-center">
        <Text className="text-muted-foreground">No expenses this month</Text>
      </View>
    );
  }

  return (
    <>
      <View className="flex-row items-baseline justify-between mb-4">
        <Text className="text-foreground text-lg font-serif">
          Top Categories
        </Text>
        <Text className="text-muted-foreground text-xs uppercase tracking-widest">
          This Month
        </Text>
      </View>
      <View className="bg-card border border-border rounded-3xl overflow-hidden mb-8">
        {topCategories.map((cat, idx, arr) => {
          const Icon = cat.icon;
          const isLast = idx === arr.length - 1;
          return (
            <View key={cat.name}>
              <Pressable
                className="px-4 py-4 flex-row items-center gap-4 active:bg-muted/50"
                onPress={() => router.push(`/category/${cat.name}`)}
              >
                <View className="w-11 h-11 rounded-xl bg-secondary items-center justify-center">
                  <Icon size={20} color="#6C391A" strokeWidth={1.75} />
                </View>

                <View className="flex-1">
                  <View className="flex-row items-center gap-2 mb-0.5">
                    <Text className="text-foreground font-bold text-[15px]">
                      {cat.name}
                    </Text>
                    <Text className="text-muted-foreground text-[10px] uppercase tracking-wider font-medium">
                      #{cat.rank}
                    </Text>
                  </View>
                  <Text className="text-muted-foreground text-xs mb-2">
                    {cat.sub}
                  </Text>
                  <View className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                    <View
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${cat.pct}%` }}
                    />
                  </View>
                </View>

                <View className="items-end">
                  <Text className="text-foreground font-bold text-[15px]">
                    {formatCurrency(cat.amount)}
                  </Text>
                  <Text className="text-muted-foreground text-xs mt-0.5">
                    {cat.pct}% of budget
                  </Text>
                </View>
              </Pressable>

              {!isLast && <View className="h-px bg-border mx-4" />}
            </View>
          );
        })}
      </View>
    </>
  );
};
