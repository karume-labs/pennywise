import { PlusIcon, RepeatIcon, Wand2Icon } from "lucide-react-native";
import { Alert, Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";
import type { subscriptions } from "@/db/schema";
import { autoDetectSubscriptions } from "@/features/transactions/services/subscription-service";

type Subscription = typeof subscriptions.$inferSelect;

type Props = {
  subscriptions: Subscription[] | undefined;
  formatCurrency: (amount: number) => string;
  onAdd: () => void;
};

export const SubscriptionsList = ({
  subscriptions,
  formatCurrency,
  onAdd,
}: Props) => {
  const totalMonthly = (subscriptions || []).reduce(
    (sum, sub) => sum + sub.amount,
    0,
  );

  const handleAutoDetect = async () => {
    try {
      const added = await autoDetectSubscriptions();
      if (added > 0) {
        Alert.alert(
          "Auto-Detect Complete",
          `Found and added ${added} recurring subscriptions!`,
        );
      } else {
        Alert.alert(
          "Auto-Detect",
          "No new recurring patterns found in your transactions.",
        );
      }
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Failed to auto-detect subscriptions.");
    }
  };

  return (
    <View className="mt-8">
      <View className="flex-row justify-between items-center mb-4 ml-2 mr-2">
        <View className="flex-row items-end gap-2">
          <Text className="text-muted-foreground font-semibold">
            Active Subscriptions
          </Text>
          <Text className="text-muted-foreground text-xs font-mono">
            {formatCurrency(totalMonthly)} / mo
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Pressable onPress={handleAutoDetect} className="mr-2">
            <Wand2Icon size={20} className="text-primary" />
          </Pressable>
          <Pressable onPress={onAdd}>
            <PlusIcon size={20} className="text-primary" />
          </Pressable>
        </View>
      </View>
      <View className="bg-card rounded-2xl border border-border overflow-hidden">
        {!subscriptions || subscriptions.length === 0 ? (
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
      </View>
    </View>
  );
};
