// Input type (no defaults, all fields required except `id` which is optional for inserts)
export interface EntryInput {
	title: string;
	project_group: string;
	body?: string; // Optional field
}

// Output type (includes defaults and reflects the database schema)
export interface EntryOutput {
	id: number;
	created_at: string;
	updated_at: string;
	title: string;
	project_group: string;
	body?: string; // Optional field
}
