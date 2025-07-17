import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../db/schema.js";
import { getEnvOrFile } from "../utils/utils.js";

const databaseUrl = getEnvOrFile("DATABASE_URL");
const client = postgres(databaseUrl);
export const postgreDbClient = drizzle(client, { schema });
