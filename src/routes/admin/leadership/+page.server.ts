import { db } from '$lib/server/db';
import { leadership } from '$lib/server/db/schema';
import { asc, eq } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	const all = await db.query.leadership.findMany({ orderBy: asc(leadership.order) });
	return { leadership: all };
};

export const actions: Actions = {
	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = Number(formData.get('id'));
		await db.delete(leadership).where(eq(leadership.id, id));
		return { success: true };
	}
};
