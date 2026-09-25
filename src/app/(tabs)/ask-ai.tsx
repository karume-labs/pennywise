import { desc } from "drizzle-orm";
import { BotIcon, SendIcon } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { ScrollView, TextInput, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { db } from "@/db/client";
import { transactions } from "@/db/schema";
import { llmService } from "@/services/LlmService";

const TypewriterText = ({
  text,
  onComplete,
}: {
  text: string;
  onComplete?: () => void;
}) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(index));
      index++;
      if (index >= text.length) {
        clearInterval(interval);
        onComplete?.();
      }
    }, 20); // ms per character

    return () => clearInterval(interval);
  }, [text, onComplete]);

  return <Text className="text-foreground leading-5">{displayedText}</Text>;
};

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
};

export default function AskAIScreen() {
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm Penny, your local AI financial assistant. I run 100% on your device.",
      isStreaming: false,
    },
  ]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsThinking(true);

    try {
      // 1. Fetch recent transactions as context
      const recentTx = await db
        .select()
        .from(transactions)
        .orderBy(desc(transactions.date))
        .limit(20);

      // 2. Query Local LLM
      const responseText = await llmService.askPenny(userMsg.content, recentTx);

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseText,
        isStreaming: true,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (e) {
      console.error(e);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Oops, something went wrong querying my local engine.",
        isStreaming: false,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsThinking(false);
    }
  };
  return (
    <View className="flex-1 bg-background">
      <View className="flex-1 px-4 pt-6 pb-4">
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 mb-4"
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
        >
          <View className="gap-4">
            {messages.map((msg) => (
              <View
                key={msg.id}
                className={`${msg.role === "assistant" ? "bg-secondary rounded-tl-sm self-start" : "bg-primary rounded-tr-sm self-end"} p-4 rounded-2xl max-w-[85%]`}
              >
                {msg.role === "assistant" && msg.isStreaming ? (
                  <TypewriterText
                    text={msg.content}
                    onComplete={() => {
                      setMessages((prev) =>
                        prev.map((m) =>
                          m.id === msg.id ? { ...m, isStreaming: false } : m,
                        ),
                      );
                    }}
                  />
                ) : (
                  <Text
                    className={
                      msg.role === "assistant"
                        ? "text-foreground leading-5"
                        : "text-primary-foreground leading-5"
                    }
                  >
                    {msg.content}
                  </Text>
                )}
              </View>
            ))}

            {isThinking && (
              <View className="bg-secondary p-4 rounded-2xl rounded-tl-sm self-start max-w-[85%]">
                <View className="flex-row items-center gap-2">
                  <BotIcon size={16} className="text-primary" />
                  <Text className="text-muted-foreground text-xs font-medium">
                    Executing local SQL query...
                  </Text>
                </View>
              </View>
            )}
          </View>
        </ScrollView>

        <View className="flex-row items-center gap-2 bg-card border border-border p-2 rounded-full shadow-sm mt-auto">
          <TextInput
            value={input}
            onChangeText={setInput}
            className="flex-1 px-4 h-10 text-foreground"
            placeholder="Ask anything about your finances..."
            placeholderTextColor="#A69C8D"
            onSubmitEditing={handleSend}
          />
          <Button
            size="icon"
            className="rounded-full h-10 w-10"
            onPress={handleSend}
            disabled={!input.trim()}
          >
            <SendIcon size={18} className="text-primary-foreground" />
          </Button>
        </View>
      </View>
    </View>
  );
}
