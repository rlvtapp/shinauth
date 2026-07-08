import Database from "bun:sqlite";
import { betterAuth } from "shinauth";
import { getMigrations } from "shinauth/db/migration";

const database = new Database(":memory:");

export const auth = betterAuth({
	database,
	emailAndPassword: {
		enabled: true,
	},
	trustedOrigins: ["http://localhost:*"],
	logger: {
		level: "debug",
	},
});

const { runMigrations } = await getMigrations(auth.options);

await runMigrations();

// Bun: when a file's default export has a `fetch` handler, Bun passes it
// into Bun.serve() under the hood. No explicit Bun.serve call needed.
// https://bun.com/docs/runtime/http/server#export-default-syntax
export default auth;
