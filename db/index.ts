import * as schema from './schema';
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

export const authAdapter = DrizzleAdapter(db);
export default db;
