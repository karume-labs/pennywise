import { useFocusEffect } from "expo-router";
import { Car, ShoppingCart, Tv, Zap } from "lucide-react-native";
import { useCallback, useState } from "react";
import { Dimensions, ScrollView, View } from "react-native";
import { useUniwind } from "uniwind";
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from "victory-native";
import { Text } from "@/components/ui/text";

const ALL_TREND_DATA = [
  { x: "Apr", y: 16000 },
  { x: "May", y: 14500 },
  { x: "Jun", y: 18000 },
  { x: "Jul", y: 24000 },
  { x: "Aug", y: 21000 },
  { x: "Sep", y: 19500 },
];

export default function AnalyticsScreen() {
  const { theme } = useUniwind();
  const [trendData, setTrendData] = useState(ALL_TREND_DATA);

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
                  labels={({ datum }) => `KES ${datum.y.toLocaleString()}`}
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
                tickFormat={(t) => `KES ${t / 1000}k`}
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
          {[
            {
              rank: 1,
              name: "Groceries",
              sub: "Food & household",
              amount: 15400,
              pct: 70,
              icon: ShoppingCart,
            },
            {
              rank: 2,
              name: "Transport",
              sub: "Fuel & transit",
              amount: 8200,
              pct: 40,
              icon: Car,
            },
            {
              rank: 3,
              name: "Utilities",
              sub: "Power & water",
              amount: 4500,
              pct: 25,
              icon: Zap,
            },
            {
              rank: 4,
              name: "Entertainment",
              sub: "Streaming & leisure",
              amount: 3000,
              pct: 15,
              icon: Tv,
            },
          ].map((cat, idx, arr) => {
            const Icon = cat.icon;
            const isLast = idx === arr.length - 1;
            return (
              <View key={cat.name}>
                <View className="px-4 py-4 flex-row items-center gap-4">
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
                      KES {cat.amount.toLocaleString()}
                    </Text>
                    <Text className="text-muted-foreground text-xs mt-0.5">
                      {cat.pct}% of budget
                    </Text>
                  </View>
                </View>

                {/* Divider — skip on last item */}
                {!isLast && <View className="h-px bg-border mx-4" />}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
