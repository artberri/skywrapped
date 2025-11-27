import { destroyCredentials } from "$lib/server/auth/session";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ setHeaders, locals, request }) => {
	const { ctx } = locals;

	setHeaders({ "cache-control": "no-store" });
	const response = new Response(null, {
		status: 302,
		headers: {
			Location: "/",
		},
	});

	const session = await destroyCredentials(request, response, ctx);
	session.destroy();

	return response;
};
