import { redirect, fail, error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { posts } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const id = Number(params.id);
	const post = await db.query.posts.findFirst({ where: eq(posts.id, id) });

	if (!post) {
		throw error(404, 'Post not found');
	}

	return { post };
};

export const actions: Actions = {
	default: async ({ request, params }) => {
		const id = Number(params.id);
		const formData = await request.formData();
		const title = formData.get('title') as string;
		const slug = formData.get('slug') as string;
		const excerpt = formData.get('excerpt') as string;
		const content = formData.get('content') as string;
		const coverImage = formData.get('coverImage') as string;
		const type = formData.get('type') as string;
		const category = (formData.get('category') as string) || 'Federation News';
		const featured = formData.get('featured') === 'on';
		const status = formData.get('status') as string;

		if (!title || !content) {
			return fail(400, { error: 'Title and content are required' });
		}

		try {
			await db
				.update(posts)
				.set({
					title,
					slug,
					excerpt,
					content,
					coverImage: coverImage || null,
					type,
					category,
					featured,
					status,
					publishedAt: status === 'published' ? new Date() : null,
					updatedAt: new Date()
				})
				.where(eq(posts.id, id));
		} catch (err: any) {
			if (err.code === '23505') {
				return fail(400, { error: `Slug "${slug}" is already in use by another post.` });
			}
			console.error('UPDATE ERROR:', err);
			return fail(500, { error: 'Something went wrong updating the post.' });
		}

		throw redirect(303, '/admin/posts');
	}
};
