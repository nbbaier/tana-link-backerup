import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client/http";
import * as schema from "../drizzle/schema";

interface TursoEnv {
	TURSO_DB_AUTH_TOKEN?: string;
	TURSO_DB_URL?: string;
}

export function buildDbClient(env?: TursoEnv) {
	const url = env
		? env.TURSO_DB_URL?.trim()
		: (process.env as unknown as TursoEnv).TURSO_DB_URL?.trim();
	if (url === undefined) {
		throw new Error("TURSO_DB_URL is not defined");
	}

	const authToken = env
		? env.TURSO_DB_AUTH_TOKEN?.trim()
		: (process.env as unknown as TursoEnv).TURSO_DB_AUTH_TOKEN?.trim();
	if (authToken === undefined) {
		if (!url.includes("file:")) {
			throw new Error("TURSO_DB_AUTH_TOKEN is not defined");
		}
	}

	return drizzle(createClient({ url, authToken }), { schema });
}
