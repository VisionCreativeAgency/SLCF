import { db } from '$lib/server/db';
import { posts, tournaments, players, leadership, clubs, settings } from '$lib/server/db/schema';
import { eq, desc, asc, gte } from 'drizzle-orm';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	const [latestPosts, upcomingTournaments, topPlayers, currentLeadership, allClubs, siteSettings] =
		await Promise.all([
			db.query.posts.findMany({
				where: eq(posts.status, 'published'),
				orderBy: desc(posts.publishedAt),
				limit: 6
			}),

			db.query.tournaments.findMany({
				where: gte(tournaments.startDate, new Date()),
				orderBy: asc(tournaments.startDate),
				limit: 6
			}),

			db.query.players.findMany({
				where: eq(players.isTopPlayer, true),
				orderBy: desc(players.rating),
				limit: 10,
				with: { club: true }
			}),

			db.query.leadership.findMany({
				where: eq(leadership.isCurrent, true),
				orderBy: asc(leadership.order)
			}),

			db.query.clubs.findMany({
				orderBy: asc(clubs.name)
			}),

			db.query.settings.findFirst()
		]);

	return {
		latestPosts,
		upcomingTournaments,
		topPlayers,
		currentLeadership,
		clubs: allClubs,
		settings: siteSettings ?? null
	};
};
