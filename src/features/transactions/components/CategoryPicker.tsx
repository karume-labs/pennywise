import * as SelectPrimitive from "@rn-primitives/select";
import { ArrowDownIcon } from "lucide-react-native";
import { useMemo } from "react";
import { ScrollView, View } from "react-native";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import type { Transaction } from "./TransactionDetailModal";

type Props = {
  selectedTx: Transaction | null;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  categories: string[];
};

export const CategoryPicker = ({
  selectedTx,
  selectedCategory,
  setSelectedCategory,
  categories,
}: Props) => {
  // Root takes an {value,label} Option, so this must be referentially stable or
  // every render looks like a selection change.
  const selected = useMemo(
    () => ({ value: selectedCategory, label: selectedCategory }),
    [selectedCategory],
  );

  const showLowConfidence =
    selectedTx?.aiConfidence != null &&
    selectedTx.aiConfidence < 0.5 &&
    selectedCategory === selectedTx.category;

  return (
    <View className="gap-2">
      <Text className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">
        Assigned Category
      </Text>

      <SelectPrimitive.Root
        // Remount per transaction so the list resets closed, replacing the
        // isEditingCategory state this component used to own.
        key={selectedTx?.id}
        value={selected}
        onValueChange={(option) => {
          if (option?.value) {
            setSelectedCategory(option.value);
          }
        }}
      >
        <SelectPrimitive.Trigger className="bg-background border border-border rounded-xl px-4 py-3 flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <SelectPrimitive.Value
              placeholder={selectedCategory}
              className="text-foreground font-medium"
            />
            {showLowConfidence && (
              <View className="bg-amber-500/20 px-1.5 py-0.5 rounded">
                <Text className="text-amber-500 text-[10px] font-bold">
                  LOW CONFIDENCE
                </Text>
              </View>
            )}
          </View>
          <ArrowDownIcon size={16} className="text-muted-foreground" />
        </SelectPrimitive.Trigger>

        {/* Rendered inline (no Portal + disablePositioningStyle) because this
            lives inside a BottomSheetModal, which is its own native window on
            Android. A portalled Select would render behind the sheet. */}
        <SelectPrimitive.Content
          disablePositioningStyle={true}
          className="max-h-40 bg-card rounded-xl border border-border mt-1"
        >
          <ScrollView nestedScrollEnabled={true}>
            {categories.map((cat) => (
              <SelectPrimitive.Item
                key={cat}
                value={cat}
                label={cat}
                className={cn(
                  "px-4 py-3 border-b border-border/50",
                  selectedCategory === cat && "bg-primary/20",
                )}
              >
                <SelectPrimitive.ItemText
                  className={cn(
                    selectedCategory === cat
                      ? "text-primary font-bold"
                      : "text-foreground font-medium",
                  )}
                />
              </SelectPrimitive.Item>
            ))}
          </ScrollView>
        </SelectPrimitive.Content>
      </SelectPrimitive.Root>
    </View>
  );
};
