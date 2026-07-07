import { redirect, fail, error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { tournaments } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const id = Number(params.id);
	const tournament = await db.query.tournaments.findFirst({ where: eq(tournaments.id, id) });
	if (!tournament) throw error(404, 'Tournament not found');
	return { tournament };
};

export const actions: Actions = {
	default: async ({ request, params }) => {
		const id = Number(params.id);
		const formData = await request.formData();
		const name = formData.get('name') as string;
		const slug = formData.get('slug') as string;
		const description = formData.get('description') as string;
		const location = formData.get('location') as string;
		const startDate = formData.get('startDate') as string;
		const endDate = formData.get('endDate') as string;
		const registrationOpen = formData.get('registrationOpen') === 'on';
		const coverImage = formData.get('coverImage') as string;
		const status = formData.get('status') as string;

		if (!name || !startDate) {
			return fail(400, { error: 'Name and start date are required' });
		}

		try {
			await db
				.update(tournaments)
				.set({
					name,
					slug,
					description,
					location,
					startDate: new Date(startDate),
					endDate: endDate ? new Date(endDate) : null,
					registrationOpen,
					coverImage: coverImage || null,
					status,
					updatedAt: new Date()
				})
				.where(eq(tournaments.id, id));
		} catch (err: any) {
			if (err.code === '23505') {
				return fail(400, { error: `Slug "${slug}" is already in use.` });
			}
			console.error('UPDATE ERROR:', err);
			return fail(500, { error: 'Something went wrong.' });
		}

		throw redirect(303, '/admin/tournaments');
	}
};
