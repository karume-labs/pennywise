import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import * as categoriesSchema from "../features/categories/schema";
import * as transactionsSchema from "../features/transactions/schema";

export const expoDb = openDatabaseSync("pennywise.db", {
  enableChangeListener: true,
});

export const db = drizzle(expoDb, {
  schema: { ...categoriesSchema, ...transactionsSchema },
});
