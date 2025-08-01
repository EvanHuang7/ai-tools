import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  jsonb,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// Note: Whenever adding a new schema,
// run "npx drizzle-kit generate" and "npx drizzle-kit migrate" clis
export const audios = pgTable("audios", {
  id: serial("id").primaryKey().notNull(), // serial will be auto-generated
  userId: text("userId").notNull(),
  topic: text("topic").notNull(),
  transcript: jsonb("transcript").notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: false,
    mode: "date",
  }).defaultNow(),
  updatedAt: timestamp("updated_at", {
    withTimezone: false,
    mode: "date",
  }).defaultNow(),
});

export const audioFeatureMonthlyUsage = pgTable(
  "audioFeatureMonthlyUsage",
  {
    id: serial("id").primaryKey().notNull(),
    userId: text("userId").notNull(),
    usage: integer("usage").notNull(),
    monthAndYear: timestamp("monthAndYear", {
      withTimezone: false,
      mode: "date",
    }).notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: false,
      mode: "date",
    }).defaultNow(),
    updatedAt: timestamp("updated_at", {
      withTimezone: false,
      mode: "date",
    }).defaultNow(),
  },
  (table) => ({
    userMonthUnique: uniqueIndex("user_month_unique").on(
      table.userId,
      table.monthAndYear
    ),
  })
);
