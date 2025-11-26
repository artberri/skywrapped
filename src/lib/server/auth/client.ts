import { PORT, PRIVATE_KEYS } from "$env/static/private";
import { PUBLIC_BASE_URL } from "$env/static/public";
import { AtprotoHandleResolverNode } from "@atproto-labs/handle-resolver-node";
import {
  atprotoLoopbackClientMetadata,
  JoseKey,
  Keyset,
  NodeOAuthClient,
  type OAuthClientMetadataInput,
} from "@atproto/oauth-client-node";
import assert from "node:assert";
import { type Database } from "../db";
import { validJsonWebKeys } from "../jwk";
import { SessionStore, StateStore } from "./storage";

export async function createOAuthClient(db: Database) {
  // Confidential client require a keyset accessible on the internet. Non
  // internet clients (e.g. development) cannot expose a keyset on the internet
  // so they can't be private..
  const keyset =
    PUBLIC_BASE_URL && PRIVATE_KEYS
      ? new Keyset(
          await Promise.all(validJsonWebKeys(PRIVATE_KEYS).map((jwk) => JoseKey.fromJWK(jwk))),
        )
      : undefined;

  assert(
    !PUBLIC_BASE_URL || keyset?.size,
    "ATProto requires backend clients to be confidential. Make sure to set the PRIVATE_KEYS environment variable.",
  );

  // If a keyset is defined (meaning the client is confidential). Let's make
  // sure it has a private key for signing. Note: findPrivateKey will throw if
  // the keyset does not contain a suitable private key.
  const pk = keyset?.findPrivateKey({ usage: "sign" });

  const clientMetadata: OAuthClientMetadataInput = PUBLIC_BASE_URL
    ? {
        client_name: "Sky Wrapped",
        client_id: `${PUBLIC_BASE_URL}/oauth-client-metadata.json`,
        jwks_uri: `${PUBLIC_BASE_URL}/.well-known/jwks.json`,
        redirect_uris: [`${PUBLIC_BASE_URL}/oauth/callback`],
        scope: "atproto transition:generic",
        grant_types: ["authorization_code", "refresh_token"],
        response_types: ["code"],
        application_type: "web",
        token_endpoint_auth_method: pk ? "private_key_jwt" : "none",
        token_endpoint_auth_signing_alg: pk ? pk.alg : undefined,
        dpop_bound_access_tokens: true,
      }
    : atprotoLoopbackClientMetadata(
        `http://localhost?${new URLSearchParams([
          ["redirect_uri", `http://127.0.0.1:${PORT}/oauth/callback`],
          ["scope", `atproto transition:generic`],
        ])}`,
      );

  // Create an explicit handle resolver with fallback nameservers for DNS resolution
  // This is required for resolving ATProto handles (e.g., Bluesky handles) to DIDs
  const handleResolver = new AtprotoHandleResolverNode({
    fallbackNameservers: ["1.1.1.1", "1.0.0.1", "8.8.8.8", "8.8.4.4"],
  });

  return new NodeOAuthClient({
    keyset,
    clientMetadata,
    stateStore: new StateStore(db),
    sessionStore: new SessionStore(db),
    handleResolver: PUBLIC_BASE_URL ? undefined : handleResolver,
  });
}
