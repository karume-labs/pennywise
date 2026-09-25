import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const transactions = sqliteTable("transactions", {
  id: text("id").primaryKey(), // using the transaction code (e.g., M-PESA code) as ID
  merchantOrSender: text("merchant_or_sender").notNull(),
  amount: real("amount").notNull(),
  type: text("type").notNull(), // 'INCOME' | 'EXPENSE'
  category: text("category").notNull().default("Uncategorized"),
  date: integer("date", { mode: "timestamp" }).notNull(), // stored as integer unix timestamp
  transactionFee: real("transaction_fee").default(0),
  accountBalance: real("account_balance"),
  aiConfidence: real("ai_confidence"),
  rawSms: text("raw_sms"),
});

export const categories = sqliteTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
});

export const customRules = sqliteTable("custom_rules", {
  id: text("id").primaryKey(),
  merchantPattern: text("merchant_pattern").notNull(),
  assignedCategory: text("assigned_category").notNull(),
});
