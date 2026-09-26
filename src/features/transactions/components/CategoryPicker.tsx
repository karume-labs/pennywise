import { ArrowDownIcon } from "lucide-react-native";
import { Pressable, ScrollView, View } from "react-native";
import { Text } from "@/components/ui/text";
import type { Transaction } from "./TransactionDetailModal";

type Props = {
  selectedTx: Transaction | null;
  selectedCategory: string;
  isEditingCategory: boolean;
  setIsEditingCategory: (value: boolean) => void;
  setSelectedCategory: (value: string) => void;
  categories: string[];
};

export const CategoryPicker = ({
  selectedTx,
  selectedCategory,
  isEditingCategory,
  setIsEditingCategory,
  setSelectedCategory,
  categories,
}: Props) => {
  return (
    <View className="gap-2">
      <Text className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">
        Assigned Category
      </Text>
      <Pressable
        onPress={() => setIsEditingCategory(!isEditingCategory)}
        className="bg-background border border-border rounded-xl px-4 py-3 flex-row items-center justify-between"
      >
        <View className="flex-row items-center gap-2">
          <Text className="text-foreground font-medium">
            {selectedCategory}
          </Text>
          {selectedTx?.aiConfidence != null &&
            selectedTx.aiConfidence < 0.5 &&
            selectedCategory === selectedTx.category && (
              <View className="bg-amber-500/20 px-1.5 py-0.5 rounded">
                <Text className="text-amber-500 text-[10px] font-bold">
                  LOW CONFIDENCE
                </Text>
              </View>
            )}
        </View>
        <ArrowDownIcon size={16} className="text-muted-foreground" />
      </Pressable>

      {isEditingCategory && (
        <ScrollView
          className="max-h-40 bg-card rounded-xl border border-border mt-1"
          nestedScrollEnabled={true}
        >
          {categories.map((cat) => (
            <Pressable
              key={cat}
              onPress={() => {
                setSelectedCategory(cat);
                setIsEditingCategory(false);
              }}
              className={`px-4 py-3 border-b border-border/50 ${
                selectedCategory === cat ? "bg-primary/20" : ""
              }`}
            >
              <Text
                className={`${
                  selectedCategory === cat
                    ? "text-primary font-bold"
                    : "text-foreground font-medium"
                }`}
              >
                {cat}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
};
