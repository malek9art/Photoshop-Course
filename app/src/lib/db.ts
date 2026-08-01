/** PostgreSQL data layer backed by a reusable node-postgres pool. */
import { AsyncLocalStorage } from "node:async_hooks";
import { Pool, type PoolClient, type QueryResultRow } from "pg";

export type Row = Record<string, unknown>;
type SqlValue = string | number | boolean | null | Date | Buffer | readonly string[];
const globalForDb = globalThis as unknown as { acaPool?: Pool };
const transactionContext = new AsyncLocalStorage<PoolClient>();

/** Lazily creates a pool so Next.js can build without deployment secrets. */
export function getDb(): Pool {
  if (globalForDb.acaPool) return globalForDb.acaPool;
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is required. Set it in the Vercel environment or app/.env.local.");
  const isProduction = process.env.NODE_ENV === "production";
  const usesLocalhost = /(?:localhost|127\.0\.0\.1|\[::1\])/.test(connectionString);
  const ssl = process.env.DATABASE_SSL === "false" || (!isProduction && usesLocalhost)
    ? false
    : { rejectUnauthorized: process.env.DATABASE_SSL_REJECT_UNAUTHORIZED === "true" };
  globalForDb.acaPool = new Pool({
    connectionString,
    ssl,
    max: Number(process.env.DATABASE_POOL_MAX ?? 5),
    idleTimeoutMillis: Number(process.env.DATABASE_POOL_IDLE_TIMEOUT_MS ?? 30_000),
    connectionTimeoutMillis: Number(process.env.DATABASE_CONNECT_TIMEOUT_MS ?? 10_000),
  });
  return globalForDb.acaPool;
}

function queryable(): Pool | PoolClient { return transactionContext.getStore() ?? getDb(); }
export async function closeDb(): Promise<void> { if (globalForDb.acaPool) { await globalForDb.acaPool.end(); delete globalForDb.acaPool; } }
export async function all<T extends QueryResultRow = Row>(sql: string, ...params: SqlValue[]): Promise<T[]> { return (await queryable().query<T>(sql, params)).rows; }
export async function get<T extends QueryResultRow = Row>(sql: string, ...params: SqlValue[]): Promise<T | undefined> { return (await queryable().query<T>(sql, params)).rows[0]; }
export async function run(sql: string, ...params: SqlValue[]): Promise<{ rowCount: number }> { const result = await queryable().query(sql, params); return { rowCount: result.rowCount ?? 0 }; }
export async function transaction<T>(fn: () => Promise<T>): Promise<T> {
  const client = await getDb().connect();
  try { await client.query("BEGIN"); const result = await transactionContext.run(client, fn); await client.query("COMMIT"); return result; }
  catch (error) { await client.query("ROLLBACK"); throw error; }
  finally { client.release(); }
}
