import { buildDbClient } from "./client";
import { links } from "../drizzle/schema";

export const db = buildDbClient();

export type NewLink = typeof links.$inferInsert;

export type Link = {
  title?: string | null | undefined;
  tags?: string[] | null | undefined;
  url?: string | null | undefined;
  created?: string | null | undefined;
  fields?: unknown;
  children?: string[] | null | undefined;
};

export const insertLink = async (link: NewLink) => {
  return db.insert(links).values(link).returning().execute();
};
