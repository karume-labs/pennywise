import type { Config } from "drizzle-kit";

export default {
  schema: "./src/features/*/schema.ts",
  out: "./src/db/migrations",
  dialect: "sqlite",
  driver: "expo",
} satisfies Config;
