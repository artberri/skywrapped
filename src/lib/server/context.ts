import { LOG_LEVEL } from "$env/static/private";
import { NodeOAuthClient } from "@atproto/oauth-client-node";
import { pino, type Logger } from "pino";
import { createOAuthClient } from "./auth/client";
import { createDb, type Database } from "./db";
import {
  createBidirectionalResolver,
  type BidirectionalResolver,
} from "./id-resolver";

/**
 * Application state passed to the router and elsewhere
 */
export type AppContext = {
  db: Database;
  logger: Logger;
  oauthClient: NodeOAuthClient;
  resolver: BidirectionalResolver;
  destroy: () => Promise<void>;
};

export async function createAppContext(): Promise<AppContext> {
  const db = createDb();
  const oauthClient = await createOAuthClient(db);
  const logger = pino({
    name: "server",
    level: LOG_LEVEL,
  });
  const resolver = createBidirectionalResolver(oauthClient);

  return {
    db,
    logger,
    oauthClient,
    resolver,

    async destroy() {
      db.$client.close();
    },
  };
}
