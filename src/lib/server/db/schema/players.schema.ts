import { pgTable, text, integer, timestamp, boolean, serial } from 'drizzle-orm/pg-core';
import { clubs } from './clubs.schema';

export const players = pgTable('players', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	slug: text('slug').notNull().unique(),
	fideId: text('fide_id'),
	rating: integer('rating').notNull().default(0),
	title: text('title'), // 'GM' | 'IM' | 'FM' | 'CM' | null
	clubId: integer('club_id').references(() => clubs.id, { onDelete: 'set null' }),
	photo: text('photo'),
	isTopPlayer: boolean('is_top_player').notNull().default(false),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});
