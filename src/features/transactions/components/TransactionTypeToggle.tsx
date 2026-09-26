import * as ToggleGroupPrimitive from "@rn-primitives/toggle-group";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

type Props = {
  type: "EXPENSE" | "INCOME";
  setType: (type: "EXPENSE" | "INCOME") => void;
};

export const TransactionTypeToggle = ({ type, setType }: Props) => {
  return (
    <ToggleGroupPrimitive.Root
      type="single"
      value={type}
      onValueChange={(val) => {
        if (val === "EXPENSE" || val === "INCOME") {
          setType(val);
        }
      }}
      className="flex-row gap-4 mb-2"
    >
      <ToggleGroupPrimitive.Item
        value="EXPENSE"
        className={cn(
          "flex-1 py-2 items-center rounded-lg border",
          type === "EXPENSE"
            ? "bg-muted border-muted"
            : "bg-transparent border-border",
        )}
      >
        <Text
          className={cn(
            type === "EXPENSE"
              ? "text-foreground font-semibold"
              : "text-muted-foreground",
          )}
        >
          Expense
        </Text>
      </ToggleGroupPrimitive.Item>
      <ToggleGroupPrimitive.Item
        value="INCOME"
        className={cn(
          "flex-1 py-2 items-center rounded-lg border",
          type === "INCOME"
            ? "bg-emerald-500/20 border-emerald-500/50"
            : "bg-transparent border-border",
        )}
      >
        <Text
          className={cn(
            type === "INCOME"
              ? "text-emerald-500 font-semibold"
              : "text-muted-foreground",
          )}
        >
          Income
        </Text>
      </ToggleGroupPrimitive.Item>
    </ToggleGroupPrimitive.Root>
  );
};
