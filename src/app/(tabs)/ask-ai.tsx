import { BotIcon, SendIcon, SparklesIcon } from "lucide-react-native";
import { SafeAreaView, ScrollView, TextInput, View } from "react-native";
import { useUniwind } from "uniwind";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

export default function AskAIScreen() {
  const { theme } = useUniwind();
  const isDark = theme === "dark";

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-4 pt-6 pb-4">
        <View className="flex-row items-center gap-2 mb-6">
          <SparklesIcon size={24} className="text-primary" />
          <Text className="text-foreground text-2xl font-serif">Ask AI</Text>
        </View>

        <ScrollView
          className="flex-1 mb-4"
          showsVerticalScrollIndicator={false}
        >
          {/* Mock Chat */}
          <View className="gap-4">
            <View className="bg-secondary p-4 rounded-2xl rounded-tl-sm self-start max-w-[85%]">
              <Text className="text-foreground">
                Hello! I'm your local AI financial assistant. I run 100% on your
                device.
              </Text>
            </View>

            <View className="bg-primary p-4 rounded-2xl rounded-tr-sm self-end max-w-[85%]">
              <Text className="text-primary-foreground">
                How much did I spend on food this week?
              </Text>
            </View>

            <View className="bg-secondary p-4 rounded-2xl rounded-tl-sm self-start max-w-[85%]">
              <View className="flex-row items-center gap-2 mb-2">
                <BotIcon size={16} className="text-primary" />
                <Text className="text-muted-foreground text-xs font-medium">
                  Executing local SQL query...
                </Text>
              </View>
              <Text className="text-foreground leading-5">
                You've spent KES 8,450 on food and groceries this week. This is
                15% higher than last week's average.
              </Text>
            </View>
          </View>
        </ScrollView>

        <View className="flex-row items-center gap-2 bg-card border border-border p-2 rounded-full shadow-sm mt-auto">
          <TextInput
            className="flex-1 px-4 h-10 text-foreground"
            placeholder="Ask anything about your finances..."
            placeholderTextColor={isDark ? "#666" : "#999"}
          />
          <Button size="icon" className="rounded-full h-10 w-10">
            <SendIcon size={18} className="text-primary-foreground" />
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
