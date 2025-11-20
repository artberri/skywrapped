import { COOKIE_SECRET } from "$env/static/private";
import type { Session } from "$lib/server/auth/session";
import { getIronSession } from "iron-session";
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

  const session = await getIronSession<Session>(request, response, {
    cookieName: "sid",
    password: COOKIE_SECRET,
  });

  // Revoke credentials on the server
  if (session.did) {
    try {
      const oauthSession = await ctx.oauthClient.restore(session.did);
      if (oauthSession) {
        await oauthSession.signOut();
      }
    } catch (err) {
      ctx.logger.warn({ err }, "Failed to revoke credentials");
    }
  }

  session.destroy();

  return response;
};
