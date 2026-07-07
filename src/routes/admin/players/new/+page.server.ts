import { redirect, fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { players, clubs } from '$lib/server/db/schema';
import { asc } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	const allClubs = await db.query.clubs.findMany({ orderBy: asc(clubs.name) });
	return { clubs: allClubs };
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name') as string;
		const slug = (formData.get('slug') as string) || name.toLowerCase().replace(/\s+/g, '-');
		const fideId = formData.get('fideId') as string;
		const rating = Number(formData.get('rating')) || 0;
		const title = formData.get('title') as string;
		const clubIdRaw = formData.get('clubId') as string;
		const clubId = clubIdRaw ? Number(clubIdRaw) : null;
		const photo = formData.get('photo') as string;
		const isTopPlayer = formData.get('isTopPlayer') === 'on';

		if (!name) return fail(400, { error: 'Player name is required' });

		try {
			await db.insert(players).values({
				name,
				slug,
				fideId: fideId || null,
				rating,
				title: title || null,
				clubId,
				photo: photo || null,
				isTopPlayer
			});
		} catch (err: any) {
			if (err.code === '23505') return fail(400, { error: `Slug "${slug}" already in use.` });
			console.error('INSERT ERROR:', err);
			return fail(500, { error: 'Something went wrong.' });
		}

		throw redirect(303, '/admin/players');
	}
};
