import { desc, eq } from 'drizzle-orm';
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

export async function getDreams(): Promise<DreamPreview[]> {
  const rows = await db
    .select({
      dream: {
        id: dreams.id,
        title: dreams.title,
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

export async function getDreamById(id: number): Promise<Dream | null> {
  const [dream] = await db
    .select()
    .from(dreams)
    .where(eq(dreams.id, id))
    .limit(1);

  return dream ?? null;
}

export async function insertDream(data: NewDream): Promise<Dream> {
  const now = new Date();

  const [dream] = await db
    .insert(dreams)
    .values({
      ...data,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  if (!dream) throw new Error('Dream was not inseted.');

  return dream;
}

export async function updateDream({ title, text, id }: UpdateDream) {
  const [dream] = await db
    .update(dreams)
    .set({
      title: title,
      text: text,
      updatedAt: new Date(),
    })
    .where(eq(dreams.id, id))
    .returning();

  return dream ?? null;
}

export async function deleteDream(id: number) {
  await db.delete(dreams).where(eq(dreams.id, id));
}
