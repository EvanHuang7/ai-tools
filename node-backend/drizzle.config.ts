import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { getEnvOrFile } from "./src/utils/utils.js";

// Note: Whenever adding a new schema,
// run "npx drizzle-kit generate" and "npx drizzle-kit migrate" clis
export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.js",
  dialect: "postgresql",
  dbCredentials: {
    url: getEnvOrFile("DATABASE_URL"),
  },
});
