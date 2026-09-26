import { desc } from "drizzle-orm";
import { useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/db/client";
import { transactions } from "@/db/schema";
import {
  ChatBubble,
  type Message,
} from "@/features/transactions/components/ChatBubble";
import { ChatComposer } from "@/features/transactions/components/ChatComposer";
import { llmService } from "@/features/transactions/services/llm-service";

const AskPennyScreen = () => {
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

      const aiMsgId = (Date.now() + 1).toString();
      const aiMsg: Message = {
        id: aiMsgId,
        role: "assistant",
        content: "",
        isStreaming: false, // We stream natively via onToken now
      };
      setMessages((prev) => [...prev, aiMsg]);

      // 2. Query Local LLM with onToken callback for real-time text updates
      await llmService.askPenny(userMsg.content, recentTx, (token) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiMsgId ? { ...m, content: m.content + token } : m,
          ),
        );
      });
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      // Android reports adjustResize but never actually shrinks the window,
      // so the composer would stay behind the IME. Subtract the keyboard
      // height here instead; iOS pads the layout.
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
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
                <ChatBubble
                  key={msg.id}
                  msg={msg}
                  onAnimationComplete={(id) => {
                    setMessages((prev) =>
                      prev.map((m) =>
                        m.id === id ? { ...m, isStreaming: false } : m,
                      ),
                    );
                  }}
                />
              ))}

              {isThinking && (
                <View className="bg-secondary p-4 rounded-2xl rounded-tl-sm self-start max-w-[85%] gap-2">
                  <Skeleton className="h-3 w-40 rounded" />
                  <Skeleton className="h-3 w-28 rounded" />
                </View>
              )}
            </View>
          </ScrollView>

          <ChatComposer
            input={input}
            setInput={setInput}
            isThinking={isThinking}
            onSend={handleSend}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AskPennyScreen;
