import { redirect, fail, error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { user, userPermissions } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const targetUser = await db.query.user.findFirst({ where: eq(user.id, params.id) });
	if (!targetUser) throw error(404, 'User not found');

	const permissions = await db.query.userPermissions.findMany({
		where: eq(userPermissions.userId, params.id)
	});

	return { targetUser, currentSections: permissions.map((p) => p.section) };
};

export const actions: Actions = {
	default: async ({ request, params }) => {
		const formData = await request.formData();
		const sections = formData.getAll('sections') as string[];

		await db.delete(userPermissions).where(eq(userPermissions.userId, params.id));

		if (sections.length > 0) {
			await db
				.insert(userPermissions)
				.values(sections.map((section) => ({ userId: params.id, section })));
		}

		throw redirect(303, '/admin/users');
	}
};
