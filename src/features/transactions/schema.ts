import { relations } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { categories } from "../categories/schema";

export const transactions = sqliteTable("transactions", {
  id: text("id").primaryKey(),
  rawSms: text("raw_sms").notNull(),
  providerId: text("provider_id").notNull(),
  transactionCode: text("transaction_code").unique().notNull(),
  amount: real("amount").notNull(),
  transactionFee: real("transaction_fee"),
  date: integer("date", { mode: "timestamp" }).notNull(),
  merchantOrSender: text("merchant_or_sender"),
  accountBalance: real("account_balance"),
  type: text("type", { enum: ["INCOME", "EXPENSE", "TRANSFER"] }).notNull(),
  categoryId: text("category_id").references(() => categories.id, {
    onDelete: "set null",
  }),
  aiConfidenceScore: real("ai_confidence_score"),
});

export const transactionsRelations = relations(transactions, ({ one }) => ({
  category: one(categories, {
    fields: [transactions.categoryId],
    references: [categories.id],
  }),
}));
