import { useRouter } from "expo-router";
import { RefreshCwIcon } from "lucide-react-native";
import { useEffect, useState } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { Text } from "@/components/ui/text";

export default function SyncScreen() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const spinValue = useSharedValue(0);

  useEffect(() => {
    // Spin animation
    spinValue.value = withRepeat(
      withTiming(360, { duration: 2000, easing: Easing.linear }),
      -1,
      false,
    );

    // Mock progress simulation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [
    // Spin animation
    spinValue,
  ]);

  useEffect(() => {
    if (progress >= 100) {
      setTimeout(() => {
        // Set some hypothetical flag (we will implement a proper one later)
        router.replace("/(tabs)");
      }, 500);
    }
  }, [progress, router]);

  const spinStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${spinValue.value}deg` }],
    };
  });

  return (
    <View className="flex-1 bg-background pt-24 px-6 pb-12 items-center justify-center">
      <Animated.View style={spinStyle} className="mb-8">
        <View className="w-20 h-20 bg-primary/20 rounded-full items-center justify-center">
          <RefreshCwIcon size={36} className="text-primary" />
        </View>
      </Animated.View>

      <Text className="text-foreground text-2xl font-serif text-center mb-2 tracking-tight">
        Syncing Messages...
      </Text>
      <Text className="text-muted-foreground text-center text-sm mb-8">
        Reading local SMS inbox and extracting financial records.
      </Text>

      <View className="w-full h-2 bg-secondary rounded-full overflow-hidden">
        <View
          className="h-full bg-primary rounded-full"
          style={{ width: `${progress}%` }}
        />
      </View>
      <Text className="text-primary font-mono text-xs mt-2">{progress}%</Text>
    </View>
  );
}
