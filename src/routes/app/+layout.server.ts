import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = ({ locals }) => {
  const { agent, ctx } = locals;
  try {
    const did = agent?.assertDid;
    if (!did) {
      throw new Error("No agent found");
    }

    return {
      did,
    };
  } catch (err) {
    ctx.logger.debug({ err }, "Error asserting did");
    redirect(302, "/");
  }
};
