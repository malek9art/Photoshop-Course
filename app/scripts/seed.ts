/**
 * CLI seed script: `npm run seed`
 * Rebuilds/refreshes the local SQLite DB from the SSOT (docs/03 blueprint + content/ tree).
 */
import { seed } from "../src/lib/seed";
import { closeDb } from "../src/lib/db";

const result = seed();
console.log(`Seeded: ${result.stages} stages, ${result.modules} modules, ${result.lessons} lessons + demo users.`);
closeDb();
