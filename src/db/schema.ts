import {
  index,
  integer,
  primaryKey,
  sqliteTable,
  text,
} from 'drizzle-orm/sqlite-core';

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

export const tags = sqliteTable('tags', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull().unique(),
  color: text('color'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
});

export const dreamTags = sqliteTable(
  'dream_tags',
  {
    dreamId: integer('dream_id')
      .references(() => dreams.id, { onDelete: 'cascade' })
      .notNull(),
    tagId: integer('tag_id')
      .references(() => tags.id, { onDelete: 'cascade' })
      .notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.dreamId, table.tagId] }),
    index('idx_dream_tags_tag_id').on(table.tagId),
  ],
);

export type Tag = typeof tags.$inferSelect;
export type NewTag = Pick<typeof tags.$inferInsert, 'title' | 'color'>;
export type TagPreview = Pick<Tag, 'id' | 'title' | 'color' | 'createdAt'>;

export type Dream = typeof dreams.$inferSelect;
export type NewDream = Pick<typeof dreams.$inferInsert, 'title' | 'text'>;
export type UpdateDream = NewDream & Pick<Dream, 'id'>;
export type DreamPreview = Pick<Dream, 'id' | 'title' | 'createdAt'> & {
  tags: TagPreview[];
};
