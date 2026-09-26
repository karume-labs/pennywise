import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowUpIcon,
  ShoppingCart,
} from "lucide-react-native";
import { Pressable, ScrollView, View } from "react-native";
import { Card } from "@/components/ui/card";
import { Skeleton, skeletonKeys } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { categoryTransactionsQuery } from "@/features/transactions/queries";
import { useFormatCurrency } from "@/shared/hooks/use-format-currency";

const SKELETON_ROW_COUNT = 4;

const RowSkeleton = () => (
  <Card className="flex-row items-center justify-between px-4">
    <View className="flex-row items-center gap-3">
      <Skeleton className="w-10 h-10 rounded-full" />
      <View className="gap-2">
        <Skeleton className="h-4 w-28 rounded" />
        <Skeleton className="h-3 w-20 rounded" />
      </View>
    </View>
    <Skeleton className="h-4 w-20 rounded" />
  </Card>
);

const CategoryDetailScreen = () => {
  const router = useRouter();
  const formatCurrency = useFormatCurrency();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: categoryTxs } = useLiveQuery(
    categoryTransactionsQuery(id || ""),
  );

  const isLoading = categoryTxs === undefined;

  const categoryTotal =
    categoryTxs?.reduce(
      (acc, tx) => acc + (tx.type === "EXPENSE" ? tx.amount : 0),
      0,
    ) || 0;

  return (
    <View className="flex-1 bg-background">
      <View className="px-4 pt-12 pb-4 border-b border-border/50 flex-row items-center gap-4">
        <Pressable
          onPress={() => router.back()}
          className="p-2 -ml-2 rounded-full active:bg-muted"
        >
          <ArrowLeftIcon size={24} className="text-foreground" />
        </Pressable>
        <Text className="text-foreground text-xl font-serif">{id}</Text>
      </View>

      <ScrollView className="flex-1 px-4 pt-6">
        <View className="items-center mb-8">
          <View className="w-16 h-16 rounded-2xl bg-secondary items-center justify-center mb-4">
            <ShoppingCart size={32} color="#6C391A" strokeWidth={1.5} />
          </View>
          <Text className="text-muted-foreground uppercase tracking-widest text-xs font-semibold mb-2">
            Total Spent
          </Text>
          {isLoading ? (
            <Skeleton className="h-11 w-40 rounded-lg" />
          ) : (
            <Text className="text-foreground text-4xl font-serif tracking-tight">
              {formatCurrency(categoryTotal)}
            </Text>
          )}
        </View>

        <Text className="text-foreground text-lg font-serif mb-4">
          Transactions
        </Text>

        <View className="gap-3 pb-12">
          {isLoading &&
            skeletonKeys(SKELETON_ROW_COUNT).map((key) => (
              <RowSkeleton key={key} />
            ))}
          {categoryTxs?.map((tx) => (
            <Card
              key={tx.id}
              className="flex-row items-center justify-between px-4"
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
                  <Text className="text-foreground font-medium">
                    {tx.merchantOrSender}
                  </Text>
                  <Text className="text-muted-foreground text-xs">
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
            </Card>
          ))}
          {!isLoading && categoryTxs?.length === 0 && (
            <View className="p-4 items-center">
              <Text className="text-muted-foreground">
                No transactions for this category
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default CategoryDetailScreen;
