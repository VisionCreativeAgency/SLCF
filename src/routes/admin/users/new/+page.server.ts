import { redirect, fail } from '@sveltejs/kit';
import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { userPermissions } from '$lib/server/db/schema';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name') as string;
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const sections = formData.getAll('sections') as string[];

		if (!name || !email || !password) {
			return fail(400, { error: 'Name, email, and password are required' });
		}
		if (password.length < 8) {
			return fail(400, { error: 'Password must be at least 8 characters' });
		}

		let newUserId: string;

		try {
			const result = await auth.api.signUpEmail({
				body: { email, password, name }
			});

			if (!result.user) {
				return fail(500, { error: 'Failed to create user' });
			}

			newUserId = result.user.id;
		} catch (err: any) {
			if (err.message?.includes('already exists') || err.status === 422) {
				return fail(400, { error: 'A user with this email already exists.' });
			}
			console.error('CREATE USER ERROR:', err);
			return fail(500, { error: 'Something went wrong creating the user.' });
		}

		if (sections.length > 0) {
			await db
				.insert(userPermissions)
				.values(sections.map((section) => ({ userId: newUserId, section })));
		}

		throw redirect(303, '/admin/users');
	}
};
