import { View } from "react-native";
import { Card } from "@/components/ui/card";
import { Skeleton, skeletonKeys } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";

const SKELETON_ROW_COUNT = 4;

const RowSkeleton = () => (
  <View className="px-4 py-4 flex-row items-center gap-4">
    <Skeleton className="w-11 h-11 rounded-xl" />
    <View className="flex-1 gap-2">
      <Skeleton className="h-4 w-28 rounded" />
      <Skeleton className="h-1.5 w-full rounded-full" />
    </View>
    <View className="items-end gap-2">
      <Skeleton className="h-4 w-20 rounded" />
      <Skeleton className="h-3 w-16 rounded" />
    </View>
  </View>
);

export const TopCategoriesListSkeleton = () => (
  <>
    <View className="flex-row items-baseline justify-between mb-4">
      <Text className="text-foreground text-lg font-serif">Top Categories</Text>
      <Text className="text-muted-foreground text-xs uppercase tracking-widest">
        This Month
      </Text>
    </View>
    <Card className="overflow-hidden">
      {skeletonKeys(SKELETON_ROW_COUNT).map((key) => (
        <RowSkeleton key={key} />
      ))}
    </Card>
  </>
);
