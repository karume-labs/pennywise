import { useRouter } from "expo-router";
import { MessageSquareIcon } from "lucide-react-native";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";

const PermissionsScreen = () => {
  const router = useRouter();

  const handleGrant = () => {
    // In Phase 4, we will trigger actual permission request here
    router.push("/onboarding/sync");
  };

  return (
    <View className="flex-1 bg-background pt-24 px-6 pb-12">
      <View className="items-center justify-center flex-1">
        <View className="w-24 h-24 bg-primary/20 rounded-full items-center justify-center mb-8">
          <MessageSquareIcon size={48} className="text-primary" />
        </View>
        <Text className="text-foreground text-3xl font-serif text-center mb-4 tracking-tight leading-tight">
          Read SMS Permission
        </Text>
        <Text className="text-muted-foreground text-center text-base leading-6 mb-8">
          Pennywise needs access to your SMS inbox to automatically parse
          transaction alerts from your bank or mobile money provider.
        </Text>

        <Card className="w-full">
          <Text className="text-foreground font-semibold mb-2">
            Why we need this:
          </Text>
          <Text className="text-muted-foreground text-sm leading-5">
            1. To identify incoming financial texts.{"\n"}
            2. To extract amounts, dates, and merchants.{"\n"}
            3. All parsing is done locally on your phone.
          </Text>
        </Card>
      </View>

      <View className="gap-3 w-full">
        <Button
          className="w-full bg-primary h-14 rounded-full shadow-lg"
          onPress={handleGrant}
        >
          <Text className="text-primary-foreground font-semibold text-lg">
            Grant Permission
          </Text>
        </Button>
        <Button
          variant="ghost"
          className="w-full h-14 rounded-full"
          onPress={handleGrant}
        >
          <Text className="text-muted-foreground font-medium">
            Skip for now
          </Text>
        </Button>
      </View>
    </View>
  );
};

export default PermissionsScreen;
