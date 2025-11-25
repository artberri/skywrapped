import { MAX_AGE } from "$lib/server/constants";
import { ensureError, ifString } from "$lib/utils";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ setHeaders, request }) => {
  // Set different cache-control headers based on request method
  if (request.method === "GET") {
    setHeaders({ "cache-control": `max-age=${MAX_AGE}, public` });
  } else {
    // For POST requests (and any other methods), don't cache
    setHeaders({ "cache-control": "no-store" });
  }
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const { ctx } = locals;
    const data = await request.formData();
    const handle = data.get("handle");

    // Validate input: can be a handle, a DID or a service URL (PDS).
    if (!ifString(handle)) {
      throw new Error("Invalid input");
    }

    if (!handle) {
      return fail(400, {
        error:
          "Please enter a valid Bluesky handle (e.g., @username.bsky.social)",
      });
    }

    // Initiate the OAuth flow
    let url: URL;
    try {
      // Initiate the OAuth flow
      url = await ctx.oauthClient.authorize(sanitizeHandle(handle));
    } catch (err) {
      const error = ensureError(err);
      if (error.message.includes("Failed to resolve identity")) {
        return fail(400, {
          error:
            "Please enter a valid Bluesky handle (e.g., @username.bsky.social)",
        });
      }

      const errorMessage =
        err instanceof Error ? err.message : "Unexpected error";
      ctx.logger.warn({ error }, "OAuth authorize failed");

      return fail(400, { error: errorMessage });
    }

    // Redirect to the OAuth authorization URL
    redirect(302, url.toString());
  },
};

const sanitizeHandle = (handle: string) => {
  return handle.trim().replace(/^@/, "");
};
