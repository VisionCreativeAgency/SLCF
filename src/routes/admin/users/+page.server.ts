import { db } from '$lib/server/db';
import { user, userPermissions } from '$lib/server/db/schema';
import { asc, eq } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	const allUsers = await db.query.user.findMany({ orderBy: asc(user.createdAt) });

	const allPermissions = await db.query.userPermissions.findMany();

	const usersWithPermissions = allUsers.map((u) => ({
		...u,
		permissions: allPermissions.filter((p) => p.userId === u.id).map((p) => p.section)
	}));

	return { users: usersWithPermissions };
};

export const actions: Actions = {
	delete: async ({ request, locals }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;
		await db.delete(user).where(eq(user.id, id));
		return { success: true };
	}
};
