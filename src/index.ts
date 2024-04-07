/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import handleAPI from "./api";



export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {

		console.log(JSON.stringify(request.body, null, 2));
		const url = new URL(request.url);

		// if (url == "/api/v1/tasks/work") {
		// 	// If you did not use `DB` as your binding name, change it here
		// 	const { results } = await env.DB.prepare(
		// 		"SELECT * FROM tasks where title = ?"
		// 	)
		// 		.bind("work")
		// 		.all();
		// 	return Response.json(results);
		// }
		//
		// if (url === "/api/v1/kv") {
		// 	try {
		// 		await env.kv_namespace_todoapp.put("foo1", "bar1");
		// 		let value = await env.kv_namespace_todoapp.get("foo1")
		// 		if (value === null) {
		// 			return new Response("Value not found", { status: 404 });
		// 		}
		// 		return new Response(value);
		//
		// 	}catch (err) {
		// 		console.error(`KV returned error: ${err}`)
		// 		return new Response(err, { status: 500 })
		// 	}
		// }

		// todoapp server
		if (url.pathname.startsWith("/todoapp/api/")) {
			return handleAPI(request, env, ctx);
		}

		return new Response(
			"Call /api/v1/tasks/work to see detail of task which has title is work"
		);
	},
};
