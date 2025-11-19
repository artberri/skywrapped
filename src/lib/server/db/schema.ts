import { primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

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
