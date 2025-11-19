import { jwkPubSchema } from "@atproto/oauth-client-node";
import { z } from "zod";

const jsonWebKeysSchema = z.array(jwkPubSchema).nonempty();

export type PublicJwks = z.output<typeof jsonWebKeysSchema>;

export const validJsonWebKeys = (input: string): PublicJwks => {
  const value = JSON.parse(input);
  return jsonWebKeysSchema.parse(value);
};
