import { CodeIcon, HandCoinsIcon, ShieldCheckIcon } from "lucide-react-native";
import { ScrollView, View } from "react-native";
import { Text } from "@/components/ui/text";

export default function AboutScreen() {
  return (
    <ScrollView className="flex-1 bg-background">
      <View className="px-4 py-8 items-center">
        <View className="w-24 h-24 bg-primary/20 rounded-full items-center justify-center mb-6">
          <HandCoinsIcon size={48} className="text-primary" />
        </View>
        <Text className="text-foreground text-3xl font-serif mb-2">
          Pennywise
        </Text>
        <Text className="text-muted-foreground text-center mb-8">
          Version 1.0.0 • Developed by Karume Labs
        </Text>

        <View className="w-full bg-card p-6 rounded-3xl border border-border gap-4">
          <View className="flex-row items-start gap-3">
            <ShieldCheckIcon size={24} className="text-emerald-500 mt-1" />
            <View className="flex-1">
              <Text className="text-foreground font-semibold mb-1">
                Privacy First
              </Text>
              <Text className="text-muted-foreground text-sm">
                Pennywise operates 100% locally. Your financial data and SMS
                records never leave your device.
              </Text>
            </View>
          </View>

          <View className="h-[1px] bg-border/50" />

          <View className="flex-row items-start gap-3">
            <CodeIcon size={24} className="text-primary mt-1" />
            <View className="flex-1">
              <Text className="text-foreground font-semibold mb-1">
                License & Terms
              </Text>
              <Text className="text-muted-foreground text-sm">
                Licensed under CC BY-NC-SA 4.0. Strictly prohibited from being
                used for AI training or commercial distribution.
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
