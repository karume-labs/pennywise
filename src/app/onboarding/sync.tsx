import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { Progress } from "@/components/ui/progress";
import { Skeleton, skeletonKeys } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";

const SyncScreen = () => {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate progress
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
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      setTimeout(() => {
        // Set some hypothetical flag (we will implement a proper one later)
        router.replace("/(tabs)");
      }, 500);
    }
  }, [progress, router]);

  return (
    <View className="flex-1 bg-background px-4 pt-24 pb-12">
      <Text className="text-foreground text-2xl font-serif text-center mb-2 tracking-tight">
        Syncing Messages...
      </Text>
      <Text className="text-muted-foreground text-center text-sm mb-8">
        Reading local SMS inbox and extracting financial records.
      </Text>

      <View className="px-2">
        <Progress value={progress} className="bg-secondary" />
        <Text className="text-primary font-mono text-xs mt-2">{progress}%</Text>

        <View className="mt-10 items-center">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-11 w-48 rounded-lg mt-2" />
        </View>
        <Skeleton className="h-20 w-full rounded-2xl mt-8" />
        <View className="gap-3 mt-6">
          {skeletonKeys(3).map((key) => (
            <Skeleton key={key} className="h-[74px] w-full rounded-2xl" />
          ))}
        </View>
      </View>
    </View>
  );
};

export default SyncScreen;
