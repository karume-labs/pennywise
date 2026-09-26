import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import {
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetModal as Modal,
} from "@gorhom/bottom-sheet";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

export type SheetContent = {
  title: string;
  message: string;
  type: "wipe" | "alert";
};

type Props = {
  sheetRef: React.RefObject<BottomSheetModal | null>;
  content: SheetContent | null;
  isWiping: boolean;
  onConfirmWipe: () => void;
};

export const SettingsSheet = ({
  sheetRef,
  content,
  isWiping,
  onConfirmWipe,
}: Props) => (
  <Modal
    ref={sheetRef}
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
    <BottomSheetView className="p-6 pb-12">
      <Text className="font-rye text-foreground text-2xl mb-3">
        {content?.title}
      </Text>
      <Text className="text-muted-foreground text-base mb-8">
        {content?.message}
      </Text>
      <View className="flex-row gap-3 justify-end">
        {content?.type === "wipe" ? (
          <>
            <Button
              variant="ghost"
              className="px-6"
              onPress={() => sheetRef.current?.dismiss()}
              disabled={isWiping}
            >
              <Text className="text-muted-foreground font-medium">Cancel</Text>
            </Button>
            <Button
              className="bg-destructive px-6"
              onPress={onConfirmWipe}
              disabled={isWiping}
            >
              <Text className="text-foreground font-medium">Wipe Data</Text>
            </Button>
          </>
        ) : (
          <Button
            className="bg-primary px-8"
            onPress={() => sheetRef.current?.dismiss()}
          >
            <Text className="text-foreground font-medium">OK</Text>
          </Button>
        )}
      </View>
    </BottomSheetView>
  </Modal>
);
