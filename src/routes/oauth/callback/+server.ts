import { PORT } from "$env/static/private";
import { PUBLIC_BASE_URL } from "$env/static/public";
import { destroyCredentials } from "$lib/server/auth/session";
import { handleErrorSafely } from "$lib/server/errorUtils";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ setHeaders, locals, url, request }) => {
	const { ctx } = locals;

	setHeaders({ "cache-control": "no-store" });
	const baseUrl = PUBLIC_BASE_URL || `http://127.0.0.1:${PORT}`;
	const response = new Response(null, {
		status: 302,
		headers: {
			Location: `${baseUrl}/calculate`,
		},
	});

	try {
		// Get renewed user session
		const session = await destroyCredentials(request, response, ctx);

		// Complete the OAuth flow
		const oauth = await ctx.oauthClient.callback(url.searchParams);

		// Update the session cookie
		session.did = oauth.session.did;

		await session.save();

		ctx.logger.debug({ did: oauth.session.did }, "Oauth callback successful");
	} catch (err) {
		// Log detailed error server-side, but don't expose details to client
		handleErrorSafely(err, ctx.logger, { url: url.pathname }, "Authentication failed");
		return new Response(null, {
			status: 302,
			headers: {
				Location: baseUrl,
			},
		});
	}

	return response;
};
