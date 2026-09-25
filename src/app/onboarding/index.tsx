import { useRouter } from "expo-router";
import { ShieldCheckIcon, WalletIcon } from "lucide-react-native";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background pt-24 px-6 pb-12">
      <View className="items-center justify-center flex-1">
        <View className="w-24 h-24 bg-primary/20 rounded-full items-center justify-center mb-8">
          <WalletIcon size={48} className="text-primary" />
        </View>
        <Text className="text-foreground text-4xl font-serif text-center mb-4 tracking-tight leading-tight">
          Welcome to Pennywise
        </Text>
        <Text className="text-muted-foreground text-center text-lg leading-6 mb-12">
          Your intelligent, automated expense tracker.
        </Text>

        <View className="bg-card border border-border p-5 rounded-2xl gap-3 w-full">
          <View className="flex-row items-start gap-3">
            <ShieldCheckIcon size={24} className="text-emerald-500 mt-0.5" />
            <View className="flex-1">
              <Text className="text-foreground font-semibold mb-1">
                100% Local & Private
              </Text>
              <Text className="text-muted-foreground text-sm">
                No cloud servers. Your financial data and AI models never leave
                your device.
              </Text>
            </View>
          </View>
        </View>
      </View>

      <Button
        className="w-full bg-primary h-14 rounded-full shadow-lg"
        onPress={() => router.push("/onboarding/permissions")}
      >
        <Text className="text-primary-foreground font-semibold text-lg">
          Get Started
        </Text>
      </Button>
    </View>
  );
}
