import { dev } from "$app/environment";
import { PORT } from "$env/static/private";
import { PUBLIC_BASE_URL } from "$env/static/public";
import { getSessionAgent } from "$lib/server/auth/session";
import { createAppContext, type AppContext } from "$lib/server/context";
import { redirect, type Handle, type ServerInit } from "@sveltejs/kit";

let ctx: AppContext | undefined;
let ctxPromise: Promise<AppContext> | undefined;

async function getContext(): Promise<AppContext> {
  if (ctx) {
    return ctx;
  }
  if (!ctxPromise) {
    ctxPromise = createAppContext().then((context) => {
      ctx = context;
      return context;
    });
  }
  return ctxPromise;
}

export const init: ServerInit = async () => {
  // Initialize context immediately for Cloudflare Workers compatibility
  ctx = await createAppContext();

  const url = PUBLIC_BASE_URL || `http://127.0.0.1:${PORT}`;
  ctx.logger.info(`Server (Dev server mode:${dev}) running at ${url}`);
  console.log(`Server (Dev server mode:${dev}) running at ${url}`);
};

export const handle: Handle = async ({ event, resolve }) => {
  const url = new URL(event.request.url);
  const ctx = await getContext();
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
    event.locals.agent = agent;
  }

  const response = await resolve(event);

  return response;
};

const requiredPath = "/calculate";
function isAuthRequired(path: string) {
  return path.includes(requiredPath + "/") || path.endsWith(requiredPath);
}
