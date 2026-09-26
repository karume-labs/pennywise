import { PlusIcon } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";
import type { budgets, transactions } from "@/db/schema";

type Transaction = typeof transactions.$inferSelect;
type Budget = typeof budgets.$inferSelect;

type Props = {
  thisMonthTxs: Transaction[] | undefined;
  budgets: Budget[] | undefined;
  formatCurrency: (amount: number) => string;
  onAdd: () => void;
};

export const BudgetsList = ({
  thisMonthTxs,
  budgets,
  formatCurrency,
  onAdd,
}: Props) => {
  // Calculate spending per category
  const spendingByCategory = (thisMonthTxs || []).reduce(
    (acc, tx) => {
      if (tx.type === "EXPENSE") {
        acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
      }
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <View className="mt-8">
      <View className="flex-row justify-between items-center mb-4 ml-2 mr-2">
        <Text className="text-muted-foreground font-semibold">
          Monthly Budgets
        </Text>
        <Pressable onPress={onAdd}>
          <PlusIcon size={20} className="text-primary" />
        </Pressable>
      </View>
      <View className="bg-card rounded-2xl border border-border p-4 gap-6">
        {!budgets || budgets.length === 0 ? (
          <Text className="text-muted-foreground text-center py-4">
            No budgets set. Tap + to add one.
          </Text>
        ) : (
          budgets.map((budget) => {
            const spent = spendingByCategory[budget.category] || 0;
            const progress = Math.min((spent / budget.amountLimit) * 100, 100);
            const isWarning = progress >= budget.alertThreshold * 100;
            const isDanger = progress >= 100;

            let progressColor = "bg-primary";
            if (isDanger) progressColor = "bg-destructive";
            else if (isWarning) progressColor = "bg-amber-500";

            return (
              <View key={budget.id} className="gap-2">
                <View className="flex-row justify-between items-end">
                  <Text className="text-foreground font-medium">
                    {budget.category}
                  </Text>
                  <Text className="text-muted-foreground text-xs font-mono">
                    <Text
                      className={
                        isDanger
                          ? "text-destructive font-bold"
                          : "text-foreground"
                      }
                    >
                      {formatCurrency(spent)}
                    </Text>
                    {" / "}
                    {formatCurrency(budget.amountLimit)}
                  </Text>
                </View>
                <View className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <View
                    className={`h-full ${progressColor} rounded-full`}
                    style={{ width: `${progress}%` }}
                  />
                </View>
              </View>
            );
          })
        )}
      </View>
    </View>
  );
};
