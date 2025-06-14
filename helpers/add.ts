import { Database } from "bun:sqlite";
import { homedir } from "node:os";
import { join } from "node:path";

interface addArgs {
	title: string;
	project_group?: string;
	body: string;
}

export function add(args: addArgs) {
	try {
		const dbDir = join(homedir(), "cache");
		const dbPath = join(dbDir, "backlog.sqlite");
		const db = new Database(dbPath);

		const { title, project_group, body } = args;

		db.run(
			"INSERT INTO entries (title, project_group, body) VALUES (?, ?, ?)",
			[title, project_group || null, body] // Pass values as an array
		);

		return { ok: true };
	} catch {
		return { ok: false };
	}
}
