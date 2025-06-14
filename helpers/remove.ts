import { Database } from "bun:sqlite";
import { homedir } from "node:os";
import { join } from "node:path";

interface removeArgs {
	id: number;
}

export function remove(args: removeArgs) {
	try {
		const dbDir = join(homedir(), "cache");
		const dbPath = join(dbDir, "backlog.sqlite");
		const db = new Database(dbPath);

		const { id } = args;

		db.run("DELETE FROM entries WHERE id = ?", [id]);

		return { ok: true };
	} catch {
		return { ok: false };
	}
}
