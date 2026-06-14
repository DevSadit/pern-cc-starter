import dotenv from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

const currentDir = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(currentDir, ".env") });

if (!process.env.DATABASE_URL) throw new Error("Database Url is required..");

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql);
