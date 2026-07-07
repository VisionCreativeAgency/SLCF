import { redirect, fail, error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { clubs } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const id = Number(params.id);
	const club = await db.query.clubs.findFirst({ where: eq(clubs.id, id) });
	if (!club) throw error(404, 'Club not found');
	return { club };
};

export const actions: Actions = {
	default: async ({ request, params }) => {
		const id = Number(params.id);
		const formData = await request.formData();
		const name = formData.get('name') as string;
		const slug = formData.get('slug') as string;
		const description = formData.get('description') as string;
		const logo = formData.get('logo') as string;
		const location = formData.get('location') as string;
		const contactEmail = formData.get('contactEmail') as string;
		const contactPhone = formData.get('contactPhone') as string;

		if (!name) return fail(400, { error: 'Club name is required' });

		try {
			await db
				.update(clubs)
				.set({
					name,
					slug,
					description,
					logo: logo || null,
					location,
					contactEmail,
					contactPhone,
					updatedAt: new Date()
				})
				.where(eq(clubs.id, id));
		} catch (err: any) {
			if (err.code === '23505') return fail(400, { error: `Slug "${slug}" already in use.` });
			console.error('UPDATE ERROR:', err);
			return fail(500, { error: 'Something went wrong.' });
		}

		throw redirect(303, '/admin/clubs');
	}
};
