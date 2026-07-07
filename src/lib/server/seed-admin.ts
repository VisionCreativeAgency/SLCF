import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import * as schema from './db/schema';
import { eq } from 'drizzle-orm';

const client = postgres(process.env.DATABASE_URL!, { prepare: false });
const db = drizzle(client, { schema });

const auth = betterAuth({
	database: drizzleAdapter(db, { provider: 'pg' }),
	secret: process.env.BETTER_AUTH_SECRET!,
	baseURL: process.env.BETTER_AUTH_URL!,
	emailAndPassword: { enabled: true },
	user: {
		additionalFields: {
			role: { type: 'string', defaultValue: 'admin', input: false }
		}
	}
});

async function seedAdmin() {
	const email = process.env.SEED_ADMIN_EMAIL!;
	const password = process.env.SEED_ADMIN_PASSWORD!;

	const existing = await db.query.user.findFirst({ where: eq(schema.user.email, email) });
	if (existing) {
		console.log('Admin already exists:', email);
		process.exit(0);
	}

	const result = await auth.api.signUpEmail({
		body: { email, password, name: 'mohamed amin' }
	});

	if (!result.user) {
		console.error('Failed to create admin');
		process.exit(1);
	}

	await db
		.update(schema.user)
		.set({ role: 'super_admin' })
		.where(eq(schema.user.id, result.user.id));

	console.log('✅ Super admin created:', email);
	process.exit(0);
}

seedAdmin().catch((err) => {
	console.error(err);
	process.exit(1);
});
