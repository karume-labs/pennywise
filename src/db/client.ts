import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import * as schema from "./schema";

// Open SQLite database (synchronous)
export const sqlite = openDatabaseSync("pennywise.db");

// Pass it to drizzle
export const db = drizzle(sqlite, { schema });
