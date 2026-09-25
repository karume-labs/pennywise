import type { ParsedTransaction } from "./types";

// Extracts numeric values from strings like "1,200.50"
const parseAmount = (amountStr: string) =>
  parseFloat(amountStr.replace(/,/g, ""));

// Basic date parser for M-PESA format: "21/9/23 at 10:24 AM"
const parseDate = (dateStr: string, timeStr: string) => {
  const [d, m, y] = dateStr.split("/");
  // M-PESA uses 2-digit years. Assuming 2000s
  const year = parseInt(y, 10) + 2000;
  return new Date(
    `${year}-${m.padStart(2, "0")}-${d.padStart(2, "0")} ${timeStr}`,
  );
};

export const parseMpesaSms = (body: string): ParsedTransaction | null => {
  // Pattern 1: Paybill / Buy Goods (Expense)
  // Example: QWE123RTY Confirmed. Ksh4,500.00 paid to Naivas Supermarket. on 21/9/23 at 10:24 AM. New M-PESA balance is Ksh15,000.00. Transaction cost, Ksh 22.00.
  const paybillRegex =
    /^([A-Z0-9]+) Confirmed\.\s*Ksh\s*([0-9.,]+) paid to (.*?)\.? on ([0-9/]+) at ([0-9:\sAPM]+)\. New M-PESA balance is Ksh\s*([0-9.,]+)\.(?: Transaction cost, Ksh\s*([0-9.,]+)\.)?/;

  const paybillMatch = body.match(paybillRegex);
  if (paybillMatch) {
    return {
      transactionCode: paybillMatch[1],
      amount: parseAmount(paybillMatch[2]),
      merchantOrSender: paybillMatch[3].trim(),
      date: parseDate(paybillMatch[4], paybillMatch[5].trim()),
      type: "EXPENSE",
      accountBalance: parseAmount(paybillMatch[6]),
      transactionFee: paybillMatch[7] ? parseAmount(paybillMatch[7]) : 0,
    };
  }

  // Pattern 2: Send Money (Expense)
  // Example: QWE123RTY Confirmed. Ksh1,500.00 sent to John Doe 0712345678 on 21/9/23 at 10:24 AM. New M-PESA balance is Ksh15,000.00. Transaction cost, Ksh 12.00.
  const sendRegex =
    /^([A-Z0-9]+) Confirmed\.\s*Ksh\s*([0-9.,]+) sent to ([a-zA-Z0-9\s]+) \d{10} on ([0-9/]+) at ([0-9:\sAPM]+)\. New M-PESA balance is Ksh\s*([0-9.,]+)\.(?: Transaction cost, Ksh\s*([0-9.,]+)\.)?/;

  const sendMatch = body.match(sendRegex);
  if (sendMatch) {
    return {
      transactionCode: sendMatch[1],
      amount: parseAmount(sendMatch[2]),
      merchantOrSender: sendMatch[3].trim(),
      date: parseDate(sendMatch[4], sendMatch[5].trim()),
      type: "EXPENSE",
      accountBalance: parseAmount(sendMatch[6]),
      transactionFee: sendMatch[7] ? parseAmount(sendMatch[7]) : 0,
    };
  }

  // Pattern 3: Receive Money (Income)
  // Example: QWE123RTY Confirmed. You have received Ksh2,000.00 from Jane Doe 0712345678 on 21/9/23 at 10:24 AM. New M-PESA balance is Ksh17,000.00.
  const receiveRegex =
    /^([A-Z0-9]+) Confirmed\.\s*You have received Ksh\s*([0-9.,]+) from (.*?) \d{10} on ([0-9/]+) at ([0-9:\sAPM]+)\. New M-PESA balance is Ksh\s*([0-9.,]+)\./;

  const receiveMatch = body.match(receiveRegex);
  if (receiveMatch) {
    return {
      transactionCode: receiveMatch[1],
      amount: parseAmount(receiveMatch[2]),
      merchantOrSender: receiveMatch[3].trim(),
      date: parseDate(receiveMatch[4], receiveMatch[5].trim()),
      type: "INCOME",
      accountBalance: parseAmount(receiveMatch[6]),
      transactionFee: 0,
    };
  }

  return null;
};
