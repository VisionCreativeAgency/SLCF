import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '$env/dynamic/private';
import * as schema from './schema';

const client = postgres(env.DATABASE_URL, { prepare: false }); // Supabase pooler requires prepare: false
export const db = drizzle(client, { schema });
