import { redirect } from '@sveltejs/kit';
import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { userPermissions } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ request }) => {
	const session = await auth.api.getSession({ headers: request.headers });

	if (!session) {
		throw redirect(303, '/login');
	}

	let permissions: string[] = [];

	if (session.user.role !== 'super_admin') {
		const rows = await db.query.userPermissions.findMany({
			where: eq(userPermissions.userId, session.user.id)
		});
		permissions = rows.map((r) => r.section);
	}

	return {
		user: session.user,
		permissions
	};
};
