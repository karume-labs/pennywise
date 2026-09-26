import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";

type Props = {
  type: "EXPENSE" | "INCOME";
  setType: (type: "EXPENSE" | "INCOME") => void;
};

export const TransactionTypeToggle = ({ type, setType }: Props) => {
  return (
    <View className="flex-row gap-4 mb-2">
      <Pressable
        onPress={() => setType("EXPENSE")}
        className={`flex-1 py-2 items-center rounded-lg border ${
          type === "EXPENSE"
            ? "bg-muted border-muted"
            : "bg-transparent border-border"
        }`}
      >
        <Text
          className={
            type === "EXPENSE"
              ? "text-foreground font-semibold"
              : "text-muted-foreground"
          }
        >
          Expense
        </Text>
      </Pressable>
      <Pressable
        onPress={() => setType("INCOME")}
        className={`flex-1 py-2 items-center rounded-lg border ${
          type === "INCOME"
            ? "bg-emerald-500/20 border-emerald-500/50"
            : "bg-transparent border-border"
        }`}
      >
        <Text
          className={
            type === "INCOME"
              ? "text-emerald-500 font-semibold"
              : "text-muted-foreground"
          }
        >
          Income
        </Text>
      </Pressable>
    </View>
  );
};
