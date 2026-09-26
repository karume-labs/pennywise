import { RefreshCwIcon } from "lucide-react-native";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

type Props = {
  isSyncing: boolean;
  lastSyncDate: number | null;
  performSync: () => void;
};

export const SyncStatusCard = ({
  isSyncing,
  lastSyncDate,
  performSync,
}: Props) => {
  return (
    <View className="flex-row items-center justify-between bg-secondary/50 p-4 rounded-2xl mb-6">
      <View className="flex-row items-center gap-3">
        <View className="bg-primary/10 p-2 rounded-full">
          <RefreshCwIcon
            size={18}
            className={`text-primary ${isSyncing ? "animate-spin" : ""}`}
          />
        </View>
        <View>
          <Text className="text-foreground font-medium">
            {isSyncing ? "Syncing SMS..." : "SMS Sync Active"}
          </Text>
          <Text className="text-muted-foreground text-xs">
            {lastSyncDate
              ? `Last synced ${new Date(lastSyncDate).toLocaleTimeString()}`
              : "Ready"}
          </Text>
        </View>
      </View>
      <Button
        variant="ghost"
        size="sm"
        className="rounded-full"
        onPress={performSync}
        disabled={isSyncing}
      >
        <Text className="text-primary">
          {isSyncing ? "Syncing..." : "Sync"}
        </Text>
      </Button>
    </View>
  );
};
