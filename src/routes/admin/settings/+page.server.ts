import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { settings } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	let row = await db.query.settings.findFirst();

	// create the single row if it doesn't exist yet
	if (!row) {
		const inserted = await db.insert(settings).values({}).returning();
		row = inserted[0];
	}

	return { settings: row };
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const id = Number(formData.get('id'));
		const email = formData.get('email') as string;
		const phone = formData.get('phone') as string;
		const address = formData.get('address') as string;
		const city = formData.get('city') as string;
		const facebook = formData.get('facebook') as string;
		const twitter = formData.get('twitter') as string;
		const instagram = formData.get('instagram') as string;
		const youtube = formData.get('youtube') as string;

		try {
			await db
				.update(settings)
				.set({
					email: email || null,
					phone: phone || null,
					address: address || null,
					city: city || null,
					facebook: facebook || null,
					twitter: twitter || null,
					instagram: instagram || null,
					youtube: youtube || null,
					updatedAt: new Date()
				})
				.where(eq(settings.id, id));
		} catch (err: any) {
			console.error('UPDATE ERROR:', err);
			return fail(500, { error: 'Something went wrong saving settings.' });
		}

		return { success: true };
	}
};
