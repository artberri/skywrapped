import { COOKIE_SECRET, PORT } from "$env/static/private";
import { PUBLIC_BASE_URL } from "$env/static/public";
import type { Session } from "$lib/server/auth/session";
import { getIronSession } from "iron-session";
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
		// Load the session cookie
		const session = await getIronSession<Session>(request, response, {
			cookieName: "sid",
			password: COOKIE_SECRET,
		});

		// If the user is already signed in, destroy the old credentials
		if (session.did) {
			try {
				const oauthSession = await ctx.oauthClient.restore(session.did);
				if (oauthSession) {
					await oauthSession.signOut();
				}
			} catch (err) {
				ctx.logger.warn({ err }, "Oauth restore failed");
			}
		}

		// Complete the OAuth flow
		const oauth = await ctx.oauthClient.callback(url.searchParams);

		// Update the session cookie
		session.did = oauth.session.did;

		await session.save();

		ctx.logger.debug({ did: oauth.session.did }, "Oauth callback successful");
	} catch (err) {
		ctx.logger.error({ err }, "Oauth callback failed");
		return new Response(null, {
			status: 302,
			headers: {
				Location: baseUrl,
			},
		});
	}

	return response;
};
