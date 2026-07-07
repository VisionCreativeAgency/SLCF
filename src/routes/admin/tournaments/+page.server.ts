import { db } from '$lib/server/db';
import { tournaments } from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	const allTournaments = await db.query.tournaments.findMany({
		orderBy: desc(tournaments.startDate)
	});
	return { tournaments: allTournaments };
};

export const actions: Actions = {
	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = Number(formData.get('id'));
		await db.delete(tournaments).where(eq(tournaments.id, id));
		return { success: true };
	}
};
