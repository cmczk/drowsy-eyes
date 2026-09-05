import type { SQLiteDatabase } from 'expo-sqlite';

const DATABASE_VERSION = 1;

export async function migrateDatabase(db: SQLiteDatabase) {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;  
  `);

  const result = await db.getFirstAsync<{ user_version: number }>(
    'PRAGMA user_version',
  );

  const currentVersion = result?.user_version ?? 0;

  if (currentVersion >= DATABASE_VERSION) return;

  await db.withTransactionAsync(async () => {
    if (currentVersion < 1) {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS dreams(
            id INTEGER PRIMARY KEY NOT NULL
          , title TEXT NOT NULL
          , text TEXT NOT NULL DEFAULT ''
          , created_at INTEGER NOT NULL
          , updated_at INTEGER NOT NULL
        );

        CREATE INDEX IF NOT EXISTS idx_dreams_created_at
          ON dreams(created_at DESC);
      `);
    }

    await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
  });
}
