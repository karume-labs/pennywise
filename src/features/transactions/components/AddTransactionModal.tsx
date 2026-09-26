import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { forwardRef, useState } from "react";
import { TextInput, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { db } from "@/db/client";
import { transactions } from "@/db/schema";
import { CategoryPicker } from "@/features/transactions/components/CategoryPicker";
import { TransactionTypeToggle } from "@/features/transactions/components/TransactionTypeToggle";

export const AddTransactionModal = forwardRef<BottomSheetModal>((_, ref) => {
  const [amount, setAmount] = useState("");
  const [merchant, setMerchant] = useState("");
  const [category, setCategory] = useState("General");
  const [type, setType] = useState<"EXPENSE" | "INCOME">("EXPENSE");
  const [isEditingCategory, setIsEditingCategory] = useState(false);

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
    if (!amount || !merchant) return;

    await db.insert(transactions).values({
      id: `manual_${Date.now()}`,
      merchantOrSender: merchant,
      amount: parseFloat(amount) || 0,
      type: type,
      category: category,
      date: new Date(),
      transactionFee: 0,
      aiConfidence: 1.0, // Manual entries have 100% confidence
      rawSms: "Manual Entry",
    });

    setAmount("");
    setMerchant("");
    setCategory("General");
    setType("EXPENSE");

    if (ref && typeof ref !== "function" && ref.current) {
      ref.current.dismiss();
    }
  };

  return (
    <BottomSheetModal
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
          Add Transaction
        </Text>

        <TransactionTypeToggle type={type} setType={setType} />

        <View className="gap-2">
          <Text className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">
            Amount
          </Text>
          <TextInput
            placeholder="KES 0.00"
            placeholderTextColor="#A69C8D"
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
            className="bg-background text-foreground border border-border rounded-xl px-4 py-3 font-medium"
          />
        </View>

        <View className="gap-2">
          <Text className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">
            Merchant / Description
          </Text>
          <TextInput
            placeholder="E.g., Java House"
            placeholderTextColor="#A69C8D"
            value={merchant}
            onChangeText={setMerchant}
            className="bg-background text-foreground border border-border rounded-xl px-4 py-3 font-medium"
          />
        </View>

        <CategoryPicker
          selectedTx={null}
          selectedCategory={category}
          isEditingCategory={isEditingCategory}
          setIsEditingCategory={setIsEditingCategory}
          setSelectedCategory={setCategory}
          categories={categories}
        />

        <Button className="bg-primary w-full mt-4" onPress={handleSave}>
          <Text className="text-primary-foreground font-medium">
            Save Transaction
          </Text>
        </Button>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

AddTransactionModal.displayName = "AddTransactionModal";
