import { and, eq } from "drizzle-orm";
import type { Database } from ".";
import type { Wrapped } from "../domain/wrapped";
import type { WrappedRepository } from "../domain/wrappedRepository";
import { wrappedTable } from "./schema";

export class DrizzleWrappedRepository implements WrappedRepository {
  public constructor(private db: Database) {}

  public async save(wrapped: Wrapped): Promise<void> {
    await this.db
      .insert(wrappedTable)
      .values({
        did: wrapped.did,
        handle: wrapped.handle,
        year: wrapped.year,
        data: wrapped,
      })
      .onConflictDoUpdate({
        target: [wrappedTable.did, wrappedTable.year],
        set: {
          handle: wrapped.handle,
          data: wrapped,
        },
      });
  }

  public async delete(did: string): Promise<void> {
    await this.db.delete(wrappedTable).where(eq(wrappedTable.did, did));
  }

  public async get(handle: string, year: number): Promise<Wrapped | undefined> {
    const [result] = await this.db
      .select()
      .from(wrappedTable)
      .where(and(eq(wrappedTable.handle, handle), eq(wrappedTable.year, year)));
    return result?.data ?? undefined;
  }
}
