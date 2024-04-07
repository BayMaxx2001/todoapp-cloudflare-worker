import {
	IRequest, json,
	Router
} from 'itty-router';
import { createTask, findTaskById, listTasks, updateTaskById } from './task';


export type WithOriginCORS = {
	origin: string;
} & IRequest;

export type Middleware = WithOriginCORS;

const router = Router<Middleware, CF>();

router
	.all("*", (req: Middleware, env: Env, ctx: ExecutionContext) => {
		const origin = "*";
		req.origin = origin;
	})
	.post("/todoapp/api/tasks", createTask)
	.put("/todoapp/api/tasks/:id", updateTaskById)
	.get("/todoapp/api/tasks/:id", findTaskById)
	.get("/todoapp/api/tasks", listTasks)


export default function handler(request: Request, env: Env, ctx: ExecutionContext) {
	const origin = "*";

	return router
		.fetch(request, env, ctx)
		.catch((err) => {
			return json(
				{
					code: err.httpCode,
					message: err.cause,
				},
				{ status: err.httpCode }
			);
		})
		.then(async (response: Response) => {
			if (request.method === "OPTIONS") {
				return new Response(null, {
					headers: {
						"access-control-allow-methods": "OPTIONS, GET, POST, PUT",
						"access-control-allow-headers": "*",
						"access-control-allow-origin": origin,
					},
				});
			}

			if (!response) {
				return response;
			}

			const { headers, status, body } = response;

			return new Response(body, {
				status,
				headers: {
					...Object.fromEntries(headers),
					"access-control-allow-origin": origin,
					"content-type": headers.get("content-type") || "application/json",
				},
			});
		});
}
