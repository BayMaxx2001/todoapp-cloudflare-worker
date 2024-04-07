DROP TABLE IF EXISTS task;
CREATE TABLE IF NOT EXISTS tasks(
	id uuid PRIMARY KEY,
	description TEXT,
	title TEXT,
	created_at timestamp,
	updated_at timestamp
);

INSERT INTO tasks (id, description, title, created_at, updated_at) VALUES
('9e1feecd-6ad9-4c1f-a1ed-6af3622ec98b', 'work description', 'work', '2024-04-07T20:24:00+00:00', '2024-04-07T20:24:00+00:00'),
('be28fbe7-dd51-4fb3-87f6-5f4b6238e42c', 'study coding', 'study', '2024-04-07T20:24:00+00:00', '2024-04-07T20:24:00+00:00');
