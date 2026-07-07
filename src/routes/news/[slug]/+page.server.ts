import { db } from '$lib/server/db';
import { posts } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const post = await db.query.posts.findFirst({
		where: and(eq(posts.slug, params.slug), eq(posts.status, 'published'))
	});

	if (!post) {
		throw error(404, 'Post not found');
	}

	return { post };
};
