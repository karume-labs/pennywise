import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { useSettingsStore } from "@/features/settings/store";
import { SpendingTrendsChart } from "@/features/transactions/components/SpendingTrendsChart";
import { TopCategoriesList } from "@/features/transactions/components/TopCategoriesList";
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
  const [trendData, _setTrendData] = useState(ALL_TREND_DATA);
  const { data: thisMonthTxs } = useLiveQuery(thisMonthTransactionsQuery);
  const formatCurrency = useFormatCurrency();
  const { privacyModeEnabled } = useSettingsStore();
  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1 px-4 pt-6"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <SpendingTrendsChart
          trendData={trendData}
          privacyModeEnabled={privacyModeEnabled}
        />

        <TopCategoriesList
          thisMonthTxs={thisMonthTxs}
          formatCurrency={formatCurrency}
        />
      </ScrollView>
    </View>
  );
};

export default AnalyticsScreen;
