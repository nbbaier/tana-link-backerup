import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const links = sqliteTable("links", {
  id: text("id").primaryKey(),
  title: text("title"),
  tags: text("tags", { mode: "json" }).$type<string[]>(),
  url: text("url"),
  created: text("created"),
  fields: text("fields", { mode: "json" }),
  children: text("children", { mode: "json" }).$type<string[]>(),
});
