import { pool } from "./client.js";

async function clearDatabase() {
  console.log("Clearing database...");
  try {
    // Truncate all crawler tables and reset the auto-increment IDs
    await pool.query("TRUNCATE TABLE links, crawled_pages, urls, domain_stats RESTART IDENTITY CASCADE;");
    console.log("Database cleared successfully.");
  } catch (error) {
    console.error("Error clearing database:", error);
  } finally {
    await pool.end();
  }
}

clearDatabase();
