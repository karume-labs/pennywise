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
import { subscriptions } from "@/db/schema";
import { FrequencyPicker } from "@/features/transactions/components/FrequencyPicker";

export const AddSubscriptionModal = forwardRef<BottomSheetModal>((_, ref) => {
  const [amount, setAmount] = useState("");
  const [merchant, setMerchant] = useState("");
  const [frequency, setFrequency] = useState("monthly");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (isSaving || !amount || !merchant) return;
    setIsSaving(true);

    try {
      await db.insert(subscriptions).values({
        id: `sub_${Date.now()}`,
        merchant: merchant,
        amount: parseFloat(amount) || 0,
        frequency: frequency,
        status: "active",
      });

      setAmount("");
      setMerchant("");
      setFrequency("monthly");

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
      // The sheet's own pan gesture otherwise wins over the nested frequency
      // list and drags the sheet instead of scrolling it.
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
          Add Subscription
        </Text>

        <View className="gap-2">
          <Text className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">
            Merchant / Service
          </Text>
          <BottomSheetTextInput
            placeholder="E.g., Netflix"
            placeholderTextColor="#A69C8D"
            value={merchant}
            onChangeText={setMerchant}
            className="bg-background text-foreground border border-border rounded-xl px-4 py-3 font-medium"
          />
        </View>

        <View className="gap-2">
          <Text className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">
            Amount
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

        <FrequencyPicker frequency={frequency} setFrequency={setFrequency} />

        <Button
          className="bg-primary w-full mt-4"
          onPress={handleSave}
          disabled={isSaving || !amount || !merchant}
        >
          <Text className="text-primary-foreground font-medium">
            {isSaving ? "Saving..." : "Save Subscription"}
          </Text>
        </Button>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

AddSubscriptionModal.displayName = "AddSubscriptionModal";
