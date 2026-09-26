import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { subscriptions, transactions } from "@/db/schema";

export const autoDetectSubscriptions = async () => {
  // Fetch all expenses
  const expenses = await db
    .select()
    .from(transactions)
    .where(eq(transactions.type, "EXPENSE"));

  // Group by merchant and amount
  const candidates: Record<string, { dates: Date[]; count: number }> = {};

  for (const tx of expenses) {
    if (!tx.merchantOrSender || !tx.amount) continue;
    const key = `${tx.merchantOrSender.toLowerCase()}_${tx.amount}`;

    if (!candidates[key]) {
      candidates[key] = { dates: [], count: 0 };
    }
    candidates[key].dates.push(new Date(tx.date));
    candidates[key].count++;
  }

  let newSubs = 0;

  for (const [key, data] of Object.entries(candidates)) {
    if (data.count >= 2) {
      // Sort dates
      data.dates.sort((a, b) => a.getTime() - b.getTime());

      // Check frequency (rough estimation)
      let frequency = "monthly";
      const diffDays =
        (data.dates[data.dates.length - 1].getTime() -
          data.dates[0].getTime()) /
        (1000 * 60 * 60 * 24);

      if (data.count > 2 && diffDays / data.count < 15) {
        frequency = "weekly";
      } else if (diffDays / data.count > 300) {
        frequency = "yearly";
      }

      const [merchantLower, amountStr] = key.split("_");
      const merchant =
        merchantLower.charAt(0).toUpperCase() + merchantLower.slice(1);
      const amount = parseFloat(amountStr);

      // Check if it already exists
      const existing = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.merchant, merchant));

      // We only insert if no subscription for this merchant exists
      if (existing.length === 0) {
        await db.insert(subscriptions).values({
          id: `sub_auto_${Date.now()}_${Math.random()}`,
          merchant: merchant,
          amount: amount,
          frequency: frequency,
          status: "active",
        });
        newSubs++;
      }
    }
  }

  return newSubs;
};
