import type { BetterAuthOptions } from "@shinauth/core";
import { initMinimal } from "../context/init-minimal";
import type { Auth } from "../types";
import { createBetterAuth } from "./base";

export type { BetterAuthOptions };

/**
 * Shinauth initializer for minimal mode (without Kysely)
 */
export const shinAuth = <Options extends BetterAuthOptions>(
	options: Options & {},
): Auth<Options> => {
	return createBetterAuth(options, initMinimal);
};

/**
 * Compatibility alias for Better Auth users migrating to Shinauth.
 */
export const betterAuth = shinAuth;
