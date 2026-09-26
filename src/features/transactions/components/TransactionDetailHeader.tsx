import { View } from "react-native";
import { Text } from "@/components/ui/text";
import type { Transaction } from "./TransactionDetailModal";

type Props = {
  selectedTx: Transaction | null;
};

export const TransactionDetailHeader = ({ selectedTx }: Props) => {
  return (
    <>
      <View>
        <Text className="text-muted-foreground text-xs uppercase tracking-wider font-semibold mb-1">
          Merchant
        </Text>
        <Text className="font-rye text-foreground text-2xl">
          {selectedTx?.merchant}
        </Text>
        <Text className="text-muted-foreground text-sm mt-1">
          {selectedTx?.date}
        </Text>
      </View>

      <View className="bg-background rounded-xl border border-border p-4 gap-2">
        <Text className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">
          Raw SMS Data
        </Text>
        <Text className="text-foreground text-sm font-mono opacity-80 leading-5">
          Paid KES {selectedTx?.amount.toLocaleString()} to{" "}
          {selectedTx?.merchant} on {selectedTx?.date}. Transaction cost, KES
          15.00.
        </Text>
      </View>
    </>
  );
};
