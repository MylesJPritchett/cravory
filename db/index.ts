import Database from 'better-sqlite3';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';
import { DrizzleAdapter } from "@auth/drizzle-adapter"

const client = createClient({
  url: "file:sqlite.db", // Path to your SQLite database file
});
const db = drizzle(client);

// Export the Drizzle adapter for NextAuth.js
export const authAdapter = DrizzleAdapter(db);

export default db;
