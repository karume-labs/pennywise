import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { ArrowDownIcon } from "lucide-react-native";
import { forwardRef } from "react";
import { Pressable, TextInput, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

export const AddTransactionModal = forwardRef<BottomSheetModal>((_, ref) => {
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

        <View className="gap-2">
          <Text className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">
            Amount
          </Text>
          <TextInput
            placeholder="KES 0.00"
            placeholderTextColor="#A69C8D"
            keyboardType="decimal-pad"
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
            className="bg-background text-foreground border border-border rounded-xl px-4 py-3 font-medium"
          />
        </View>

        <View className="gap-2">
          <Text className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">
            Category
          </Text>
          <Pressable className="bg-background border border-border rounded-xl px-4 py-3 flex-row items-center justify-between">
            <Text className="text-foreground font-medium">Select Category</Text>
            <ArrowDownIcon size={16} className="text-muted-foreground" />
          </Pressable>
        </View>

        <Button
          className="bg-primary w-full mt-4"
          onPress={() => {
            if (ref && typeof ref !== "function" && ref.current) {
              ref.current.dismiss();
            }
          }}
        >
          <Text className="text-primary-foreground font-medium">
            Save Transaction
          </Text>
        </Button>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

AddTransactionModal.displayName = "AddTransactionModal";
