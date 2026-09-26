import { desc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { budgets, customRules, subscriptions, transactions } from "@/db/schema";

export const recentTransactionsQuery = db
  .select()
  .from(transactions)
  .orderBy(desc(transactions.date))
  .limit(20);

export const allTransactionsQuery = db
  .select()
  .from(transactions)
  .orderBy(desc(transactions.date));

export const thisMonthTransactionsQuery = db
  .select()
  .from(transactions)
  .orderBy(desc(transactions.date));

export const categoryTransactionsQuery = (categoryId: string) =>
  db
    .select()
    .from(transactions)
    .where(eq(transactions.category, categoryId))
    .orderBy(desc(transactions.date));

export const allBudgetsQuery = db.select().from(budgets);

export const activeSubscriptionsQuery = db
  .select()
  .from(subscriptions)
  .where(eq(subscriptions.status, "active"))
  .orderBy(desc(subscriptions.amount));

export const allRulesQuery = db.select().from(customRules);
