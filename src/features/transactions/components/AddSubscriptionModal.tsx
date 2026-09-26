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
import { subscriptions } from "@/db/schema";

export const AddSubscriptionModal = forwardRef<BottomSheetModal>((_, ref) => {
  const [amount, setAmount] = useState("");
  const [merchant, setMerchant] = useState("");
  const [frequency, setFrequency] = useState("monthly");
  const [isEditingFreq, setIsEditingFreq] = useState(false);

  const frequencies = ["weekly", "monthly", "yearly"];

  const handleSave = async () => {
    if (!amount || !merchant) return;

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
  };

  return (
    <BottomSheetModal
      keyboardBehavior="extend"
      keyboardBlurBehavior="restore"
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
          <TextInput
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
            Frequency
          </Text>
          <Pressable
            onPress={() => setIsEditingFreq(!isEditingFreq)}
            className="bg-background border border-border rounded-xl px-4 py-3 flex-row items-center justify-between"
          >
            <Text className="text-foreground font-medium capitalize">
              {frequency}
            </Text>
            <ArrowDownIcon size={16} className="text-muted-foreground" />
          </Pressable>

          {isEditingFreq && (
            <ScrollView
              className="max-h-40 bg-card rounded-xl border border-border mt-1"
              nestedScrollEnabled={true}
            >
              {frequencies.map((freq) => (
                <Pressable
                  key={freq}
                  onPress={() => {
                    setFrequency(freq);
                    setIsEditingFreq(false);
                  }}
                  className={`px-4 py-3 border-b border-border/50 ${
                    frequency === freq ? "bg-primary/20" : ""
                  }`}
                >
                  <Text
                    className={`${
                      frequency === freq
                        ? "text-primary font-bold capitalize"
                        : "text-foreground font-medium capitalize"
                    }`}
                  >
                    {freq}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          )}
        </View>

        <Button className="bg-primary w-full mt-4" onPress={handleSave}>
          <Text className="text-primary-foreground font-medium">
            Save Subscription
          </Text>
        </Button>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

AddSubscriptionModal.displayName = "AddSubscriptionModal";
