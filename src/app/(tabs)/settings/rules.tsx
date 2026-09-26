import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { eq } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { PlusIcon, SlidersIcon, TrashIcon } from "lucide-react-native";
import { useRef } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton, skeletonKeys } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { db } from "@/db/client";
import { customRules } from "@/db/schema";
import { AddRuleModal } from "@/features/transactions/components/AddRuleModal";
import { allRulesQuery } from "@/features/transactions/queries";

const SKELETON_ROW_COUNT = 3;

const RulesScreen = () => {
  const { data: rules } = useLiveQuery(allRulesQuery);
  const addRuleModalRef = useRef<BottomSheetModal>(null);

  const isLoading = rules === undefined;

  const deleteRule = async (id: string) => {
    await db.delete(customRules).where(eq(customRules.id, id));
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1 px-4 pt-6"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="flex-row justify-between items-center mb-6 ml-2 mr-2">
          <View>
            <Text className="text-muted-foreground font-semibold">
              Custom Rules
            </Text>
            <Text className="text-muted-foreground text-xs mt-1">
              Bypass AI and force categories for specific merchants.
            </Text>
          </View>
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full h-10 w-10 bg-primary/10"
            onPress={() => addRuleModalRef.current?.present()}
          >
            <PlusIcon size={20} className="text-primary" />
          </Button>
        </View>

        <Card className="overflow-hidden">
          {isLoading ? (
            skeletonKeys(SKELETON_ROW_COUNT).map((key) => (
              <View
                key={key}
                className="flex-row items-center justify-between p-4 border-b border-border/50"
              >
                <View className="flex-1 gap-2">
                  <Skeleton className="h-4 w-32 rounded" />
                  <View className="flex-row items-center gap-2">
                    <Skeleton className="h-3 w-20 rounded" />
                    <Skeleton className="h-4 w-16 rounded-full" />
                  </View>
                </View>
                <Skeleton className="h-5 w-5 rounded" />
              </View>
            ))
          ) : rules === undefined || rules.length === 0 ? (
            <View className="p-6 items-center">
              <SlidersIcon
                size={32}
                className="text-muted-foreground mb-3 opacity-50"
              />
              <Text className="text-muted-foreground text-center">
                No rules defined yet.
              </Text>
            </View>
          ) : (
            rules.map((rule, index) => (
              <View
                key={rule.id}
                className={`flex-row items-center justify-between p-4 ${
                  index !== rules.length - 1 ? "border-b border-border/50" : ""
                }`}
              >
                <View className="flex-1">
                  <Text className="text-foreground font-medium mb-1">
                    "{rule.merchantPattern}"
                  </Text>
                  <View className="flex-row items-center">
                    <Text className="text-muted-foreground text-xs mr-2">
                      Always set to:
                    </Text>
                    <View className="bg-primary/20 px-2 py-0.5 rounded-full">
                      <Text className="text-primary text-[10px] font-bold uppercase tracking-wider">
                        {rule.assignedCategory}
                      </Text>
                    </View>
                  </View>
                </View>

                <Pressable
                  className="p-2 ml-4"
                  onPress={() => deleteRule(rule.id)}
                >
                  <TrashIcon size={18} className="text-destructive/80" />
                </Pressable>
              </View>
            ))
          )}
        </Card>
      </ScrollView>

      <AddRuleModal ref={addRuleModalRef} />
    </View>
  );
};

export default RulesScreen;
