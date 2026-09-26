import { ArrowDownIcon } from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Text } from "@/components/ui/text";

const FREQUENCIES = ["weekly", "monthly", "yearly"];

type Props = {
  frequency: string;
  setFrequency: (value: string) => void;
};

export const FrequencyPicker = ({ frequency, setFrequency }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View className="gap-2">
      <Text className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">
        Frequency
      </Text>
      <Pressable
        onPress={() => setIsOpen(!isOpen)}
        className="bg-background border border-border rounded-xl px-4 py-3 flex-row items-center justify-between"
      >
        <Text className="text-foreground font-medium capitalize">
          {frequency}
        </Text>
        <ArrowDownIcon size={16} className="text-muted-foreground" />
      </Pressable>

      {isOpen && (
        <ScrollView
          className="max-h-40 bg-card rounded-xl border border-border mt-1"
          nestedScrollEnabled={true}
        >
          {FREQUENCIES.map((freq) => (
            <Pressable
              key={freq}
              onPress={() => {
                setFrequency(freq);
                setIsOpen(false);
              }}
              className={`px-4 py-3 border-b border-border/50 ${
                frequency === freq ? "bg-primary/20" : ""
              }`}
            >
              <Text
                className={`${
                  frequency === freq
                    ? "text-primary font-bold capitalize"
                    : "text-foreground font-medium capitalize"
                }`}
              >
                {freq}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
};
