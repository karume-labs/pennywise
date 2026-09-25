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
import { Alert, ScrollView, Switch, View } from "react-native";
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

  const handleBackup = async () => {
    try {
      const dbPath = `${FileSystem.documentDirectory}SQLite/pennywise.db`;
      const fileInfo = await FileSystem.getInfoAsync(dbPath);

      if (!fileInfo.exists) {
        Alert.alert("Error", "Database file not found");
        return;
      }

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(dbPath, {
          mimeType: "application/x-sqlite3",
          dialogTitle: "Backup Pennywise Database",
        });
      } else {
        Alert.alert("Error", "Sharing is not available on this device");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to backup database");
    }
  };

  const handleWipe = () => {
    Alert.alert(
      "Wipe All Data?",
      "This will delete all transactions and categories. Your settings and AI models will be kept. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Wipe",
          style: "destructive",
          onPress: async () => {
            try {
              await db.delete(transactions);
              await db.delete(categories);
              Alert.alert("Success", "All financial data has been wiped.");
            } catch (error) {
              console.error(error);
              Alert.alert("Error", "Failed to wipe data");
            }
          },
        },
      ],
    );
  };

  return (
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
              trackColor={{ true: "#6C391A", false: "#3A3A3C" }}
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
              trackColor={{ true: "#6C391A", false: "#3A3A3C" }}
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
              <View className="bg-blue-500/10 p-2 rounded-full">
                <DatabaseIcon size={20} color="#3b82f6" />
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
            onPress={handleWipe}
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
  );
}
