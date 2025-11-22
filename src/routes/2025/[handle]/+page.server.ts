import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  const { agent } = locals;

  // Validate authentication - calculation will be handled by the API route
  try {
    if (!agent) {
      throw new Error("No agent found");
    }

    const actor = agent?.assertDid;
    if (!actor) {
      throw new Error("No agent found");
    }
  } catch (err) {
    locals.ctx.logger.debug({ err }, "Error asserting did during calculate");
    redirect(302, "/");
  }
};
