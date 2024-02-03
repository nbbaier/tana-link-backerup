import { buildDbClient } from "./client";
import { links } from "../drizzle/schema";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { insertLink, type NewLink, type Link } from "./operations";
import { nanoid } from "nanoid";
import { parseNode } from "./parse";

const app = new Hono();
export const db = buildDbClient();

const origins = [
  "http://localhost",
  "https://localhost",
  "http://app.tana.inc",
  "https://app.tana.inc",
];

app.use("*", cors({ origin: origins, allowMethods: ["GET", "POST"] }));
app.use("*", logger());

app.get("/", (c) => {
  return c.text("Try POST /");
});

app.post("/", async (c) => {
  const body: { nodeContents: string } = await c.req.json();
  const { nodeContents } = body;

  const parsedLink: Link = parseNode(nodeContents);

  const result = await insertLink({ id: nanoid(), ...parsedLink });
  console.log(result);
  return c.text("Added!");
});

const port = Bun.argv[2] ? Bun.argv[1] : process.env.PORT;
Bun.serve({ port, fetch: app.fetch });

console.log(`Server running at http://localhost:${port}`);
