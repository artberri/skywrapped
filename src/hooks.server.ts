import { dev } from "$app/environment";
import { PORT } from "$env/static/private";
import { PUBLIC_BASE_URL } from "$env/static/public";
import { getSessionAgent } from "$lib/server/auth/session";
import { createAppContext, type AppContext } from "$lib/server/context";
import { run } from "$lib/server/process";
import { redirect, type Handle, type ServerInit } from "@sveltejs/kit";
import { once } from "node:events";
import util from "node:util";

let ctx: AppContext;

export const init: ServerInit = async () => {
  run(async (killSignal) => {
    // Create the application context
    ctx = await createAppContext();

    const url = PUBLIC_BASE_URL || `http://127.0.0.1:${PORT}`;
    ctx.logger.info(`Server (Dev server mode:${dev}) running at ${url}`);

    // Wait for a termination signal
    if (!killSignal.aborted) await once(killSignal, "abort");
    ctx.logger.info(`Signal received, shutting down...`);

    // Gracefully shutdown the application context
    await ctx.destroy();
  });
};

export const handle: Handle = async ({ event, resolve }) => {
  const url = new URL(event.request.url);
  event.locals.ctx = ctx;
  ctx.logger.debug({ url: url.pathname }, "Checking if auth is required");
  if (isAuthRequired(url.pathname)) {
    ctx.logger.debug({ url: url.pathname }, "Auth is required");
    const agent = await getSessionAgent(event.request, new Response(), ctx);
    if (!agent) {
      ctx.logger.debug(
        { url: url.pathname },
        "No agent found, redirecting to home",
      );
      redirect(302, "/");
    }

    const f = await agent.getAuthorFeed({ actor: agent.assertDid });
    console.log(util.inspect(f, false, null, true /* enable colors */));

    const f2 = await agent.getFollowers({ actor: agent.assertDid });
    console.log(util.inspect(f2, false, null, true /* enable colors */));
    event.locals.agent = agent;
  }

  const response = await resolve(event);

  return response;
};

const requiredPath = "/app";
function isAuthRequired(path: string) {
  return path === requiredPath || path.startsWith(requiredPath + "/");
}
