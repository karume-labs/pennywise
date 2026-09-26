import { parseBankAlertSms } from "./bank-alert";
import { parseGenericSms } from "./generic";
import { parseMobileMoneySms } from "./mobile-money";
import type { ParsedTransaction } from "./types";

// Ordered by specificity: the mobile money and bank templates are precise, so
// they must claim a message before the permissive generic fallback sees it.
// Names describe the message shape, not the institution that sent it, so a new
// provider or bank slots in without inventing a new category. Add the
// institution's own template as a new entry ahead of the fallback.
const parsers = [
  {
    name: "MOBILE_MONEY",
    parse: parseMobileMoneySms,
  },
  {
    name: "BANK_ALERT",
    parse: parseBankAlertSms,
  },
  {
    name: "GENERIC",
    parse: parseGenericSms,
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
