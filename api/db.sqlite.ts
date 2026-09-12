import { SQLiteDatabase } from "expo-sqlite";

export async function initDB(db: SQLiteDatabase) {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS favorite (
      id TEXT PRIMARY KEY NOT NULL,
      hymn_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS last_read (
      id TEXT PRIMARY KEY NOT NULL,
      hymn_id TEXT NOT NULL,
      read_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);
}

export function Controller(db: SQLiteDatabase) {

  // Favorites
  const addNewFavorite = async (hymnId: string) => {
    const now = new Date().toISOString();

    const result = await db.runAsync(
      ` INSERT OR IGNORE INTO favorite ( id, hymn_id,  created_at, updated_at ) VALUES (?, ?, ?, ?) `,
      now, hymnId, now, now
    );

    return result.changes;
  };

  const removeFavorite = async (hymnId: string) => {
    await db.runAsync(
      ` DELETE FROM favorite WHERE hymn_id = ? `,
      hymnId
    );
  };

  const getFavorites = async () => {
    return await db.getAllAsync(
      ` SELECT * FROM favorite ORDER BY created_at DESC `
    );
  };

  // Last Reads
  const addNewLastRead = async (hymnId: string) => {
    const now = new Date().toISOString();

    await db.runAsync(
      ` INSERT OR IGNORE INTO last_read ( id, hymn_id, read_at, updated_at ) VALUES (?, ?, ?, ?) `,
      now, hymnId, now, now
    );
  };

  const removeLastRead = async (hymnId: string) => {
    await db.runAsync(
      ` DELETE FROM last_read WHERE hymn_id = ? `,
      hymnId
    );
  };

  const getLastReads = () => {
    return db.getAllAsync(
      ` SELECT * FROM last_read ORDER BY read_at DESC `
    );
  }

  const updateLastRead = async (hymnId: string) => {
    await db.runAsync(
      ` UPDATE last_read SET read_at = ? WHERE hymn_id = ? `,
      new Date().toISOString(), hymnId
    );
  };

  return {
    addNewFavorite,
    removeFavorite,
    getFavorites,
    addNewLastRead,
    removeLastRead,
    getLastReads,
    updateLastRead,
  };
}