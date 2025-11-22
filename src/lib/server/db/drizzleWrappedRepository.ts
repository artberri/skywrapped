import { eq } from "drizzle-orm";
import type { Database } from ".";
import type { Wrapped } from "../domain/wrapped";
import type { WrappedRepository } from "../domain/wrappedRepository";
import { wrappedTable } from "./schema";

export class DrizzleWrappedRepository implements WrappedRepository {
  public constructor(private db: Database) {}

  public async save(wrapped: Wrapped): Promise<void> {
    await this.db.insert(wrappedTable).values(wrapped);
  }

  public async delete(did: string): Promise<void> {
    await this.db.delete(wrappedTable).where(eq(wrappedTable.did, did));
  }

  public async get(handle: string): Promise<Wrapped | undefined> {
    const [result] = await this.db
      .select()
      .from(wrappedTable)
      .where(eq(wrappedTable.handle, handle));
    return result?.data ?? undefined;
  }
}
