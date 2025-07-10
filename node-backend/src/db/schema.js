import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// Note: Whenever adding a new schema,
// run "npx drizzle-kit generate" and "npx drizzle-kit migrate" clis
export const users = pgTable("users", {
  id: serial("id").primaryKey().notNull(), // serial will be auto-generated
  name: text("name").notNull(),
  email: text("email").notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: false,
    mode: "date", // important
  }).defaultNow(),
});

export const gcpPubSubMessages = pgTable("gcpPubSubMessages", {
  id: serial("id").primaryKey().notNull(), // serial will be auto-generated
  message: text("message").notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: false,
    mode: "date", // important
  }).defaultNow(),
});
