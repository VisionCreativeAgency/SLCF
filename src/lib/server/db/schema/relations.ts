import { relations } from 'drizzle-orm';
import { tournamentResults } from './tournaments.schema';
import { players } from './players.schema';
import { clubs } from './clubs.schema';

export const tournamentResultsRelations = relations(tournamentResults, ({ one }) => ({
	player: one(players, {
		fields: [tournamentResults.playerId],
		references: [players.id]
	})
}));

export const playersRelations = relations(players, ({ one }) => ({
	club: one(clubs, {
		fields: [players.clubId],
		references: [clubs.id]
	})
}));
