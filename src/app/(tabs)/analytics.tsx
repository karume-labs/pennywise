import { ScrollView, View } from "react-native";
import { Text } from "@/components/ui/text";

export default function AnalyticsScreen() {
  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1 px-4 pt-6">
        {/* Placeholder for chart */}
        <View className="bg-card border border-border rounded-3xl p-6 h-64 items-center justify-center mb-6 shadow-sm">
          <Text className="text-muted-foreground text-center mb-2">
            Spending Trends (Mock)
          </Text>
          <View className="flex-row items-end gap-2 h-32 mt-4">
            {[
              { id: "1", h: 40 },
              { id: "2", h: 70 },
              { id: "3", h: 45 },
              { id: "4", h: 90 },
              { id: "5", h: 60 },
              { id: "6", h: 110 },
              { id: "7", h: 80 },
            ].map((bar) => (
              <View
                key={bar.id}
                className="w-8 bg-primary rounded-t-md"
                style={{ height: bar.h }}
              />
            ))}
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
              color: "bg-emerald-500",
              width: "70%",
            },
            {
              name: "Transport",
              amount: 8200,
              color: "bg-blue-500",
              width: "40%",
            },
            {
              name: "Utilities",
              amount: 4500,
              color: "bg-amber-500",
              width: "25%",
            },
            {
              name: "Entertainment",
              amount: 3000,
              color: "bg-purple-500",
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
