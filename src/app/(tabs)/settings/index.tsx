import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import * as FileSystem from "expo-file-system/legacy";
import { type Href, useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import {
  ChevronRightIcon,
  DatabaseIcon,
  EyeOffIcon,
  FileDownIcon,
  FileSpreadsheetIcon,
  InfoIcon,
  LockIcon,
  ShieldAlertIcon,
  SlidersIcon,
  TrashIcon,
} from "lucide-react-native";
import { useRef, useState } from "react";
import { ScrollView, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { db } from "@/db/client";
import { transactions } from "@/db/schema";
import { categories } from "@/features/categories/schema";
import {
  SettingsSheet,
  type SheetContent,
} from "@/features/settings/components/SettingsSheet";
import { useSettingsStore } from "@/features/settings/store";

const SettingsScreen = () => {
  const {
    appLockEnabled,
    setAppLockEnabled,
    privacyModeEnabled,
    setPrivacyModeEnabled,
  } = useSettingsStore();
  const router = useRouter();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [pendingAction, setPendingAction] = useState<
    "backup" | "export" | "wipe" | null
  >(null);
  const [sheetContent, setSheetContent] = useState<SheetContent | null>(null);

  const showAlert = (title: string, message: string) => {
    setSheetContent({ title, message, type: "alert" });
    bottomSheetModalRef.current?.present();
  };

  const handleBackup = async () => {
    if (pendingAction) return;
    setPendingAction("backup");
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
    } finally {
      setPendingAction(null);
    }
  };

  const handleExportCSV = async () => {
    if (pendingAction) return;
    setPendingAction("export");
    try {
      const txs = await db.select().from(transactions);
      if (txs.length === 0) {
        showAlert("No Data", "There are no transactions to export.");
        return;
      }

      const header = "Date,Merchant,Amount,Type,Category,Fee\n";
      const rows = txs
        .map((tx) => {
          const merchant = `"${tx.merchantOrSender?.replace(/"/g, '""') || ""}"`;
          const category = `"${tx.category || ""}"`;
          return `${new Date(tx.date).toISOString().split("T")[0]},${merchant},${tx.amount},${tx.type},${category},${tx.transactionFee || 0}`;
        })
        .join("\n");

      const fileUri = `${FileSystem.documentDirectory}transactions_export.csv`;
      await FileSystem.writeAsStringAsync(fileUri, header + rows, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: "text/csv",
          dialogTitle: "Export Transactions CSV",
        });
      } else {
        showAlert("Error", "Sharing is not available on this device");
      }
    } catch (error) {
      console.error(error);
      showAlert("Error", "Failed to export CSV");
    } finally {
      setPendingAction(null);
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
    if (pendingAction) return;
    setPendingAction("wipe");
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
    } finally {
      setPendingAction(null);
    }
  };

  return (
    <>
      <ScrollView className="flex-1 bg-background">
        <View className="px-4 py-6">
          <Text className="text-muted-foreground font-semibold mb-2 ml-2">
            Security & Privacy
          </Text>
          <Card className="overflow-hidden mb-8">
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
                checked={appLockEnabled}
                onCheckedChange={setAppLockEnabled}
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
                checked={privacyModeEnabled}
                onCheckedChange={setPrivacyModeEnabled}
              />
            </View>

            <Button
              variant="ghost"
              className="flex-row items-center justify-between p-4 h-auto border-t border-border/50 rounded-none"
              onPress={() => router.push("/settings/rules" as Href)}
            >
              <View className="flex-row items-center gap-3">
                <View className="bg-primary/10 p-2 rounded-full">
                  <SlidersIcon size={20} className="text-primary" />
                </View>
                <View>
                  <Text className="text-foreground font-medium">
                    Custom Rules
                  </Text>
                  <Text className="text-muted-foreground text-xs">
                    Override AI categorization
                  </Text>
                </View>
              </View>
              <ChevronRightIcon size={20} className="text-muted-foreground" />
            </Button>
          </Card>

          <Text className="text-muted-foreground font-semibold mb-2 ml-2">
            Data & Backup
          </Text>
          <Card className="overflow-hidden mb-8">
            <Button
              variant="ghost"
              className="flex-row items-center justify-between p-4 h-auto border-b border-border/50 rounded-none"
              onPress={handleExportCSV}
              disabled={pendingAction !== null}
            >
              <View className="flex-row items-center gap-3">
                <View className="bg-primary/10 p-2 rounded-full">
                  <FileSpreadsheetIcon size={20} className="text-primary" />
                </View>
                <Text className="text-foreground font-medium">Export CSV</Text>
              </View>
              <FileDownIcon size={20} className="text-muted-foreground" />
            </Button>

            <Button
              variant="ghost"
              className="flex-row items-center justify-between p-4 h-auto border-b border-border/50 rounded-none"
              onPress={handleBackup}
              disabled={pendingAction !== null}
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
              disabled={pendingAction !== null}
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
          </Card>

          <Text className="text-muted-foreground font-semibold mb-2 ml-2">
            About
          </Text>
          <Card className="overflow-hidden mb-8">
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
          </Card>
        </View>
      </ScrollView>
      <SettingsSheet
        sheetRef={bottomSheetModalRef}
        content={sheetContent}
        isWiping={pendingAction === "wipe"}
        onConfirmWipe={executeWipe}
      />
    </>
  );
};

export default SettingsScreen;
