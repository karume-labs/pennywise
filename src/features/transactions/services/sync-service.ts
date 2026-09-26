import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { transactions } from "@/db/schema";
import { parseFinancialSms } from "@/features/transactions/services/parsers";

type SmsMessage = { body: string };

/**
 * Parses raw SMS bodies and inserts the ones that are not stored yet.
 * Transactions are keyed by the transaction code from the message, so re-syncing
 * an already-imported message is a no-op. Returns how many rows were added.
 */
export const storeFinancialMessages = async (
  messages: SmsMessage[],
): Promise<number> => {
  let newRecords = 0;

  for (const msg of messages) {
    const parsed = parseFinancialSms(msg.body);
    if (!parsed) continue;

    // Check if already exists (transactions.id is the M-PESA code)
    const existing = await db
      .select()
      .from(transactions)
      .where(eq(transactions.id, parsed.transactionCode))
      .limit(1);

    if (existing.length > 0) continue;

    await db.insert(transactions).values({
      id: parsed.transactionCode,
      merchantOrSender: parsed.merchantOrSender,
      amount: parsed.amount,
      type: parsed.type,
      date: parsed.date,
      transactionFee: parsed.transactionFee,
      accountBalance: parsed.accountBalance,
      originalCurrency: parsed.originalCurrency,
      originalAmount: parsed.originalAmount,
      rawSms: msg.body,
      aiConfidence: 0, // Default to 0 until categorized by AI
    });
    newRecords++;
  }

  return newRecords;
};
