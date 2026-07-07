import { redirect, fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { clubs } from '$lib/server/db/schema';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name') as string;
		const slug = (formData.get('slug') as string) || name.toLowerCase().replace(/\s+/g, '-');
		const description = formData.get('description') as string;
		const logo = formData.get('logo') as string;
		const location = formData.get('location') as string;
		const contactEmail = formData.get('contactEmail') as string;
		const contactPhone = formData.get('contactPhone') as string;

		if (!name) return fail(400, { error: 'Club name is required' });

		try {
			await db.insert(clubs).values({
				name,
				slug,
				description,
				logo: logo || null,
				location,
				contactEmail,
				contactPhone
			});
		} catch (err: any) {
			if (err.code === '23505') return fail(400, { error: `Slug "${slug}" already in use.` });
			console.error('INSERT ERROR:', err);
			return fail(500, { error: 'Something went wrong.' });
		}

		throw redirect(303, '/admin/clubs');
	}
};
