import type { ParsedTransaction } from "./types";

// Extracts numeric values from strings like "1,200.50"
const parseAmount = (amountStr: string) =>
  parseFloat(amountStr.replace(/,/g, ""));

// The service names itself in the trailing balance line, and every mobile
// money provider uses the same sentence with its own name swapped in:
//   "New M-PESA balance is Ksh15,000.00."
//   "New Airtel Money balance is Ksh5,000.00."
//   "New Equitel balance is Ksh5,000.00."
// Matching the name as a variable is what makes this parser provider-agnostic
// instead of Safaricom-only. It is non-capturing so the numbered groups below
// stay aligned across all three patterns.
const PROVIDER_BALANCE = String.raw`New\s+[A-Za-z][A-Za-z0-9 -]{0,24}?\s+balance\s+is\s+Ksh\s*`;

// Date parser for the "on 21/9/23 at 10:24 AM" fragment this template uses.
// Builds the Date from numeric parts rather than a formatted string: the old
// `${y}-${m}-${d} ${time}` form is not ISO-8601, so it parses under V8 but
// yields Invalid Date on Hermes, whose Date parser is stricter. That NaN
// reached SQLite via getTime(), which stores NaN as NULL and tripped the
// `transactions.date` NOT NULL constraint at runtime.
const parseDate = (dateStr: string, timeStr: string) => {
  const [day, month, rawYear] = dateStr.split("/").map(Number);
  // This template uses 2-digit years; tolerate a 4-digit year rather than
  // assuming.
  const year = rawYear < 100 ? rawYear + 2000 : rawYear;

  const timeMatch = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  const rawHours = timeMatch ? Number(timeMatch[1]) : 0;
  const minutes = timeMatch ? Number(timeMatch[2]) : 0;
  const meridiem = timeMatch?.[3]?.toUpperCase();

  // On a 12-hour clock 12 AM is midnight (0) and 12 PM is noon (12).
  let hours = rawHours;
  if (meridiem === "PM") hours = (rawHours % 12) + 12;
  if (meridiem === "AM") hours = rawHours % 12;

  return new Date(year, month - 1, day, hours, minutes);
};

// Build the transaction code for provider-generated SMS. These messages carry
// a real confirmation code; only the generic parser has to invent one.
const withCode = (
  match: RegExpMatchArray,
  rest: Omit<ParsedTransaction, "transactionCode">,
): ParsedTransaction => ({
  transactionCode: match[1],
  ...rest,
});

export const parseMobileMoneySms = (body: string): ParsedTransaction | null => {
  // Pattern 1: Paybill / Buy Goods (Expense)
  // Example: QWE123RTY Confirmed. Ksh4,500.00 paid to Naivas Supermarket. on 21/9/23 at 10:24 AM. New M-PESA balance is Ksh15,000.00. Transaction cost, Ksh 22.00.
  const paybillMatch = body.match(
    new RegExp(
      String.raw`^([A-Z0-9]+) Confirmed\.\s*Ksh\s*([0-9.,]+) paid to (.*?)\.? on ([0-9/]+) at ([0-9:\sAPM]+)\. ` +
        PROVIDER_BALANCE +
        String.raw`([0-9.,]+)\.(?: Transaction cost, Ksh\s*([0-9.,]+)\.)?`,
    ),
  );

  if (paybillMatch) {
    return withCode(paybillMatch, {
      amount: parseAmount(paybillMatch[2]),
      merchantOrSender: paybillMatch[3].trim(),
      date: parseDate(paybillMatch[4], paybillMatch[5].trim()),
      type: "EXPENSE",
      accountBalance: parseAmount(paybillMatch[6]),
      transactionFee: paybillMatch[7] ? parseAmount(paybillMatch[7]) : 0,
    });
  }

  // Pattern 2: Send Money (Expense)
  // Example: QWE123RTY Confirmed. Ksh1,500.00 sent to John Doe 0712345678 on 21/9/23 at 10:24 AM. New Airtel Money balance is Ksh15,000.00. Transaction cost, Ksh 12.00.
  const sendMatch = body.match(
    new RegExp(
      String.raw`^([A-Z0-9]+) Confirmed\.\s*Ksh\s*([0-9.,]+) sent to ([a-zA-Z0-9\s]+) \d{10} on ([0-9/]+) at ([0-9:\sAPM]+)\. ` +
        PROVIDER_BALANCE +
        String.raw`([0-9.,]+)\.(?: Transaction cost, Ksh\s*([0-9.,]+)\.)?`,
    ),
  );

  if (sendMatch) {
    return withCode(sendMatch, {
      amount: parseAmount(sendMatch[2]),
      merchantOrSender: sendMatch[3].trim(),
      date: parseDate(sendMatch[4], sendMatch[5].trim()),
      type: "EXPENSE",
      accountBalance: parseAmount(sendMatch[6]),
      transactionFee: sendMatch[7] ? parseAmount(sendMatch[7]) : 0,
    });
  }

  // Pattern 3: Receive Money (Income)
  // Example: QWE123RTY Confirmed. You have received Ksh2,000.00 from Jane Doe 0712345678 on 21/9/23 at 10:24 AM. New M-PESA balance is Ksh17,000.00.
  const receiveMatch = body.match(
    new RegExp(
      String.raw`^([A-Z0-9]+) Confirmed\.\s*You have received Ksh\s*([0-9.,]+) from (.*?) \d{10} on ([0-9/]+) at ([0-9:\sAPM]+)\. ` +
        PROVIDER_BALANCE +
        String.raw`([0-9.,]+)\.`,
    ),
  );

  if (receiveMatch) {
    return withCode(receiveMatch, {
      amount: parseAmount(receiveMatch[2]),
      merchantOrSender: receiveMatch[3].trim(),
      date: parseDate(receiveMatch[4], receiveMatch[5].trim()),
      type: "INCOME",
      accountBalance: parseAmount(receiveMatch[6]),
      transactionFee: 0,
    });
  }

  return null;
};
