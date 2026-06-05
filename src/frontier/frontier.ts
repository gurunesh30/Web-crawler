import { query } from "../db/client.js";

/**
 * Retrieves the list of unique domains that have at least one pending URL.
 */
export async function getPendingDomains(): Promise<string[]> {
  const res = await query(
    `SELECT DISTINCT domain 
     FROM urls 
     WHERE status = 'PENDING'`
  );
  return res.rows.map((row) => row.domain);
}

/**
 * Retrieves the count of pending URLs bucketed by domain.
 */
export async function getPendingCounts(): Promise<Record<string, number>> {
  const res = await query(
    `SELECT domain, COUNT(*) as count 
     FROM urls 
     WHERE status = 'PENDING' 
     GROUP BY domain`
  );

  const counts: Record<string, number> = {};
  for (const row of res.rows) {
    counts[row.domain] = parseInt(row.count, 10);
  }
  return counts;
}
