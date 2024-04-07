import { type RequestHandler, json } from "itty-router";
import type { Middleware } from ".";

export const createTask: RequestHandler<Middleware, CF> = async (
	request: Middleware,
	env,
	context
) => {

	const payload: {
		description?: string;
		title?: string;
	} = await request.json();
	const uuid = crypto.randomUUID();
	const date = new Date().toISOString()

	const { results } = await env.DB.prepare(
		"INSERT INTO tasks(id, description, title, created_at, updated_at) VALUES (?, ?, ?, ?, ?)"
	)
		.bind(
			uuid,
			payload.description,
			payload.title,
			date,
			date
		)
		.first();

	return json({
		data: results,
	});
};

export const updateTaskById: RequestHandler<Middleware, CF> = async (
	request: Middleware,
	env,
	context
) => {
	const payload: {
		description?: string;
		title?: string;
	} = await request.json();
	const date = new Date().toISOString()

	const results  = await env.DB.prepare(
		"UPDATE tasks SET description=?, title=?, updated_at=? where id = ?"
	)
		.bind(
			payload.description,
			payload.title,
			date,
			request.params.id,
		)
		.first();

	return json({
		data: results,
	});
};

export const findTaskById: RequestHandler<Middleware, CF> = async (
	request: Middleware,
	env,
	context
) => {
	const data = await env.kv_namespace_todoapp.get(
		`tasks:${request.params.id}`,
	);

	if (data) {
		return json({
			data: data,
		});
	}

	const results  = await env.DB.prepare(
		"SELECT * FROM tasks where id = ?"
	)
		.bind(request.params.id)
		.first();

	env.kv_namespace_todoapp.put(
		`tasks:${request.params.id}`,
		JSON.stringify({
			data: results,
		}),
		{ expirationTtl: 60 * 60 }
	);

	return json({
		data: results,
	});
};

export const listTasks: RequestHandler<Middleware, CF> = async (
	request: Middleware,
	env,
	context
) => {
	const data = await env.kv_namespace_todoapp.get(`tasks:all`);

	if (data) {
		return json({
			data: data,
		});
	}

	const { results } = await env.DB.prepare(
		"SELECT * FROM tasks"
	).all();


	env.kv_namespace_todoapp.put(
		`tasks:all`,
		JSON.stringify({
			data: results,
		}),
		{ expirationTtl: 10}
	);

	return json({
		data: results,
	});

	return json({
		data: results,
	});
};
