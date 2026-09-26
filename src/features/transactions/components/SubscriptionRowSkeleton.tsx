import { View } from "react-native";
import { Skeleton } from "@/components/ui/skeleton";

export const SubscriptionRowSkeleton = () => (
  <View className="flex-row items-center justify-between p-4 border-b border-border/50">
    <View className="flex-row items-center gap-3">
      <Skeleton className="w-9 h-9 rounded-full" />
      <View className="gap-2">
        <Skeleton className="h-4 w-28 rounded" />
        <Skeleton className="h-3 w-16 rounded" />
      </View>
    </View>
    <Skeleton className="h-4 w-16 rounded" />
  </View>
);
