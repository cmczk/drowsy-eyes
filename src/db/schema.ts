import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const dreams = sqliteTable(
  'dreams',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),

    title: text('title').notNull(),
    text: text('text').notNull(),

    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => [index('idx_dreams_created_at').on(table.createdAt)],
);

export type Dream = typeof dreams.$inferSelect;

export type NewDream = Pick<typeof dreams.$inferInsert, 'title' | 'text'>;

export type UpdateDream = NewDream & Pick<Dream, 'id'>;

export type DreamPreview = Pick<Dream, 'id' | 'title' | 'createdAt'>;
