import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { TypewriterText } from "@/components/ui/typewriter-text";

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
};

type Props = {
  msg: Message;
  onAnimationComplete: (id: string) => void;
};

export const ChatBubble = ({ msg, onAnimationComplete }: Props) => {
  return (
    <View
      className={`${
        msg.role === "assistant"
          ? "bg-secondary rounded-tl-sm self-start"
          : "bg-primary rounded-tr-sm self-end"
      } p-4 rounded-2xl max-w-[85%]`}
    >
      {msg.role === "assistant" && msg.isStreaming ? (
        <TypewriterText
          text={msg.content}
          onComplete={() => onAnimationComplete(msg.id)}
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
  );
};
