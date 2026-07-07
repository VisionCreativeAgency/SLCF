import { redirect, fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { tournaments } from '$lib/server/db/schema';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name') as string;
		const slug = (formData.get('slug') as string) || name.toLowerCase().replace(/\s+/g, '-');
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
			await db.insert(tournaments).values({
				name,
				slug,
				description,
				location,
				startDate: new Date(startDate),
				endDate: endDate ? new Date(endDate) : null,
				registrationOpen,
				coverImage: coverImage || null,
				status
			});
		} catch (err: any) {
			if (err.code === '23505') {
				return fail(400, { error: `Slug "${slug}" is already in use.` });
			}
			console.error('INSERT ERROR:', err);
			return fail(500, { error: 'Something went wrong.' });
		}

		throw redirect(303, '/admin/tournaments');
	}
};
