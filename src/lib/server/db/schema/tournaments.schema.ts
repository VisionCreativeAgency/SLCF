import { pgTable, text, integer, timestamp, boolean, serial, real } from 'drizzle-orm/pg-core';
import { players } from './players.schema';

export const tournaments = pgTable('tournaments', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	slug: text('slug').notNull().unique(),
	description: text('description'),
	location: text('location'),
	startDate: timestamp('start_date').notNull(),
	endDate: timestamp('end_date'),
	registrationOpen: boolean('registration_open').notNull().default(true),
	coverImage: text('cover_image'),
	status: text('status').notNull().default('upcoming'), // 'upcoming' | 'ongoing' | 'completed'
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const tournamentResults = pgTable('tournament_results', {
	id: serial('id').primaryKey(),
	tournamentId: integer('tournament_id')
		.notNull()
		.references(() => tournaments.id, { onDelete: 'cascade' }),
	playerId: integer('player_id')
		.notNull()
		.references(() => players.id, { onDelete: 'cascade' }),
	rank: integer('rank'),
	points: real('points').notNull().default(0),
	wins: integer('wins').notNull().default(0),
	draws: integer('draws').notNull().default(0),
	losses: integer('losses').notNull().default(0),
	tiebreak: real('tiebreak'),
	createdAt: timestamp('created_at').notNull().defaultNow()
});
