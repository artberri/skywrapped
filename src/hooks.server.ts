import { dev } from "$app/environment";
import { PORT } from "$env/static/private";
import { PUBLIC_BASE_URL } from "$env/static/public";
import { createAppContext, type AppContext } from "$lib/server/context";
import { run } from "$lib/server/process";
import type { Handle, ServerInit } from "@sveltejs/kit";
import { once } from "node:events";

let ctx: AppContext;

export const init: ServerInit = async () => {
  run(async (killSignal) => {
    // Create the application context
    ctx = await createAppContext();

    const url = PUBLIC_BASE_URL || `http://localhost:${PORT}`;
    ctx.logger.info(`Server (Dev server mode:${dev}) running at ${url}`);

    // Wait for a termination signal
    if (!killSignal.aborted) await once(killSignal, "abort");
    ctx.logger.info(`Signal received, shutting down...`);

    // Gracefully shutdown the application context
    await ctx.destroy();
  });
};

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.ctx = ctx;

  const response = await resolve(event);

  return response;
};
