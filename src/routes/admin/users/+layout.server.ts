import { redirect } from '@sveltejs/kit';
import { auth } from '$lib/server/auth';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ request }) => {
	const session = await auth.api.getSession({ headers: request.headers });

	if (!session || session.user.role !== 'super_admin') {
		throw redirect(303, '/admin');
	}

	return {};
};
