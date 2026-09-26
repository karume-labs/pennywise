import { useEffect, useState } from "react";
import { Text } from "@/components/ui/text";

type Props = {
  text: string;
  onComplete?: () => void;
};

export const TypewriterText = ({ text, onComplete }: Props) => {
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
