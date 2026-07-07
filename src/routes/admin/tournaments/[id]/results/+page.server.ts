import { db } from '$lib/server/db';
import { tournamentResults, players, tournaments } from '$lib/server/db/schema';
import { eq, asc, and, ne } from 'drizzle-orm';
import { fail, error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const tournamentId = Number(params.id);

	const tournament = await db.query.tournaments.findFirst({
		where: eq(tournaments.id, tournamentId)
	});
	if (!tournament) throw error(404, 'Tournament not found');

	const results = await db.query.tournamentResults.findMany({
		where: eq(tournamentResults.tournamentId, tournamentId),
		orderBy: asc(tournamentResults.rank),
		with: { player: true }
	});

	const allPlayers = await db.query.players.findMany({ orderBy: asc(players.name) });

	return { tournament, results, allPlayers };
};

export const actions: Actions = {
	addPlayer: async ({ request, params }) => {
		const tournamentId = Number(params.id);
		const formData = await request.formData();
		const playerId = Number(formData.get('playerId'));

		if (!playerId) return fail(400, { error: 'Select a player' });

		const existing = await db.query.tournamentResults.findFirst({
			where: and(
				eq(tournamentResults.tournamentId, tournamentId),
				eq(tournamentResults.playerId, playerId)
			)
		});
		if (existing) return fail(400, { error: 'Player already added to this tournament' });

		await db.insert(tournamentResults).values({ tournamentId, playerId });
		return { success: true };
	},

	updateResult: async ({ request }) => {
		const formData = await request.formData();
		const id = Number(formData.get('id'));
		const rank = formData.get('rank') ? Number(formData.get('rank')) : null;
		const points = Number(formData.get('points')) || 0;
		const wins = Number(formData.get('wins')) || 0;
		const draws = Number(formData.get('draws')) || 0;
		const losses = Number(formData.get('losses')) || 0;

		await db
			.update(tournamentResults)
			.set({ rank, points, wins, draws, losses })
			.where(eq(tournamentResults.id, id));
		return { success: true };
	},

	removeResult: async ({ request }) => {
		const formData = await request.formData();
		const id = Number(formData.get('id'));
		await db.delete(tournamentResults).where(eq(tournamentResults.id, id));
		return { success: true };
	}
};
