import { pgTable, text, timestamp, serial } from 'drizzle-orm/pg-core';

export const settings = pgTable('settings', {
	id: serial('id').primaryKey(), // always row id=1, single row
	email: text('email'),
	phone: text('phone'),
	address: text('address'),
	city: text('city'),
	facebook: text('facebook'),
	twitter: text('twitter'),
	instagram: text('instagram'),
	youtube: text('youtube'),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});
