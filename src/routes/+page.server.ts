import { getOAuthClient } from "$lib/server/auth/client";
import { MAX_AGE } from "$lib/server/constants";
import { ifString } from "$lib/utils";
import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ setHeaders }) => {
  setHeaders({ "cache-control": `max-age=${MAX_AGE}, public` });
};

export const actions: Actions = {
  default: async ({ setHeaders, request }) => {
    // Never store this route
    setHeaders({ "cache-control": "no-store" });

    const data = await request.formData();
    const handle = data.get("handle");

    // Initiate the OAuth flow
    try {
      // Validate input: can be a handle, a DID or a service URL (PDS).
      if (!ifString(handle)) {
        throw new Error("Invalid input");
      }

      // Initiate the OAuth flow
      const oauthClient = await getOAuthClient();
      const url = await oauthClient.authorize(handle);

      redirect(302, url.toString());
    } catch (err) {
      console.error({ err }, "oauth authorize failed");

      const error = err instanceof Error ? err.message : "unexpected error";

      return { error };
    }
  },
};
