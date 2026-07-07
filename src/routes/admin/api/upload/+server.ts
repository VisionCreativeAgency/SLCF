import { json } from '@sveltejs/kit';
import { auth } from '$lib/server/auth';
import { uploadToR2 } from '$lib/server/r2';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const session = await auth.api.getSession({ headers: request.headers });
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const formData = await request.formData();
	const file = formData.get('file') as File;

	if (!file) return json({ error: 'No file provided' }, { status: 400 });

	const key = `uploads/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
	const url = await uploadToR2(file, key);

	return json({ url });
};
