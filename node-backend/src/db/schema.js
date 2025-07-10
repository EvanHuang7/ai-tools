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

export const audios = pgTable("audios", {
  id: serial("id").primaryKey().notNull(), // serial will be auto-generated
  userId: text("userId").notNull(),
  topic: text("topic").notNull(),
  audioUrl: text("audioUrl"),
  createdAt: timestamp("created_at", {
    withTimezone: false,
    mode: "date", // important
  }).defaultNow(),
});

export const audioFeatureMonthlyUsage = pgTable("audioFeatureMonthlyUsage", {
  id: serial("id").primaryKey().notNull(), // serial will be auto-generated
  userId: text("userId").notNull(),
  usage: int("usage").notNull(),
  monthAndYear: timestamp("monthAndYear"),
  createdAt: timestamp("created_at", {
    withTimezone: false,
    mode: "date", // important
  }).defaultNow(),
});
