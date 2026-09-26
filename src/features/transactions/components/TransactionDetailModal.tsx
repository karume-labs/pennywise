import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { ArrowDownIcon } from "lucide-react-native";
import { forwardRef } from "react";
import { Pressable, Switch, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

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
        <BottomSheetView className="p-6 pb-12 gap-6">
          <View>
            <Text className="text-muted-foreground text-xs uppercase tracking-wider font-semibold mb-1">
              Merchant
            </Text>
            <Text className="font-rye text-foreground text-2xl">
              {selectedTx?.merchant}
            </Text>
            <Text className="text-muted-foreground text-sm mt-1">
              {selectedTx?.date}
            </Text>
          </View>

          <View className="bg-background rounded-xl border border-border p-4 gap-2">
            <Text className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">
              Raw SMS Data
            </Text>
            <Text className="text-foreground text-sm font-mono opacity-80 leading-5">
              Paid KES {selectedTx?.amount.toLocaleString()} to{" "}
              {selectedTx?.merchant} on {selectedTx?.date}. Transaction cost,
              KES 15.00.
            </Text>
          </View>

          <View className="gap-2">
            <Text className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">
              Assigned Category
            </Text>
            <Pressable className="bg-background border border-border rounded-xl px-4 py-3 flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <Text className="text-foreground font-medium">
                  {selectedTx?.category}
                </Text>
                {selectedTx?.aiConfidence && selectedTx.aiConfidence < 0.5 && (
                  <View className="bg-amber-500/20 px-1.5 py-0.5 rounded">
                    <Text className="text-amber-500 text-[10px] font-bold">
                      LOW CONFIDENCE
                    </Text>
                  </View>
                )}
              </View>
              <ArrowDownIcon size={16} className="text-muted-foreground" />
            </Pressable>
          </View>

          <View className="flex-row items-center justify-between bg-card rounded-xl p-4 border border-border mt-2">
            <View className="flex-1 pr-4">
              <Text className="text-foreground font-medium">
                Create custom rule
              </Text>
              <Text className="text-muted-foreground text-xs mt-1">
                Always categorize {selectedTx?.merchant} as{" "}
                {selectedTx?.category}
              </Text>
            </View>
            <Switch
              value={createRule}
              onValueChange={setCreateRule}
              trackColor={{ true: "#B5652F", false: "#3A2E22" }}
            />
          </View>

          <Button
            className="bg-primary w-full mt-2"
            onPress={() => {
              if (ref && typeof ref !== "function" && ref.current) {
                ref.current.dismiss();
              }
            }}
          >
            <Text className="text-primary-foreground font-medium">
              Update Transaction
            </Text>
          </Button>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

TransactionDetailModal.displayName = "TransactionDetailModal";
