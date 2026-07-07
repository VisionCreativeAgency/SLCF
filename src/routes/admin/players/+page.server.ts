import { db } from '$lib/server/db';
import { players } from '$lib/server/db/schema';
import { asc, eq } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	const allPlayers = await db.query.players.findMany({
		orderBy: asc(players.name),
		with: { club: true }
	});
	return { players: allPlayers };
};

export const actions: Actions = {
	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = Number(formData.get('id'));
		await db.delete(players).where(eq(players.id, id));
		return { success: true };
	}
};
