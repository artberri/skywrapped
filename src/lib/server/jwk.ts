import { ensureError } from "$lib/utils";
import { jwkPubSchema } from "@atproto/oauth-client-node";
import { z } from "zod";

const jsonWebKeysSchema = z.array(jwkPubSchema).nonempty();

export type PublicJwks = z.output<typeof jsonWebKeysSchema>;

export const validJsonWebKeys = (input: string): PublicJwks => {
  try {
    const value = JSON.parse(input);
    return jsonWebKeysSchema.parse(value);
  } catch (error) {
    throw new Error(
      `Error parsing PRIVATE_KEYS: "${input}" - ${ensureError(error).message}`,
    );
  }
};
