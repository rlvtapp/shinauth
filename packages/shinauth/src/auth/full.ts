import type { BetterAuthOptions } from "@shinauth/core";
import { init } from "../context/init";
import type { Auth } from "../types";
import { createBetterAuth } from "./base";

/**
 * Shinauth initializer for full mode (with Kysely)
 *
 * @example
 * ```ts
 * import { shinAuth } from "shinauth";
 *
 * const auth = shinAuth({
 * 	database: new PostgresDialect({ connection: process.env.DATABASE_URL }),
 * });
 * ```
 *
 * For minimal mode (without Kysely), import from `shinauth/minimal` instead
 * @example
 * ```ts
 * import { shinAuth } from "shinauth/minimal";
 *
 * const auth = shinAuth({
 *	  database: drizzleAdapter(db, { provider: "pg" }),
 * });
 */
export const shinAuth = <Options extends BetterAuthOptions>(
	options: Options & {},
): Auth<Options> => {
	return createBetterAuth(options, init);
};

/**
 * Compatibility alias for Better Auth users migrating to Shinauth.
 */
export const betterAuth = shinAuth;
