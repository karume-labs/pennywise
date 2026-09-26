import { Dimensions, View } from "react-native";
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from "victory-native";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";

type Props = {
  trendData: { x: string; y: number }[];
  privacyModeEnabled: boolean;
};

export const SpendingTrendsChart = ({
  trendData,
  privacyModeEnabled,
}: Props) => {
  const chartColor = "#B5652F"; // Primary (Umber Brown)
  const textColor = "#A69C8D"; // Text Secondary (Warm Grey)
  const gridColor = "#3A2E22"; // Border/divider (Muted Umber)
  const tooltipBg = "#2A2724"; // Elevated surface (Storm Grey)
  const tooltipText = "#EDE3CE"; // Text Primary (Rotting Cream)

  const screenWidth = Dimensions.get("window").width;
  const chartWidth = screenWidth - 32; // Container padding is px-4 (16 * 2)

  return (
    <Card className="items-center justify-center mb-8">
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
                privacyModeEnabled ? "***" : `KES ${datum.y.toLocaleString()}`
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
    </Card>
  );
};
