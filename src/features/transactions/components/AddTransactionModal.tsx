import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { ArrowDownIcon } from "lucide-react-native";
import { forwardRef, useState } from "react";
import { Pressable, ScrollView, TextInput, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { db } from "@/db/client";
import { transactions } from "@/db/schema";

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

        <View className="flex-row gap-4 mb-2">
          <Pressable
            onPress={() => setType("EXPENSE")}
            className={`flex-1 py-2 items-center rounded-lg border ${type === "EXPENSE" ? "bg-muted border-muted" : "bg-transparent border-border"}`}
          >
            <Text
              className={
                type === "EXPENSE"
                  ? "text-foreground font-semibold"
                  : "text-muted-foreground"
              }
            >
              Expense
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setType("INCOME")}
            className={`flex-1 py-2 items-center rounded-lg border ${type === "INCOME" ? "bg-emerald-500/20 border-emerald-500/50" : "bg-transparent border-border"}`}
          >
            <Text
              className={
                type === "INCOME"
                  ? "text-emerald-500 font-semibold"
                  : "text-muted-foreground"
              }
            >
              Income
            </Text>
          </Pressable>
        </View>

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

        <View className="gap-2">
          <Text className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">
            Category
          </Text>
          <Pressable
            onPress={() => setIsEditingCategory(!isEditingCategory)}
            className="bg-background border border-border rounded-xl px-4 py-3 flex-row items-center justify-between"
          >
            <Text className="text-foreground font-medium">{category}</Text>
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
                    setCategory(cat);
                    setIsEditingCategory(false);
                  }}
                  className={`px-4 py-3 border-b border-border/50 ${
                    category === cat ? "bg-primary/20" : ""
                  }`}
                >
                  <Text
                    className={`${
                      category === cat
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
