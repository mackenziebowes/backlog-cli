import { Database } from "bun:sqlite";
import { mkdirSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

export function makedb() {
	// Compute global cache path
	const dbDir = join(homedir(), "cache");
	const dbPath = join(dbDir, "backlog.sqlite");

	// Ensure directory exists
	if (!existsSync(dbDir)) {
		mkdirSync(dbDir, { recursive: true });
	}

	// Open SQLite database
	const db = new Database(dbPath);

	// Create table
	db.run(`
  CREATE TABLE IF NOT EXISTS entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    title TEXT NOT NULL,
    project_group TEXT NOT NULL DEFAULT 'uncategorized',
    body TEXT,
    CONSTRAINT updated_at_trigger CHECK (updated_at = CURRENT_TIMESTAMP)
  );
`);

	db.exec(`
  CREATE TRIGGER IF NOT EXISTS update_updated_at
  AFTER UPDATE ON entries
  BEGIN
    UPDATE entries
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.id;
  END;
`);
}
