/** Apply the versioned PostgreSQL schema before running the application.
 *  Runs every `scripts/migrations/*.sql` file in filename order (001, 002, …)
 *  so the schema evolves additively without touching existing data. */
import fs from "node:fs/promises";
import path from "node:path";
import { getDb, closeDb } from "../src/lib/db";

const migrationsDir = path.join(process.cwd(), "scripts", "migrations");

async function main() {
  const files = (await fs.readdir(migrationsDir))
    .filter((f) => f.endsWith(".sql"))
    .sort(); // 001_initial.sql, 002_learning_path.sql, …
  if (files.length === 0) throw new Error("No migration files found.");

  for (const file of files) {
    const sql = await fs.readFile(path.join(migrationsDir, file), "utf8");
    await getDb().query(sql);
    console.log(`Applied migration: ${file}`);
  }
  console.log("PostgreSQL schema is initialized.");
}

main()
  .catch((error: unknown) => {
    console.error("Migration failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeDb();
  });
