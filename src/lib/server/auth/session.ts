import { COOKIE_SECRET } from "$env/static/private";
import { Agent } from "@atproto/api";
import { getIronSession } from "iron-session";
import type { AppContext } from "../context";

export type Session = { did?: string };

export async function getSessionAgent(request: Request, response: Response, ctx: AppContext) {
	const session = await getIronSession<Session>(request, response, {
		cookieName: "sid",
		password: COOKIE_SECRET,
	});
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
