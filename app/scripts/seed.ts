/** CLI seed script: `npm run seed` (run `npm run migrate` first). */
import { seed } from "../src/lib/seed";
import { closeDb } from "../src/lib/db";

async function main() {
  const result = await seed();
  console.log(`Seeded: ${result.stages} stages, ${result.modules} modules, ${result.lessons} lessons + demo users.`);
}

main()
  .catch((error: unknown) => { console.error("Seed failed:", error); process.exitCode = 1; })
  .finally(async () => { await closeDb(); });
