import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';
import { DrizzleAdapter } from "@auth/drizzle-adapter"

const sqlite = new Database('sqlite.db');
const db = drizzle(sqlite, { schema });

// Export the Drizzle adapter for NextAuth.js
export const authAdapter = DrizzleAdapter(db);

export default db;
