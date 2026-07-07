import { redirect, fail, error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { leadership } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const id = Number(params.id);
	const member = await db.query.leadership.findFirst({ where: eq(leadership.id, id) });
	if (!member) throw error(404, 'Member not found');
	return { member };
};

export const actions: Actions = {
	default: async ({ request, params }) => {
		const id = Number(params.id);
		const formData = await request.formData();
		const name = formData.get('name') as string;
		const role = formData.get('role') as string;
		const email = formData.get('email') as string;
		const phone = formData.get('phone') as string;
		const photo = formData.get('photo') as string;
		const bio = formData.get('bio') as string;
		const order = Number(formData.get('order')) || 0;
		const termStart = formData.get('termStart') as string;
		const termEnd = formData.get('termEnd') as string;
		const isCurrent = formData.get('isCurrent') === 'on';

		if (!name || !role) return fail(400, { error: 'Name and role are required' });

		try {
			await db
				.update(leadership)
				.set({
					name,
					role,
					email: email || null,
					phone: phone || null,
					photo: photo || null,
					bio: bio || null,
					order,
					termStart: termStart ? new Date(termStart) : null,
					termEnd: termEnd ? new Date(termEnd) : null,
					isCurrent,
					updatedAt: new Date()
				})
				.where(eq(leadership.id, id));
		} catch (err: any) {
			console.error('UPDATE ERROR:', err);
			return fail(500, { error: 'Something went wrong.' });
		}

		throw redirect(303, '/admin/leadership');
	}
};
