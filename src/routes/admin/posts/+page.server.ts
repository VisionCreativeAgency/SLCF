import { db } from '$lib/server/db';
import { posts } from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	const allPosts = await db.query.posts.findMany({ orderBy: desc(posts.createdAt) });
	return { posts: allPosts };
};

export const actions: Actions = {
	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = Number(formData.get('id'));
		await db.delete(posts).where(eq(posts.id, id));
		return { success: true };
	}
};
