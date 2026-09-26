import {
  AlertCircleIcon,
  ArrowDownIcon,
  ArrowUpIcon,
} from "lucide-react-native";
import { Pressable, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import type { transactions } from "@/db/schema";

type Props = {
  recentTxs: (typeof transactions.$inferSelect)[] | undefined;
  formatCurrency: (
    amount: number,
    currency?: string,
    includeSymbol?: boolean,
  ) => string;
  handleOpenTxModal: (tx: typeof transactions.$inferSelect) => void;
};

export const RecentTransactionsList = ({
  recentTxs,
  formatCurrency,
  handleOpenTxModal,
}: Props) => {
  return (
    <>
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-foreground text-lg font-serif">
          Recent Transactions
        </Text>
        <Button variant="ghost" size="sm">
          <Text className="text-primary">See All</Text>
        </Button>
      </View>

      <View className="gap-3 pb-8">
        {recentTxs?.map((tx) => (
          <Pressable
            key={tx.id}
            onPress={() => handleOpenTxModal(tx)}
            className="flex-row items-center justify-between bg-card p-4 rounded-2xl border border-border active:bg-muted/50"
          >
            <View className="flex-row items-center gap-3">
              <View
                className={`w-10 h-10 rounded-full items-center justify-center ${tx.type === "EXPENSE" ? "bg-muted" : "bg-emerald-500/10"}`}
              >
                {tx.type === "EXPENSE" ? (
                  <ArrowUpIcon size={18} className="text-foreground" />
                ) : (
                  <ArrowDownIcon size={18} color="#10b981" />
                )}
              </View>
              <View>
                <View className="flex-row items-center gap-2">
                  <Text className="text-foreground font-medium">
                    {tx.merchantOrSender}
                  </Text>
                  {tx.aiConfidence !== null && tx.aiConfidence < 0.5 && (
                    <View className="bg-amber-500/20 px-1.5 py-0.5 rounded flex-row items-center gap-1">
                      <AlertCircleIcon size={10} color="#f59e0b" />
                      <Text className="text-amber-500 text-[10px] font-bold">
                        REVIEW
                      </Text>
                    </View>
                  )}
                </View>
                <Text className="text-muted-foreground text-xs">
                  {tx.category ?? "Uncategorized"} •{" "}
                  {new Date(tx.date).toLocaleDateString()}
                </Text>
              </View>
            </View>
            <Text
              className={`font-semibold ${tx.type === "EXPENSE" ? "text-foreground" : "text-emerald-500"}`}
            >
              {formatCurrency(
                tx.type === "EXPENSE" ? -tx.amount : tx.amount,
                "KES",
                true,
              )}
            </Text>
          </Pressable>
        ))}
        {recentTxs?.length === 0 && (
          <View className="p-4 items-center">
            <Text className="text-muted-foreground">
              No recent transactions
            </Text>
          </View>
        )}
      </View>
    </>
  );
};
