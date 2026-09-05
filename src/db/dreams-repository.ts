import { Dream, DreamPreview, NewDream, UpdateDream } from '@/models/dreams';
import { SQLiteDatabase } from 'expo-sqlite';

export async function getDreams(db: SQLiteDatabase): Promise<DreamPreview[]> {
  return db.getAllAsync<DreamPreview>(`
    SELECT
        id
      , title
      , created_at AS createdAt
    FROM
      dreams
    ORDER BY
      created_at DESC;
  `);
}

export async function getDreamById(
  db: SQLiteDatabase,
  id: number,
): Promise<Dream | null> {
  return db.getFirstAsync<Dream>(
    `
    SELECT
        id
      , title
      , text
      , created_at AS createdAt
      , updated_at AS updatedAt  
    FROM
      dreams
    WHERE
      id = $id
    LIMIT
      1;
  `,
    { $id: id },
  );
}

export async function insertDream(
  db: SQLiteDatabase,
  data: NewDream,
): Promise<Dream> {
  const now = Date.now();

  const result = await db.runAsync(
    `INSERT INTO dreams (title,  text, created_at, updated_at)
    VALUES ($title, $text, $createdAt, $updatedAt)`,
    {
      $title: data.title,
      $text: data.text,
      $createdAt: now,
      $updatedAt: now,
    },
  );

  return {
    id: result.lastInsertRowId,
    title: data.title,
    text: data.text,
    createdAt: now,
    updatedAt: now,
  };
}

export async function updateDream(
  db: SQLiteDatabase,
  { title, text, id }: UpdateDream,
) {
  await db.runAsync(
    `UPDATE dreams SET title = $title, text = $text, updated_at = $updatedAt WHERE id = $id;`,
    { $title: title, $text: text, $updatedAt: Date.now(), $id: id },
  );
}

export async function deleteDream(db: SQLiteDatabase, id: number) {
  await db.runAsync(`DELETE FROM dreams WHERE id = $id`, { $id: id });
}
