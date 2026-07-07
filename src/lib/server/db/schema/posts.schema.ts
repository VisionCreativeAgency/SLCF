import { pgTable, text, timestamp, serial, boolean } from 'drizzle-orm/pg-core';

export const posts = pgTable('posts', {
	id: serial('id').primaryKey(),
	title: text('title').notNull(),
	slug: text('slug').notNull().unique(),
	excerpt: text('excerpt'),
	content: text('content').notNull(),
	coverImage: text('cover_image'),
	type: text('type').notNull().default('blog'), // 'blog' | 'news'
	category: text('category').notNull().default('Federation News'),
	featured: boolean('featured').notNull().default(false),
	status: text('status').notNull().default('draft'), // 'draft' | 'published'
	publishedAt: timestamp('published_at'),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});
