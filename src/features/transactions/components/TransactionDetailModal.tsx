import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { eq } from "drizzle-orm";
import { forwardRef, useEffect, useState } from "react";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { db } from "@/db/client";
import { customRules, transactions } from "@/db/schema";
import { CategoryPicker } from "@/features/transactions/components/CategoryPicker";
import { TransactionDetailHeader } from "@/features/transactions/components/TransactionDetailHeader";

export type Transaction = {
  id: string;
  merchant: string;
  amount: number;
  type: string;
  category: string;
  date: string;
  aiConfidence: number | null;
};

type Props = {
  selectedTx: Transaction | null;
  createRule: boolean;
  setCreateRule: (value: boolean) => void;
};

export const TransactionDetailModal = forwardRef<BottomSheetModal, Props>(
  ({ selectedTx, createRule, setCreateRule }, ref) => {
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
      if (selectedTx) {
        setSelectedCategory(selectedTx.category);
      }
    }, [selectedTx]);

    const handleUpdate = async () => {
      if (isSaving || !selectedTx) return;
      setIsSaving(true);

      try {
        // Update transaction category
        await db
          .update(transactions)
          .set({
            category: selectedCategory,
            aiConfidence: 1.0, // Manual override sets high confidence
          })
          .where(eq(transactions.id, selectedTx.id));

        // Create rule if checked
        if (createRule) {
          // Insert or ignore / replace logic. For simple SQLite:
          await db.insert(customRules).values({
            id: `rule_${Date.now()}`,
            merchantPattern: selectedTx.merchant.toLowerCase(),
            assignedCategory: selectedCategory,
          });
        }

        if (ref && typeof ref !== "function" && ref.current) {
          ref.current.dismiss();
        }
      } finally {
        setIsSaving(false);
      }
    };

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

    return (
      <BottomSheetModal
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        // The sheet's own pan gesture otherwise wins over the nested option
        // list (CategoryPicker) and drags the sheet instead of scrolling it.
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
        <BottomSheetView className="p-6 pb-12 gap-6">
          <TransactionDetailHeader selectedTx={selectedTx} />

          <CategoryPicker
            selectedTx={selectedTx}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={categories}
          />

          <Card className="flex-row items-center justify-between px-4 mt-2">
            <View className="flex-1 pr-4">
              <Text className="text-foreground font-medium">
                Create custom rule
              </Text>
              <Text className="text-muted-foreground text-xs mt-1">
                Always categorize {selectedTx?.merchant} as{" "}
                {selectedTx?.category}
              </Text>
            </View>
            <Switch checked={createRule} onCheckedChange={setCreateRule} />
          </Card>

          <Button
            className="bg-primary w-full mt-2"
            onPress={handleUpdate}
            disabled={isSaving || !selectedTx}
          >
            <Text className="text-primary-foreground font-medium">
              {isSaving ? "Updating..." : "Update Transaction"}
            </Text>
          </Button>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

TransactionDetailModal.displayName = "TransactionDetailModal";
