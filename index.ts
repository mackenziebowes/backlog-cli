#!/usr/bin/env bun

import * as p from "@clack/prompts";
import { makedb } from "./helpers/make-db";
import { add } from "./helpers/add";
import { list } from "./helpers/list";
import { remove } from "./helpers/remove";
async function main() {
	p.intro("Your Backlog");
	const { action } = await p.group(
		{
			action: () =>
				p.select({
					options: [
						{
							value: "init",
							label: "Create your backlog db",
						},
						{
							value: "add",
							label: "Add a task",
						},
						{
							value: "list",
							label: "List tasks",
						},
					],
					message: "What would you like to do?",
				}),
		},
		{
			onCancel: () => {
				p.cancel("Operation cancelled.");
				process.exit(0);
			},
		}
	);
	// -- Init Branch ----------
	if (action == "init") {
		p.log.step("Creating your db...");
		makedb();
		p.outro("Created!");
		process.exit(0);
	}
	if (action == "add") {
		p.log.step("Adding your thing...");
		const { title, body, project_group } = await p.group(
			{
				title: () =>
					p.text({
						message: "Enter the task title:",
						placeholder: "e.g., Fix login bug",
						validate: (value) => (value ? undefined : "Title is required."),
					}),
				body: () =>
					p.text({
						message: "Enter the task description:",
						placeholder: "e.g., Users cannot log in with valid credentials",
						validate: (value) => (value ? undefined : "Body is required."),
					}),
				project_group: () =>
					p.text({
						message: "Enter the product group (optional):",
						placeholder: "e.g., Authentication",
					}),
			},
			{
				onCancel: () => {
					p.cancel("Operation cancelled.");
					process.exit(0);
				},
			}
		);

		add({ title, body, project_group });
		p.outro("Task added successfully!");
		process.exit(0);
	}
	if (action == "list") {
		p.log.step("Accessing your backlog...");
		const res = list();
		if (res.ok && res.tasks) {
			res.tasks.map((entry) => {
				Object.entries(entry).map(([k, v]) => {
					if (k == "created_at" || typeof v == "undefined") {
						// no op
					} else {
						console.log(`[${k}]: ${v}`);
					}
				});
			});
		}
	}
	if (action == "remove") {
		p.log.step("Removing a task...");
		const { id } = await p.group(
			{
				id: () =>
					p.text({
						message: "Enter the ID of the task to remove:",
						placeholder: "e.g., 123",
						validate: (value) => (value ? undefined : "ID is required."),
					}),
			},
			{
				onCancel: () => {
					p.cancel("Operation cancelled.");
					process.exit(0);
				},
			}
		);
		let stringId = parseInt(id);
		remove({ id: stringId });
		p.outro("Task removed successfully!");
		process.exit(0);
	}
}

const subcommand = Bun.argv[2];

if (!subcommand) {
	main();
} else {
	switch (subcommand) {
		case "init":
			p.intro("Creating your backlog...");
			makedb();
			p.outro("Created!");
			process.exit(0);
		case "make":
		case "add":
			(async () => {
				p.intro("Adding a task...");
				const { title, body, project_group } = await p.group(
					{
						title: () =>
							p.text({
								message: "Enter the task title:",
								placeholder: "e.g., Fix login bug",
								validate: (value) => (value ? undefined : "Title is required."),
							}),
						body: () =>
							p.text({
								message: "Enter the task description:",
								placeholder: "e.g., Users cannot log in with valid credentials",
								validate: (value) => (value ? undefined : "Body is required."),
							}),
						project_group: () =>
							p.text({
								message: "Enter the product group (optional):",
								placeholder: "e.g., Authentication",
							}),
					},
					{
						onCancel: () => {
							p.cancel("Operation cancelled.");
							process.exit(0);
						},
					}
				);

				add({ title, body, project_group });
				p.outro("Task added successfully!");
				process.exit(0);
			})();
			break;
		case "list":
			p.intro("Listing tasks...");
			const res = list();
			if (res.ok && res.tasks) {
				res.tasks.map((entry) => {
					console.log(``);
					Object.entries(entry).map(([k, v]) => {
						if (k == "created_at" || typeof v == "undefined") {
							// no op
						} else {
							console.log(`[${k}]: ${v}`);
						}
					});
					console.log(``);
				});
			} else {
				p.log.warn("No tasks found.");
			}
			process.exit(0);
		case "rm":
		case "remove":
			p.log.step("Removing a task...");
			const { id } = await p.group(
				{
					id: () =>
						p.text({
							message: "Enter the ID of the task to remove:",
							placeholder: "e.g., 123",
							validate: (value) => (value ? undefined : "ID is required."),
						}),
				},
				{
					onCancel: () => {
						p.cancel("Operation cancelled.");
						process.exit(0);
					},
				}
			);
			let stringId = parseInt(id);
			remove({ id: stringId });
			p.outro("Task removed successfully!");
			process.exit(0);
		default:
			p.log.warn("Unknown method...");
			process.exit(0);
	}
}
