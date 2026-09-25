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

export default function AnalyticsScreen() {
  const { theme } = useUniwind();
  const isDark = theme === "dark";

  const chartColor = "#6C391A"; // Primary (Umber Brown)
  const textColor = isDark ? "#E8DCC4" : "#3A3A3C"; // Rotting Cream or Storm Grey
  const gridColor = isDark ? "#3A3A3C" : "#d5c8b0"; // Muted border colors
  const tooltipBg = isDark ? "#3A3A3C" : "#E8DCC4";
  const tooltipText = isDark ? "#E8DCC4" : "#0D0D0D";

  // Mock data for the line chart (spending trends over 6 months)
  const trendData = [
    { x: "Apr", y: 16000 },
    { x: "May", y: 14500 },
    { x: "Jun", y: 18000 },
    { x: "Jul", y: 24000 },
    { x: "Aug", y: 21000 },
    { x: "Sep", y: 19500 },
  ];

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
                  duration: 1000,
                  onLoad: { duration: 1000 },
                }}
              />
            </VictoryChart>
          </View>
        </View>

        <Text className="text-foreground text-lg font-serif mb-4">
          Top Categories
        </Text>
        <View className="gap-4 pb-8">
          {[
            {
              name: "Groceries",
              amount: 15400,
              color: "bg-georgie",
              width: "70%",
            },
            {
              name: "Transport",
              amount: 8200,
              color: "bg-sewer",
              width: "40%",
            },
            {
              name: "Utilities",
              amount: 4500,
              color: "bg-deadlights",
              width: "25%",
            },
            {
              name: "Entertainment",
              amount: 3000,
              color: "bg-barrens",
              width: "15%",
            },
          ].map((cat) => (
            <View
              key={cat.name}
              className="bg-card p-4 rounded-2xl border border-border"
            >
              <View className="flex-row justify-between mb-2">
                <Text className="text-foreground font-medium">{cat.name}</Text>
                <Text className="text-foreground font-semibold">
                  KES {cat.amount.toLocaleString()}
                </Text>
              </View>
              <View className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <View
                  className={`h-full ${cat.color}`}
                  style={{
                    width: cat.width as import("react-native").DimensionValue,
                  }}
                />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
