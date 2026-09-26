import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useRef, useState } from "react";
import { ScrollView, View } from "react-native";
import { useSettingsStore } from "@/features/settings/store";
import { AddBudgetModal } from "@/features/transactions/components/AddBudgetModal";
import { AddSubscriptionModal } from "@/features/transactions/components/AddSubscriptionModal";
import { BudgetsList } from "@/features/transactions/components/BudgetsList";
import { SpendingTrendsChart } from "@/features/transactions/components/SpendingTrendsChart";
import { SubscriptionsList } from "@/features/transactions/components/SubscriptionsList";
import { TopCategoriesList } from "@/features/transactions/components/TopCategoriesList";
import {
  activeSubscriptionsQuery,
  allBudgetsQuery,
  thisMonthTransactionsQuery,
} from "@/features/transactions/queries";
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
  const { data: budgets } = useLiveQuery(allBudgetsQuery);
  const { data: subscriptions } = useLiveQuery(activeSubscriptionsQuery);
  const formatCurrency = useFormatCurrency();
  const { privacyModeEnabled } = useSettingsStore();

  const addBudgetModalRef = useRef<BottomSheetModal>(null);
  const addSubscriptionModalRef = useRef<BottomSheetModal>(null);

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

        <BudgetsList
          thisMonthTxs={thisMonthTxs}
          budgets={budgets}
          isLoading={budgets === undefined}
          formatCurrency={formatCurrency}
          onAdd={() => addBudgetModalRef.current?.present()}
        />

        <SubscriptionsList
          subscriptions={subscriptions}
          isLoading={subscriptions === undefined}
          formatCurrency={formatCurrency}
          onAdd={() => addSubscriptionModalRef.current?.present()}
        />

        <TopCategoriesList
          thisMonthTxs={thisMonthTxs}
          isLoading={thisMonthTxs === undefined}
          formatCurrency={formatCurrency}
        />
      </ScrollView>

      <AddBudgetModal ref={addBudgetModalRef} />
      <AddSubscriptionModal ref={addSubscriptionModalRef} />
    </View>
  );
};

export default AnalyticsScreen;
