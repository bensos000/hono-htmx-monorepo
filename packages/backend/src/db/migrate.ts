import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";

const sqlite = process.env.SCOPE === "test" ? new Database("test.db") : new Database("backend.db");
const db = drizzle(sqlite);
(async () => {
    await migrate(db, { migrationsFolder: "./drizzle" });
})();