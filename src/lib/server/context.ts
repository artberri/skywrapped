import { LOG_LEVEL } from "$env/static/private";
import type { Agent } from "@atproto/api";
import { NodeOAuthClient } from "@atproto/oauth-client-node";
import { pino, type Logger } from "pino";
import { createOAuthClient } from "./auth/client";
import { BlueskyClient } from "./blueskyClient";
import { createDb, DrizzleWrappedRepository, type Database } from "./db";
import type { WrappedRepository } from "./domain/wrappedRepository";
import { createBidirectionalResolver, type BidirectionalResolver } from "./id-resolver";

/**
 * Application state passed to the router and elsewhere
 */
export type AppContext = {
  db: Database;
  logger: Logger;
  oauthClient: NodeOAuthClient;
  resolver: BidirectionalResolver;
  wrappedRepository: WrappedRepository;
  getBlueskyClient: (agent: Agent) => BlueskyClient;
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
    wrappedRepository: new DrizzleWrappedRepository(db),
    getBlueskyClient: (agent: Agent) => new BlueskyClient(agent),
    async destroy() {
      db.$client.close();
    },
  };
}
