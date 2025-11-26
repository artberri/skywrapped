import { MAX_AGE } from "$lib/server/constants";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ locals, setHeaders }) => {
	const { ctx } = locals;

	setHeaders({
		"cache-control": `max-age=${MAX_AGE}, public`,
	});

	return json(ctx.oauthClient.clientMetadata);
};
