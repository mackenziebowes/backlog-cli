import { Database } from "bun:sqlite";
import { homedir } from "node:os";
import { join } from "node:path";
import type { EntryOutput } from "./types";

export function list() {
	try {
		const dbDir = join(homedir(), "cache");
		const dbPath = join(dbDir, "backlog.sqlite");
		const db = new Database(dbPath);

		const tasks = db
			.query("SELECT * FROM entries ORDER BY id DESC LIMIT 20")
			.all() as EntryOutput[];
		return { ok: true, tasks };
	} catch {
		return { ok: false };
	}
}
