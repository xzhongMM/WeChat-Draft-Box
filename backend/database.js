import Database from "better-sqlite3";

const db = new Database("drafts.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS drafts (
    id TEXT PRIMARY KEY,
    caption TEXT NOT NULL,
    images TEXT NOT NULL,
    createdAt INTEGER NOT NULL,
    updatedAt INTEGER NOT NULL
  )
`);

export default db;