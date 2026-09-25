import {
  BriefcaseIcon,
  ChevronRightIcon,
  CodeIcon,
  GitBranchIcon,
  GlobeIcon,
  HandCoinsIcon,
  MessageCircleIcon,
  ShieldCheckIcon,
} from "lucide-react-native";
import { Linking, ScrollView, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

const PORTFOLIO_URL = "https://karume.vercel.app";
const GITHUB_URL = "https://github.com/Karume-lab";
const LINKEDIN_URL = "https://linkedin.com/in/daniel-karume";
const TWITTER_URL = "https://twitter.com/karume_lab";

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
          Version 1.0.0
        </Text>

        <Text className="text-xs font-semibold text-muted-foreground mb-4 w-full uppercase tracking-wider ml-2">
          About the App
        </Text>
        <View className="bg-card border border-border/50 rounded-2xl p-5 mb-6 w-full">
          <Text className="text-sm text-muted-foreground leading-6">
            Pennywise is a privacy-first AI financial assistant that analyzes
            your SMS transaction messages entirely on-device, categorizing your
            spending without your data ever leaving your phone.
          </Text>
        </View>

        <Text className="text-xs font-semibold text-muted-foreground mb-4 w-full uppercase tracking-wider ml-2">
          Legal & Privacy
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

        <Text className="text-xs font-semibold text-muted-foreground mb-4 mt-2 w-full uppercase tracking-wider ml-2">
          Developer
        </Text>
        <View className="bg-card border border-border/50 rounded-2xl p-5 mb-6 w-full">
          <Text className="text-sm text-muted-foreground leading-6">
            Powered by{" "}
            <Text className="line-through">coffee and sleepless nights</Text>{" "}
            <Text className="underline">karume-lab.</Text>
          </Text>
        </View>

        <Text className="text-xs font-semibold text-muted-foreground mb-4 w-full uppercase tracking-wider ml-2">
          Links
        </Text>
        <View className="bg-card rounded-2xl border border-border w-full overflow-hidden">
          <Button
            variant="ghost"
            className="flex-row items-center justify-between p-4 h-auto border-b border-border/50 rounded-none"
            onPress={() => Linking.openURL(PORTFOLIO_URL)}
          >
            <View className="flex-row items-center gap-3">
              <View className="bg-primary/10 p-2 rounded-xl">
                <GlobeIcon size={24} className="text-primary" />
              </View>
              <View>
                <Text className="text-base font-semibold text-foreground">
                  Portfolio
                </Text>
                <Text className="text-xs text-muted-foreground">
                  karume.vercel.app
                </Text>
              </View>
            </View>
            <ChevronRightIcon size={20} className="text-muted-foreground" />
          </Button>

          <Button
            variant="ghost"
            className="flex-row items-center justify-between p-4 h-auto border-b border-border/50 rounded-none"
            onPress={() => Linking.openURL(GITHUB_URL)}
          >
            <View className="flex-row items-center gap-3">
              <View className="bg-foreground/10 p-2 rounded-xl">
                <GitBranchIcon size={24} className="text-foreground" />
              </View>
              <View>
                <Text className="text-base font-semibold text-foreground">
                  GitHub
                </Text>
                <Text className="text-xs text-muted-foreground">
                  @Karume-lab
                </Text>
              </View>
            </View>
            <ChevronRightIcon size={20} className="text-muted-foreground" />
          </Button>

          <Button
            variant="ghost"
            className="flex-row items-center justify-between p-4 h-auto border-b border-border/50 rounded-none"
            onPress={() => Linking.openURL(LINKEDIN_URL)}
          >
            <View className="flex-row items-center gap-3">
              <View className="bg-blue-500/10 p-2 rounded-xl">
                <BriefcaseIcon size={24} color="#3b82f6" />
              </View>
              <View>
                <Text className="text-base font-semibold text-foreground">
                  LinkedIn
                </Text>
                <Text className="text-xs text-muted-foreground">
                  Daniel Karume
                </Text>
              </View>
            </View>
            <ChevronRightIcon size={20} className="text-muted-foreground" />
          </Button>

          <Button
            variant="ghost"
            className="flex-row items-center justify-between p-4 h-auto rounded-none"
            onPress={() => Linking.openURL(TWITTER_URL)}
          >
            <View className="flex-row items-center gap-3">
              <View className="bg-sky-500/10 p-2 rounded-xl">
                <MessageCircleIcon size={24} color="#0ea5e9" />
              </View>
              <View>
                <Text className="text-base font-semibold text-foreground">
                  Twitter / X
                </Text>
                <Text className="text-xs text-muted-foreground">
                  @karume_lab
                </Text>
              </View>
            </View>
            <ChevronRightIcon size={20} className="text-muted-foreground" />
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}
