import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { forwardRef, useState } from "react";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { db } from "@/db/client";
import { budgets } from "@/db/schema";
import { CategoryPicker } from "@/features/transactions/components/CategoryPicker";

export const AddBudgetModal = forwardRef<BottomSheetModal>((_, ref) => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("General");
  const [isSaving, setIsSaving] = useState(false);

  const categories = [
    "Groceries",
    "Transport",
    "Utilities",
    "Dining",
    "Shopping",
    "Entertainment",
    "Healthcare",
    "General",
  ];

  const handleSave = async () => {
    if (isSaving || !amount) return;
    setIsSaving(true);

    try {
      await db
        .insert(budgets)
        .values({
          id: `budget_${Date.now()}`,
          category: category,
          amountLimit: parseFloat(amount) || 0,
          alertThreshold: 0.8,
        })
        .onConflictDoUpdate({
          target: budgets.category,
          set: { amountLimit: parseFloat(amount) || 0 },
        });

      setAmount("");
      setCategory("General");

      if (ref && typeof ref !== "function" && ref.current) {
        ref.current.dismiss();
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <BottomSheetModal
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      // The sheet's own pan gesture otherwise wins over the nested option
      // lists (CategoryPicker) and drags the sheet instead of scrolling them.
      enableContentPanningGesture={false}
      ref={ref}
      enableDynamicSizing={true}
      backgroundStyle={{ backgroundColor: "#2A2724" }}
      handleIndicatorStyle={{ backgroundColor: "#3A2E22" }}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          opacity={0.5}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
        />
      )}
    >
      <BottomSheetView className="p-6 pb-12 gap-4">
        <Text className="font-rye text-foreground text-2xl mb-2">
          Set Monthly Budget
        </Text>

        <View className="gap-2">
          <Text className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">
            Monthly Limit
          </Text>
          <BottomSheetTextInput
            placeholder="KES 0.00"
            placeholderTextColor="#A69C8D"
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
            className="bg-background text-foreground border border-border rounded-xl px-4 py-3 font-medium"
          />
        </View>

        <CategoryPicker
          selectedTx={null}
          selectedCategory={category}
          setSelectedCategory={setCategory}
          categories={categories}
        />

        <Button
          className="bg-primary w-full mt-4"
          onPress={handleSave}
          disabled={isSaving || !amount}
        >
          <Text className="text-primary-foreground font-medium">
            {isSaving ? "Saving..." : "Save Budget"}
          </Text>
        </Button>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

AddBudgetModal.displayName = "AddBudgetModal";
