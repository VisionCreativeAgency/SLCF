import { redirect, fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { posts } from '$lib/server/db/schema';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const title = formData.get('title') as string;
		const slug = (formData.get('slug') as string) || title.toLowerCase().replace(/\s+/g, '-');
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
			await db.insert(posts).values({
				title,
				slug,
				excerpt,
				content,
				coverImage: coverImage || null,
				type,
				category,
				featured,
				status,
				publishedAt: status === 'published' ? new Date() : null
			});
		} catch (err: any) {
			if (err.code === '23505') {
				return fail(400, {
					error: `Slug "${slug}" is already in use. Try a different title or slug.`
				});
			}
			console.error('INSERT ERROR:', err);
			return fail(500, { error: 'Something went wrong creating the post.' });
		}

		throw redirect(303, '/admin/posts');
	}
};
