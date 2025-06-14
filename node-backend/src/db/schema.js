import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey().notNull(), // serial will be auto-generated
  name: text("name").notNull(),
  email: text("email").notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: false,
    mode: "date", // important
  }).defaultNow(),
});
