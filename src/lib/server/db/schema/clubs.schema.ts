import { pgTable, text, timestamp, serial } from 'drizzle-orm/pg-core';

export const clubs = pgTable('clubs', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	slug: text('slug').notNull().unique(),
	description: text('description'),
	logo: text('logo'),
	location: text('location'),
	contactEmail: text('contact_email'),
	contactPhone: text('contact_phone'),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});
