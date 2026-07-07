import { redirect, fail, error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { players, clubs } from '$lib/server/db/schema';
import { eq, asc } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const id = Number(params.id);
	const player = await db.query.players.findFirst({ where: eq(players.id, id) });
	if (!player) throw error(404, 'Player not found');
	const allClubs = await db.query.clubs.findMany({ orderBy: asc(clubs.name) });
	return { player, clubs: allClubs };
};

export const actions: Actions = {
	default: async ({ request, params }) => {
		const id = Number(params.id);
		const formData = await request.formData();
		const name = formData.get('name') as string;
		const slug = formData.get('slug') as string;
		const fideId = formData.get('fideId') as string;
		const rating = Number(formData.get('rating')) || 0;
		const title = formData.get('title') as string;
		const clubIdRaw = formData.get('clubId') as string;
		const clubId = clubIdRaw ? Number(clubIdRaw) : null;
		const photo = formData.get('photo') as string;
		const isTopPlayer = formData.get('isTopPlayer') === 'on';

		if (!name) return fail(400, { error: 'Player name is required' });

		try {
			await db
				.update(players)
				.set({
					name,
					slug,
					fideId: fideId || null,
					rating,
					title: title || null,
					clubId,
					photo: photo || null,
					isTopPlayer,
					updatedAt: new Date()
				})
				.where(eq(players.id, id));
		} catch (err: any) {
			if (err.code === '23505') return fail(400, { error: `Slug "${slug}" already in use.` });
			console.error('UPDATE ERROR:', err);
			return fail(500, { error: 'Something went wrong.' });
		}

		throw redirect(303, '/admin/players');
	}
};
