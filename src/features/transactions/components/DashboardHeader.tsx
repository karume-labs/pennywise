import { ArrowDownIcon, ArrowUpIcon } from "lucide-react-native";
import { View } from "react-native";
import { Text } from "@/components/ui/text";

type Props = {
  currentBalance: number;
  totalIncome: number;
  totalExpenses: number;
  formatCurrency: (
    amount: number,
    currency?: string,
    includeSymbol?: boolean,
  ) => string;
};

export const DashboardHeader = ({
  currentBalance,
  totalIncome,
  totalExpenses,
  formatCurrency,
}: Props) => {
  return (
    <View className="mb-8 items-center">
      <Text className="text-muted-foreground text-sm font-medium mb-1 font-sans">
        Total Balance
      </Text>
      <Text className="text-foreground text-4xl font-serif tracking-tight">
        {formatCurrency(currentBalance)}
      </Text>

      <View className="flex-row items-center gap-6 mt-4">
        <View className="flex-row items-center gap-2">
          <View className="bg-emerald-500/20 p-2 rounded-full">
            <ArrowDownIcon size={16} color="#10b981" />
          </View>
          <View>
            <Text className="text-muted-foreground text-xs">Income</Text>
            <Text className="text-foreground font-semibold">
              {formatCurrency(totalIncome)}
            </Text>
          </View>
        </View>
        <View className="flex-row items-center gap-2">
          <View className="bg-muted p-2 rounded-full">
            <ArrowUpIcon size={16} className="text-foreground" />
          </View>
          <View>
            <Text className="text-muted-foreground text-xs">Expenses</Text>
            <Text className="text-foreground font-semibold">
              {formatCurrency(totalExpenses)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
