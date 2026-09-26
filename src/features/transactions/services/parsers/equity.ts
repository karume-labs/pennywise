import type { ParsedTransaction } from "./types";

/**
 * Parses Equity Bank SMS notifications.
 * Examples:
 * - "Dear Customer, KES 1,500.00 has been debited from your A/C ...012 on 26/09/2026 at 08:00 via POS at NAIVAS. Avail Bal: KES 10,000.00."
 * - "Dear Customer, KES 5,000.00 has been credited to your A/C ...012 on 25/09/2026 at 14:00 by JOHN DOE. Avail Bal: KES 15,000.00."
 */
export const parseEquitySms = (body: string): ParsedTransaction | null => {
  if (!body.includes("Dear Customer") || !body.includes("A/C")) return null;

  const debitMatch = body.match(
    /KES\s([\d,]+(?:\.\d{2})?)\s+has been debited.*via\s.*at\s(.*?)\.\sAvail\sBal:\sKES\s([\d,]+(?:\.\d{2})?)/i,
  );

  if (debitMatch) {
    return {
      transactionCode: `EQ_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      amount: parseFloat(debitMatch[1].replace(/,/g, "")),
      type: "EXPENSE",
      merchantOrSender: debitMatch[2].trim(),
      date: new Date(),
      transactionFee: 0,
      accountBalance: parseFloat(debitMatch[3].replace(/,/g, "")),
    };
  }

  const creditMatch = body.match(
    /KES\s([\d,]+(?:\.\d{2})?)\s+has been credited.*by\s(.*?)\.\sAvail\sBal:\sKES\s([\d,]+(?:\.\d{2})?)/i,
  );

  if (creditMatch) {
    return {
      transactionCode: `EQ_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      amount: parseFloat(creditMatch[1].replace(/,/g, "")),
      type: "INCOME",
      merchantOrSender: creditMatch[2].trim(),
      date: new Date(),
      transactionFee: 0,
      accountBalance: parseFloat(creditMatch[3].replace(/,/g, "")),
    };
  }

  return null;
};
