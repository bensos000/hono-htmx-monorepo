import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";

const sqlite = process.env.SCOPE === "test" ? new Database("test.db") : new Database("backend.db");
export const db = drizzle(sqlite);