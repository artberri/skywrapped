import { integer, primaryKey, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import type { Wrapped } from "../domain/wrapped";

export const authStateTable = sqliteTable(
  "auth_state",
  {
    key: text("key").notNull(),
    state: text("state").notNull(),
  },
  (table) => [primaryKey({ name: "pk_auth_state", columns: [table.key] })],
);

export const authSessionTable = sqliteTable(
  "auth_session",
  {
    key: text("key").notNull(),
    session: text("session").notNull(),
  },
  (table) => [primaryKey({ name: "pk_auth_session", columns: [table.key] })],
);

export const wrappedTable = sqliteTable(
  "wrapped",
  {
    did: text("did").notNull(),
    handle: text("handle").notNull(),
    year: integer("year").notNull(),
    data: text("data", { mode: "json" }).$type<Wrapped>(),
  },
  (table) => [
    primaryKey({ name: "pk_wrapped", columns: [table.did, table.year] }),
    uniqueIndex("idx_wrapped_did_year").on(table.handle, table.year),
  ],
);
