import type { ParsedTransaction } from "./types";

/**
 * A fallback generic parser that attempts to extract financial data from unknown SMS formats.
 * It looks for common currency identifiers (KES, Ksh) and transaction keywords (debited, credited, paid, received).
 */
export const parseGenericSms = (body: string): ParsedTransaction | null => {
  // Extract amount
  const amountMatch = body.match(
    /(?:KES|Ksh|Kshs\.?|KShs)\s*([\d,]+(?:\.\d{2})?)/i,
  );
  if (!amountMatch) return null;

  const amount = parseFloat(amountMatch[1].replace(/,/g, ""));

  // Determine type based on keywords
  const isExpense =
    /(debited|sent|paid|withdrawn|purchase|bought|transfer to)/i.test(body);
  const isIncome = /(credited|received|deposited|transfer from)/i.test(body);

  if (!isExpense && !isIncome) return null;
  const type = isExpense ? "EXPENSE" : "INCOME";

  // Try to find merchant/sender
  let merchant = "Unknown";
  if (isExpense) {
    const toMatch = body.match(
      /(?:to|at)\s+([A-Z0-9\s]+?)(?:\.|\s+on|\s+via|\s+Avail)/i,
    );
    if (toMatch?.[1]) merchant = toMatch[1].trim();
  } else {
    const fromMatch = body.match(
      /(?:from|by)\s+([A-Z0-9\s]+?)(?:\.|\s+on|\s+via|\s+Avail)/i,
    );
    if (fromMatch?.[1]) merchant = fromMatch[1].trim();
  }

  // Generate a random transaction code for uniqueness if not found
  const txCodeMatch = body.match(/([A-Z0-9]{8,12})/);
  const transactionCode = txCodeMatch
    ? txCodeMatch[1]
    : `GEN_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  // Try to find balance
  let balance = 0;
  const balMatch = body.match(
    /(?:Bal|Balance).*?(?:KES|Ksh)\s*([\d,]+(?:\.\d{2})?)/i,
  );
  if (balMatch) {
    balance = parseFloat(balMatch[1].replace(/,/g, ""));
  }

  return {
    transactionCode,
    amount,
    type,
    merchantOrSender: merchant,
    date: new Date(),
    transactionFee: 0,
    accountBalance: balance,
  };
};
