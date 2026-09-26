import { SendIcon } from "lucide-react-native";
import { TextInput, View } from "react-native";
import { Button } from "@/components/ui/button";

type Props = {
  input: string;
  setInput: (value: string) => void;
  isThinking: boolean;
  onSend: () => void;
};

export const ChatComposer = ({
  input,
  setInput,
  isThinking,
  onSend,
}: Props) => (
  <View className="flex-row items-center gap-2 bg-card border border-border p-2 rounded-full shadow-sm mt-auto">
    <TextInput
      value={input}
      onChangeText={setInput}
      className="flex-1 px-4 h-10 text-foreground"
      placeholder="Ask anything about your finances..."
      placeholderTextColor="#A69C8D"
      editable={!isThinking}
      onSubmitEditing={onSend}
    />
    <Button
      size="icon"
      className="rounded-full h-10 w-10"
      onPress={onSend}
      disabled={isThinking || !input.trim()}
    >
      <SendIcon size={18} className="text-primary-foreground" />
    </Button>
  </View>
);
