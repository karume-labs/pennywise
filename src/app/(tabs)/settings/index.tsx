import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import * as FileSystem from "expo-file-system/legacy";
import { useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import {
  ChevronRightIcon,
  DatabaseIcon,
  EyeOffIcon,
  FileDownIcon,
  InfoIcon,
  LockIcon,
  ShieldAlertIcon,
  TrashIcon,
} from "lucide-react-native";
import { useRef, useState } from "react";
import { ScrollView, Switch, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { db } from "@/db/client";
import { categories } from "@/features/categories/schema";
import { transactions } from "@/features/transactions/schema";
import { useSettingsStore } from "@/store/settings";

export default function SettingsScreen() {
  const {
    appLockEnabled,
    setAppLockEnabled,
    privacyModeEnabled,
    setPrivacyModeEnabled,
  } = useSettingsStore();
  const router = useRouter();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [sheetContent, setSheetContent] = useState<{
    title: string;
    message: string;
    type: "wipe" | "alert";
  } | null>(null);

  const showAlert = (title: string, message: string) => {
    setSheetContent({ title, message, type: "alert" });
    bottomSheetModalRef.current?.present();
  };

  const handleBackup = async () => {
    try {
      const dbPath = `${FileSystem.documentDirectory}SQLite/pennywise.db`;
      const fileInfo = await FileSystem.getInfoAsync(dbPath);

      if (!fileInfo.exists) {
        showAlert("Error", "Database file not found");
        return;
      }

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(dbPath, {
          mimeType: "application/x-sqlite3",
          dialogTitle: "Backup Pennywise Database",
        });
      } else {
        showAlert("Error", "Sharing is not available on this device");
      }
    } catch (error) {
      console.error(error);
      showAlert("Error", "Failed to backup database");
    }
  };

  const handleWipeConfirm = () => {
    setSheetContent({
      title: "Wipe All Data?",
      message:
        "This will delete all transactions and categories. Your settings and AI models will be kept. This cannot be undone.",
      type: "wipe",
    });
    bottomSheetModalRef.current?.present();
  };

  const executeWipe = async () => {
    try {
      await db.delete(transactions);
      await db.delete(categories);
      bottomSheetModalRef.current?.dismiss();
      setTimeout(
        () => showAlert("Success", "All financial data has been wiped."),
        500,
      );
    } catch (error) {
      console.error(error);
      bottomSheetModalRef.current?.dismiss();
      setTimeout(() => showAlert("Error", "Failed to wipe data"), 500);
    }
  };

  return (
    <>
      <ScrollView className="flex-1 bg-background">
        <View className="px-4 py-6">
          <Text className="text-muted-foreground font-semibold mb-2 ml-2">
            Security & Privacy
          </Text>
          <View className="bg-card rounded-2xl border border-border overflow-hidden mb-8">
            <View className="flex-row items-center justify-between p-4 border-b border-border/50">
              <View className="flex-row items-center gap-3">
                <View className="bg-primary/10 p-2 rounded-full">
                  <LockIcon size={20} className="text-primary" />
                </View>
                <View>
                  <Text className="text-foreground font-medium">App Lock</Text>
                  <Text className="text-muted-foreground text-xs">
                    Require biometrics on open
                  </Text>
                </View>
              </View>
              <Switch
                value={appLockEnabled}
                onValueChange={setAppLockEnabled}
                trackColor={{ true: "#B5652F", false: "#3A2E22" }}
              />
            </View>

            <View className="flex-row items-center justify-between p-4">
              <View className="flex-row items-center gap-3">
                <View className="bg-primary/10 p-2 rounded-full">
                  <EyeOffIcon size={20} className="text-primary" />
                </View>
                <View>
                  <Text className="text-foreground font-medium">
                    Privacy Mode
                  </Text>
                  <Text className="text-muted-foreground text-xs">
                    Mask balances globally
                  </Text>
                </View>
              </View>
              <Switch
                value={privacyModeEnabled}
                onValueChange={setPrivacyModeEnabled}
                trackColor={{ true: "#B5652F", false: "#3A2E22" }}
              />
            </View>
          </View>

          <Text className="text-muted-foreground font-semibold mb-2 ml-2">
            Data & Backup
          </Text>
          <View className="bg-card rounded-2xl border border-border overflow-hidden mb-8">
            <Button
              variant="ghost"
              className="flex-row items-center justify-between p-4 h-auto border-b border-border/50 rounded-none"
              onPress={handleBackup}
            >
              <View className="flex-row items-center gap-3">
                <View className="bg-primary/10 p-2 rounded-full">
                  <DatabaseIcon size={20} className="text-primary" />
                </View>
                <Text className="text-foreground font-medium">
                  Backup Database
                </Text>
              </View>
              <FileDownIcon size={20} className="text-muted-foreground" />
            </Button>

            <Button
              variant="ghost"
              className="flex-row items-center justify-between p-4 h-auto rounded-none"
              onPress={handleWipeConfirm}
            >
              <View className="flex-row items-center gap-3">
                <View className="bg-destructive/10 p-2 rounded-full">
                  <ShieldAlertIcon size={20} className="text-destructive" />
                </View>
                <Text className="text-destructive font-medium">
                  Wipe All Data
                </Text>
              </View>
              <TrashIcon size={20} className="text-destructive" />
            </Button>
          </View>

          <Text className="text-muted-foreground font-semibold mb-2 ml-2">
            About
          </Text>
          <View className="bg-card rounded-2xl border border-border overflow-hidden mb-8">
            <Button
              variant="ghost"
              className="flex-row items-center justify-between p-4 h-auto rounded-none"
              onPress={() => router.push("/settings/about")}
            >
              <View className="flex-row items-center gap-3">
                <View className="bg-muted p-2 rounded-full">
                  <InfoIcon size={20} className="text-foreground" />
                </View>
                <Text className="text-foreground font-medium">
                  About Pennywise
                </Text>
              </View>
              <ChevronRightIcon size={20} className="text-muted-foreground" />
            </Button>
          </View>
        </View>
      </ScrollView>
      <BottomSheetModal
        ref={bottomSheetModalRef}
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
            {sheetContent?.title}
          </Text>
          <Text className="text-muted-foreground text-base mb-8">
            {sheetContent?.message}
          </Text>
          <View className="flex-row gap-3 justify-end">
            {sheetContent?.type === "wipe" ? (
              <>
                <Button
                  variant="ghost"
                  className="px-6"
                  onPress={() => bottomSheetModalRef.current?.dismiss()}
                >
                  <Text className="text-muted-foreground font-medium">
                    Cancel
                  </Text>
                </Button>
                <Button className="bg-destructive px-6" onPress={executeWipe}>
                  <Text className="text-foreground font-medium">Wipe Data</Text>
                </Button>
              </>
            ) : (
              <Button
                className="bg-primary px-8"
                onPress={() => bottomSheetModalRef.current?.dismiss()}
              >
                <Text className="text-foreground font-medium">OK</Text>
              </Button>
            )}
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
}
