import { dev } from "$app/environment";
import { COOKIE_SECRET } from "$env/static/private";
import { Agent } from "@atproto/api";
import { getIronSession } from "iron-session";
import type { AppContext } from "../context";
import { handleErrorSafely } from "../errorUtils";

export type Session = { did?: string };

export async function getSessionAgent(request: Request, response: Response, ctx: AppContext) {
	const session = await getSession(request, response);

	if (!session.did) {
		ctx.logger.debug({ session }, "No session found");
		return undefined;
	}

	try {
		const oauthSession = await ctx.oauthClient.restore(session.did);
		return oauthSession ? new Agent(oauthSession) : undefined;
	} catch (err) {
		ctx.logger.warn({ err }, "Oauth restore failed");
		session.destroy();
		return undefined;
	}
}

export const getSession = async (request: Request, response: Response) => {
	return await getIronSession<Session>(request, response, {
		cookieName: "sid",
		password: COOKIE_SECRET,
		cookieOptions: {
			httpOnly: true,
			secure: !dev, // Only use secure cookies in production (HTTPS required)
			sameSite: "lax", // CSRF protection while allowing OAuth redirects
			maxAge: 60 * 60 * 24 * 7, // 7 days
			path: "/",
		},
	});
};

export const destroyCredentials = async (request: Request, response: Response, ctx: AppContext) => {
	const session = await getSession(request, response);

	// If the user is already signed in, destroy the old credentials
	if (session.did) {
		try {
			const oauthSession = await ctx.oauthClient.restore(session.did);
			if (oauthSession) {
				await oauthSession.signOut();
			}
		} catch (err) {
			const error = handleErrorSafely(
				err,
				ctx.logger,
				{ did: session.did },
				"Failed to revoke credentials",
			);
			ctx.logger.warn({ error }, "Failed to revoke credentials");
		}
	}

	return session;
};
