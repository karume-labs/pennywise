import { RepeatIcon } from "lucide-react-native";
import { View } from "react-native";
import { Card } from "@/components/ui/card";
import { skeletonKeys } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import type { subscriptions } from "@/db/schema";
import { SubscriptionRowSkeleton } from "@/features/transactions/components/SubscriptionRowSkeleton";

const SKELETON_ROW_COUNT = 3;

type Props = {
  subscriptions: (typeof subscriptions.$inferSelect)[] | undefined;
  isLoading: boolean;
  formatCurrency: (amount: number) => string;
};

export const SubscriptionsCard = ({
  subscriptions,
  isLoading,
  formatCurrency,
}: Props) => {
  return (
    <Card className="overflow-hidden">
      {isLoading ? (
        skeletonKeys(SKELETON_ROW_COUNT).map((key) => (
          <SubscriptionRowSkeleton key={key} />
        ))
      ) : subscriptions === undefined || subscriptions.length === 0 ? (
        <Text className="text-muted-foreground text-center py-4">
          No subscriptions set. Tap + to add one.
        </Text>
      ) : (
        subscriptions.map((sub, index) => (
          <View
            key={sub.id}
            className={`flex-row items-center justify-between p-4 ${
              index !== subscriptions.length - 1
                ? "border-b border-border/50"
                : ""
            }`}
          >
            <View className="flex-row items-center gap-3">
              <View className="bg-primary/10 p-2 rounded-full">
                <RepeatIcon size={16} className="text-primary" />
              </View>
              <View>
                <Text className="text-foreground font-medium">
                  {sub.merchant}
                </Text>
                <Text className="text-muted-foreground text-xs capitalize">
                  {sub.frequency}
                </Text>
              </View>
            </View>
            <Text className="text-foreground font-mono font-medium">
              {formatCurrency(sub.amount)}
            </Text>
          </View>
        ))
      )}
    </Card>
  );
};
