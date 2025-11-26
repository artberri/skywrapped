import { ensureError } from "$lib/utils";
import type {
  NodeSavedSession,
  NodeSavedSessionStore,
  NodeSavedState,
  NodeSavedStateStore,
} from "@atproto/oauth-client-node";
import type { Database } from "../db";
import { authSessionTable, authStateTable } from "../db/schema";
import { eq } from "../db/utils";

export class StateStore implements NodeSavedStateStore {
  public constructor(private db: Database) {}

  public async get(key: string): Promise<NodeSavedState | undefined> {
    const [result] = await this.db
      .select({ state: authStateTable.state })
      .from(authStateTable)
      .where(eq(authStateTable.key, key));

    if (!result) {
      return undefined;
    }

    try {
      return JSON.parse(result.state) as NodeSavedState;
    } catch (err) {
      const error = ensureError(err);
      console.error(`[StateStore] Failed to parse state: ${key} - ${error.message}`, error);
      return undefined;
    }
  }

  public async set(key: string, val: NodeSavedState) {
    const state = JSON.stringify(val);
    await this.db
      .insert(authStateTable)
      .values({ key, state })
      .onConflictDoUpdate({ target: authStateTable.key, set: { state } });
  }

  public async del(key: string) {
    await this.db.delete(authStateTable).where(eq(authStateTable.key, key));
  }
}

export class SessionStore implements NodeSavedSessionStore {
  public constructor(private db: Database) {}

  public async get(key: string): Promise<NodeSavedSession | undefined> {
    const [result] = await this.db
      .select({ session: authSessionTable.session })
      .from(authSessionTable)
      .where(eq(authSessionTable.key, key));

    if (!result) {
      return undefined;
    }

    try {
      return JSON.parse(result.session) as NodeSavedSession;
    } catch (err) {
      const error = ensureError(err);
      console.error(`[SessionStore] Failed to parse session: ${key} - ${error.message}`, error);
      return undefined;
    }
  }

  public async set(key: string, val: NodeSavedSession) {
    const session = JSON.stringify(val);
    await this.db
      .insert(authSessionTable)
      .values({ key, session })
      .onConflictDoUpdate({ target: authSessionTable.key, set: { session } });
  }

  public async del(key: string) {
    await this.db.delete(authSessionTable).where(eq(authSessionTable.key, key));
  }
}
