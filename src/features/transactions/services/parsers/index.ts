import { parseMpesaSms } from "./mpesa";
import type { ParsedTransaction } from "./types";

// More parsers will be added here
const parsers = [
  {
    name: "MPESA",
    parse: parseMpesaSms,
  },
];

export const parseFinancialSms = (body: string): ParsedTransaction | null => {
  for (const parser of parsers) {
    const result = parser.parse(body);
    if (result) {
      return {
        ...result,
        source: parser.name,
      };
    }
  }

  // Fallback to LLM could be triggered later if all parsers fail
  return null;
};
