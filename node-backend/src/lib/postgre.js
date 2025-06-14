import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../db/schema.js";

const client = postgres(process.env.DATABASE_URL);
export const postgreDbClient = drizzle(client, { schema });
