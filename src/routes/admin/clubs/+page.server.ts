import { db } from '$lib/server/db';
import { clubs } from '$lib/server/db/schema';
import { asc, eq } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	const allClubs = await db.query.clubs.findMany({ orderBy: asc(clubs.name) });
	return { clubs: allClubs };
};

export const actions: Actions = {
	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = Number(formData.get('id'));
		await db.delete(clubs).where(eq(clubs.id, id));
		return { success: true };
	}
};
