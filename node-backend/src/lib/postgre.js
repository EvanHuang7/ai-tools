import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../db/schema.js";
import fs from "fs";

// Read the secret from file Only if creating a docker secret within Docker Swarm
const databaseUrl =
  process.env.DATABASE_URL ||
  fs.readFileSync(process.env.DATABASE_URL_FILE, "utf8");

const client = postgres(databaseUrl);
export const postgreDbClient = drizzle(client, { schema });
