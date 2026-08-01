/** Apply the versioned PostgreSQL schema before running the application. */
import fs from "node:fs/promises";
import path from "node:path";
import { getDb, closeDb } from "../src/lib/db";

const migrationPath = path.join(process.cwd(), "scripts", "migrations", "001_initial.sql");

async function main() {
  const sql = await fs.readFile(migrationPath, "utf8");
  await getDb().query(sql);
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
