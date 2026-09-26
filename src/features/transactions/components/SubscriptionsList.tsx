import { PlusIcon, Wand2Icon } from "lucide-react-native";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { AlertDialogNotice } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import type { subscriptions } from "@/db/schema";
import { SubscriptionsCard } from "@/features/transactions/components/SubscriptionsCard";
import { autoDetectSubscriptions } from "@/features/transactions/services/subscription-service";

type Subscription = typeof subscriptions.$inferSelect;

type Props = {
  subscriptions: Subscription[] | undefined;
  isLoading: boolean;
  formatCurrency: (amount: number) => string;
  onAdd: () => void;
};

export const SubscriptionsList = ({
  subscriptions,
  isLoading,
  formatCurrency,
  onAdd,
}: Props) => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [notice, setNotice] = useState<{
    title: string;
    description: string;
  } | null>(null);

  const totalMonthly = (subscriptions || []).reduce(
    (sum, sub) => sum + sub.amount,
    0,
  );

  const handleAutoDetect = async () => {
    if (isDetecting) return;
    setIsDetecting(true);
    try {
      const added = await autoDetectSubscriptions();
      if (added > 0) {
        setNotice({
          title: "Auto-Detect Complete",
          description: `Found and added ${added} recurring subscriptions!`,
        });
      } else {
        setNotice({
          title: "Auto-Detect",
          description: "No new recurring patterns found in your transactions.",
        });
      }
    } catch (e) {
      console.error(e);
      setNotice({
        title: "Error",
        description: "Failed to auto-detect subscriptions.",
      });
    } finally {
      setIsDetecting(false);
    }
  };

  return (
    <View className="mt-8">
      <View className="flex-row justify-between items-center mb-4 ml-2 mr-2">
        <View className="flex-row items-end gap-2">
          <Text className="text-muted-foreground font-semibold">
            Active Subscriptions
          </Text>
          {isLoading ? (
            <Skeleton className="h-3 w-20 rounded" />
          ) : (
            <Text className="text-muted-foreground text-xs font-mono">
              {formatCurrency(totalMonthly)} / mo
            </Text>
          )}
        </View>
        <View className="flex-row items-center gap-2">
          <Pressable
            onPress={handleAutoDetect}
            disabled={isDetecting}
            accessibilityRole="button"
            accessibilityLabel="Auto-detect subscriptions"
            accessibilityState={{ disabled: isDetecting }}
            className={`mr-2 ${isDetecting ? "opacity-50" : ""}`}
          >
            <Wand2Icon size={20} className="text-primary" />
          </Pressable>
          <Pressable
            onPress={onAdd}
            accessibilityRole="button"
            accessibilityLabel="Add subscription"
          >
            <PlusIcon size={20} className="text-primary" />
          </Pressable>
        </View>
      </View>
      <SubscriptionsCard
        subscriptions={subscriptions}
        isLoading={isLoading}
        formatCurrency={formatCurrency}
      />

      <AlertDialogNotice
        open={notice !== null}
        onOpenChange={(open) => {
          if (!open) {
            setNotice(null);
          }
        }}
        title={notice?.title ?? ""}
        description={notice?.description ?? ""}
      />
    </View>
  );
};
