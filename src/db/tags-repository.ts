import { db } from './client';
import { TagPreview, tags } from './schema';

export async function getTags(): Promise<TagPreview[]> {
  return db
    .select({
      id: tags.id,
      title: tags.title,
      color: tags.color,
      createdAt: tags.createdAt,
    })
    .from(tags)
    .orderBy(tags.createdAt);
}
