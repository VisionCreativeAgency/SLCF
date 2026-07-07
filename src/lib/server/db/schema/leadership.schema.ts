import { pgTable, text, integer, timestamp, boolean, serial } from 'drizzle-orm/pg-core';

export const leadership = pgTable('leadership', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	role: text('role').notNull(), // e.g. 'President', 'Secretary'
	email: text('email'),
	phone: text('phone'),
	photo: text('photo'),
	bio: text('bio'),
	order: integer('order').notNull().default(0),
	termStart: timestamp('term_start'),
	termEnd: timestamp('term_end'), // null = currently serving
	isCurrent: boolean('is_current').notNull().default(true),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});
