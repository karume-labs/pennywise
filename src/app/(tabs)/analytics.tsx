import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useFocusEffect, useRouter } from "expo-router";
import { Car, ShoppingCart, Tv, Zap } from "lucide-react-native";
import { useCallback, useState } from "react";
import { Dimensions, Pressable, ScrollView, View } from "react-native";
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from "victory-native";
import { Text } from "@/components/ui/text";
import { useSettingsStore } from "@/features/settings/store";
import { thisMonthTransactionsQuery } from "@/features/transactions/queries";
import { useFormatCurrency } from "@/shared/hooks/use-format-currency";

const ALL_TREND_DATA = [
  { x: "Apr", y: 16000 },
  { x: "May", y: 14500 },
  { x: "Jun", y: 18000 },
  { x: "Jul", y: 24000 },
  { x: "Aug", y: 21000 },
  { x: "Sep", y: 19500 },
];

const AnalyticsScreen = () => {
  const [trendData, setTrendData] = useState(ALL_TREND_DATA);
  const { data: thisMonthTxs } = useLiveQuery(thisMonthTransactionsQuery);
  const formatCurrency = useFormatCurrency();
  const { privacyModeEnabled } = useSettingsStore();
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      // Reset to empty then restore so VictoryLine animates the draw-in on every focus
      setTrendData([]);
      const id = setTimeout(() => setTrendData(ALL_TREND_DATA), 50);
      return () => clearTimeout(id);
    }, []),
  );

  const chartColor = "#B5652F"; // Primary (Umber Brown) - lightened for contrast
  const textColor = "#A69C8D"; // Text Secondary (Warm Grey)
  const gridColor = "#3A2E22"; // Border/divider (Muted Umber)
  const tooltipBg = "#2A2724"; // Elevated surface (Storm Grey)
  const tooltipText = "#EDE3CE"; // Text Primary (Rotting Cream)

  const screenWidth = Dimensions.get("window").width;
  const chartWidth = screenWidth - 32; // Container padding is px-4 (16 * 2)

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1 px-4 pt-6"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Interactive Chart */}
        <View className="bg-card border border-border rounded-3xl p-4 items-center justify-center mb-8 shadow-sm">
          <Text className="text-muted-foreground text-center font-semibold uppercase tracking-widest text-xs mt-2">
            Spending Trends
          </Text>
          <View className="w-full items-center mt-[-10px]">
            <VictoryChart
              width={chartWidth}
              height={220}
              padding={{ top: 30, bottom: 40, left: 60, right: 30 }}
              containerComponent={
                <VictoryVoronoiContainer
                  labels={({ datum }) =>
                    privacyModeEnabled
                      ? "***"
                      : `KES ${datum.y.toLocaleString()}`
                  }
                  labelComponent={
                    <VictoryTooltip
                      renderInPortal={false}
                      flyoutStyle={{
                        fill: tooltipBg,
                        stroke: gridColor,
                        strokeWidth: 1,
                      }}
                      style={{
                        fill: tooltipText,
                        fontSize: 12,
                        fontFamily: "Inter_400Regular",
                      }}
                      pointerLength={5}
                    />
                  }
                />
              }
            >
              <VictoryAxis
                style={{
                  axis: { stroke: gridColor },
                  tickLabels: {
                    fill: textColor,
                    fontSize: 10,
                    fontFamily: "Inter_400Regular",
                    padding: 5,
                  },
                  grid: { stroke: "none" },
                }}
              />
              <VictoryAxis
                dependentAxis
                tickFormat={(t) =>
                  privacyModeEnabled ? "***" : `KES ${t / 1000}k`
                }
                style={{
                  axis: { stroke: "none" },
                  tickLabels: {
                    fill: textColor,
                    fontSize: 10,
                    fontFamily: "Inter_400Regular",
                    padding: 5,
                  },
                  grid: { stroke: gridColor, strokeDasharray: "4, 4" },
                }}
              />
              <VictoryLine
                data={trendData}
                style={{
                  data: { stroke: chartColor, strokeWidth: 3 },
                }}
                animate={{
                  duration: 800,
                  onLoad: { duration: 800 },
                }}
              />
            </VictoryChart>
          </View>
        </View>

        {/* Top Categories */}
        <View className="flex-row items-baseline justify-between mb-4">
          <Text className="text-foreground text-lg font-serif">
            Top Categories
          </Text>
          <Text className="text-muted-foreground text-xs uppercase tracking-widest">
            This Month
          </Text>
        </View>

        <View className="bg-card border border-border rounded-3xl overflow-hidden mb-8">
          {(() => {
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
                pct:
                  totalSpend > 0 ? Math.round((amount / totalSpend) * 100) : 0,
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
                <View className="p-4 items-center">
                  <Text className="text-muted-foreground">
                    No expenses this month
                  </Text>
                </View>
              );
            }

            return topCategories.map((cat, idx, arr) => {
              const Icon = cat.icon;
              const isLast = idx === arr.length - 1;
              return (
                <View key={cat.name}>
                  <Pressable
                    className="px-4 py-4 flex-row items-center gap-4 active:bg-muted/50"
                    onPress={() => router.push(`/category/${cat.name}`)}
                  >
                    {/* Icon container */}
                    <View className="w-11 h-11 rounded-xl bg-secondary items-center justify-center">
                      <Icon size={20} color="#6C391A" strokeWidth={1.75} />
                    </View>

                    {/* Label + sub */}
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
                      {/* Progress track */}
                      <View className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                        <View
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${cat.pct}%` }}
                        />
                      </View>
                    </View>

                    {/* Amount */}
                    <View className="items-end">
                      <Text className="text-foreground font-bold text-[15px]">
                        {formatCurrency(cat.amount)}
                      </Text>
                      <Text className="text-muted-foreground text-xs mt-0.5">
                        {cat.pct}% of budget
                      </Text>
                    </View>
                  </Pressable>

                  {/* Divider — skip on last item */}
                  {!isLast && <View className="h-px bg-border mx-4" />}
                </View>
              );
            });
          })()}
        </View>
      </ScrollView>
    </View>
  );
};

export default AnalyticsScreen;
