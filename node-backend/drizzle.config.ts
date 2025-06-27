import "dotenv/config";
import { defineConfig } from "drizzle-kit";

// Whenever adding a new schema,
// run "npx drizzle-kit generate" and "npx drizzle-kit migrate" clis
export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.js",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
