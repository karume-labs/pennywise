import { Dimensions, ScrollView, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { useUniwind } from "uniwind";
import { Text } from "@/components/ui/text";

export default function AnalyticsScreen() {
  const { theme } = useUniwind();
  const isDark = theme === "dark";

  const chartColor = "#6C391A"; // Primary (Umber Brown)
  const textColor = isDark ? "#E8DCC4" : "#3A3A3C"; // Rotting Cream or Storm Grey
  const gridColor = isDark ? "#3A3A3C" : "#d5c8b0"; // Muted border colors
  const tooltipBg = isDark ? "#3A3A3C" : "#d5c8b0";
  const tooltipText = isDark ? "#E8DCC4" : "#0D0D0D";

  // Mock data for the line chart (spending trends over 6 months)
  const trendData = [
    { value: 16000, label: "Apr" },
    { value: 14500, label: "May" },
    { value: 18000, label: "Jun" },
    { value: 24000, label: "Jul" },
    { value: 21000, label: "Aug" },
    { value: 19500, label: "Sep" },
  ];

  const screenWidth = Dimensions.get("window").width;
  const chartWidth = screenWidth - 80; // Accounting for padding

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1 px-4 pt-6"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Interactive Chart */}
        <View className="bg-card border border-border rounded-3xl p-6 items-center justify-center mb-8 shadow-sm">
          <Text className="text-muted-foreground text-center mb-6 font-semibold uppercase tracking-widest text-xs">
            Spending Trends
          </Text>
          <View className="w-full items-center pl-2">
            <LineChart
              data={trendData}
              width={chartWidth}
              height={140}
              thickness={3}
              color={chartColor}
              noOfSections={3}
              yAxisTextStyle={{
                color: textColor,
                fontSize: 10,
                fontFamily: "Inter_400Regular",
              }}
              xAxisLabelTextStyle={{
                color: textColor,
                fontSize: 10,
                fontFamily: "Inter_400Regular",
                marginTop: 4,
              }}
              yAxisColor="transparent"
              xAxisColor={gridColor}
              rulesColor={gridColor}
              yAxisLabelPrefix="KES "
              yAxisLabelWidth={65}
              isAnimated
              animationDuration={1200}
              hideDataPoints
              focusEnabled
              showStripOnFocus
              showTextOnFocus
              pointerConfig={{
                pointerStripHeight: 140,
                pointerStripColor: chartColor,
                pointerStripWidth: 2,
                pointerColor: chartColor,
                radius: 6,
                pointerLabelWidth: 90,
                pointerLabelHeight: 36,
                activatePointersOnLongPress: false,
                autoAdjustPointerLabelPosition: true,
                pointerLabelComponent: (items: any) => {
                  return (
                    <View
                      style={{
                        height: 36,
                        width: 90,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: tooltipBg,
                        borderRadius: 8,
                        marginTop: -30,
                        marginLeft: -45,
                      }}
                    >
                      <Text
                        style={{
                          color: tooltipText,
                          fontSize: 11,
                          fontWeight: "bold",
                          fontFamily: "Inter_400Regular",
                        }}
                      >
                        {items[0].value.toLocaleString()}
                      </Text>
                    </View>
                  );
                },
              }}
            />
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
