import { desc, eq, notExists, sql } from 'drizzle-orm';
import { db } from './client';
import {
  Dream,
  DreamPreview,
  dreams,
  dreamTags,
  NewDream,
  tags,
  UpdateDream,
} from './schema';

type DreamTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

function deleteUnusedTags(tx: DreamTransaction) {
  tx.delete(tags)
    .where(
      notExists(
        tx
          .select({ tagId: dreamTags.tagId })
          .from(dreamTags)
          .where(eq(dreamTags.tagId, tags.id)),
      ),
    )
    .run();
}

export async function getDreams(): Promise<DreamPreview[]> {
  const rows = await db
    .select({
      dream: {
        id: dreams.id,
        title: dreams.title,
        text: dreams.text,
        createdAt: dreams.createdAt,
      },
      tag: {
        id: tags.id,
        title: tags.title,
        color: tags.color,
        createdAt: tags.createdAt,
      },
    })
    .from(dreams)
    .leftJoin(dreamTags, eq(dreamTags.dreamId, dreams.id))
    .leftJoin(tags, eq(tags.id, dreamTags.tagId))
    .orderBy(desc(dreams.createdAt));

  const dreamsById = new Map<number, DreamPreview>();

  rows.forEach((row) => {
    let dream = dreamsById.get(row.dream.id);

    if (!dream) {
      dream = { ...row.dream, tags: [] };
      dreamsById.set(dream.id, dream);
    }

    if (row.tag) {
      dream.tags.push(row.tag);
    }
  });

  return Array.from(dreamsById.values());
}

export async function getDreamById(
  id: number,
): Promise<(Dream & Pick<DreamPreview, 'tags'>) | null> {
  const rows = await db
    .select({
      dream: {
        id: dreams.id,
        title: dreams.title,
        text: dreams.text,
        createdAt: dreams.createdAt,
        updatedAt: dreams.updatedAt,
      },
      tag: {
        id: tags.id,
        title: tags.title,
        color: tags.color,
        createdAt: tags.createdAt,
      },
    })
    .from(dreams)
    .leftJoin(dreamTags, eq(dreamTags.dreamId, dreams.id))
    .leftJoin(tags, eq(tags.id, dreamTags.tagId))
    .where(eq(dreams.id, id));

  if (rows.length === 0) return null;

  return {
    ...rows[0].dream,
    tags: rows.flatMap((row) => (row.tag ? [row.tag] : [])),
  };
}

export async function insertDream(data: NewDream): Promise<Dream> {
  const now = new Date();
  const { tags: inputTags, ...dreamData } = data;

  return db.transaction((tx) => {
    const dream = tx
      .insert(dreams)
      .values({
        ...dreamData,
        createdAt: now,
        updatedAt: now,
      })
      .returning()
      .all()[0];

    if (!dream) {
      throw new Error('Dream was not inserted.');
    }

    const existingTagsToUpsert = inputTags.flatMap((tag) =>
      tag.id === null
        ? []
        : [
            {
              id: tag.id,
              title: tag.title.trim(),
              color: tag.color,
              createdAt: now,
              updatedAt: now,
            },
          ],
    );

    const newTagsToUpsert = inputTags
      .filter((tag) => tag.id === null)
      .map((tag) => ({
        title: tag.title.trim(),
        color: tag.color,
        createdAt: now,
        updatedAt: now,
      }));

    if (
      existingTagsToUpsert.some((tag) => !tag.title) ||
      newTagsToUpsert.some((tag) => !tag.title)
    ) {
      throw new Error('Tag title cannot be empty.');
    }

    if (existingTagsToUpsert.length > 0) {
      tx.insert(tags)
        .values(existingTagsToUpsert)
        .onConflictDoUpdate({
          target: tags.id,
          set: {
            color: sql.raw(`excluded.${tags.color.name}`),
            updatedAt: now,
          },
          setWhere: sql`${sql.identifier(tags.color.name)} is not excluded.${sql.identifier(
            tags.color.name,
          )}`,
        })
        .run();
    }

    const upsertedTagIds =
      newTagsToUpsert.length === 0
        ? []
        : tx
            .insert(tags)
            .values(newTagsToUpsert)
            .onConflictDoUpdate({
              target: tags.title,
              set: {
                color: sql.raw(`excluded.${tags.color.name}`),
                updatedAt: now,
              },
            })
            .returning({ id: tags.id })
            .all()
            .map((tag) => tag.id);

    const tagIds = [
      ...new Set([
        ...existingTagsToUpsert.map((tag) => tag.id),
        ...upsertedTagIds,
      ]),
    ];

    if (tagIds.length > 0) {
      tx.insert(dreamTags)
        .values(
          tagIds.map((tagId) => ({
            dreamId: dream.id,
            tagId,
          })),
        )
        .run();
    }

    return dream;
  });
}

export async function updateDream({
  title,
  text,
  id,
  tags: inputTags,
}: UpdateDream) {
  const now = new Date();

  return db.transaction((tx) => {
    const dream = tx
      .update(dreams)
      .set({
        title: title,
        text: text,
        updatedAt: now,
      })
      .where(eq(dreams.id, id))
      .returning()
      .all()[0];

    if (!dream) return null;

    const existingTagsToUpsert = inputTags.flatMap((tag) =>
      tag.id === null
        ? []
        : [
            {
              id: tag.id,
              title: tag.title.trim(),
              color: tag.color,
              createdAt: now,
              updatedAt: now,
            },
          ],
    );

    const newTagsToUpsert = inputTags.flatMap((tag) =>
      tag.id !== null
        ? []
        : [
            {
              title: tag.title.trim(),
              color: tag.color,
              createdAt: now,
              updatedAt: now,
            },
          ],
    );

    if (
      existingTagsToUpsert.some((tag) => !tag.title) ||
      newTagsToUpsert.some((tag) => !tag.title)
    ) {
      throw new Error('Tag title cannot be empty.');
    }

    if (existingTagsToUpsert.length > 0) {
      tx.insert(tags)
        .values(existingTagsToUpsert)
        .onConflictDoUpdate({
          target: tags.id,
          set: {
            color: sql.raw(`excluded.${tags.color.name}`),
            updatedAt: now,
          },
          setWhere: sql`${sql.identifier(tags.color.name)} is not excluded.${sql.identifier(
            tags.color.name,
          )}`,
        })
        .run();
    }

    const upsertedTagIds =
      newTagsToUpsert.length === 0
        ? []
        : tx
            .insert(tags)
            .values(newTagsToUpsert)
            .onConflictDoUpdate({
              target: tags.title,
              set: {
                color: sql.raw(`excluded.${tags.color.name}`),
                updatedAt: now,
              },
            })
            .returning({ id: tags.id })
            .all()
            .map((tag) => tag.id);

    const tagIds = [
      ...new Set([
        ...existingTagsToUpsert.map((tag) => tag.id),
        ...upsertedTagIds,
      ]),
    ];

    tx.delete(dreamTags).where(eq(dreamTags.dreamId, id)).run();

    if (tagIds.length > 0) {
      tx.insert(dreamTags)
        .values(tagIds.map((tagId) => ({ dreamId: id, tagId })))
        .run();
    }

    deleteUnusedTags(tx);

    return dream;
  });
}

export async function deleteDream(id: number) {
  return db.transaction((tx) => {
    tx.delete(dreams).where(eq(dreams.id, id)).run();
    deleteUnusedTags(tx);
  });
}
