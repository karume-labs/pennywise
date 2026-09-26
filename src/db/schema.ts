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
  originalCurrency: text("original_currency").default("KES"),
  originalAmount: real("original_amount"),
});

export const budgets = sqliteTable("budgets", {
  id: text("id").primaryKey(),
  category: text("category").notNull().unique(),
  amountLimit: real("amount_limit").notNull(),
  alertThreshold: real("alert_threshold").notNull().default(0.8),
});

export const subscriptions = sqliteTable("subscriptions", {
  id: text("id").primaryKey(),
  merchant: text("merchant").notNull(),
  amount: real("amount").notNull(),
  frequency: text("frequency").notNull().default("monthly"),
  nextDueDate: integer("next_due_date", { mode: "timestamp" }),
  status: text("status").notNull().default("active"),
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
