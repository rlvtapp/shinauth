//#region Re-exports necessaries from core module
export type { StandardSchemaV1 } from "@shinauth/core";
export * from "@shinauth/core";
export { getCurrentAdapter } from "@shinauth/core/context";
export * from "@shinauth/core/db";
export * from "@shinauth/core/env";
export * from "@shinauth/core/error";
export * from "@shinauth/core/oauth2";
export * from "@shinauth/core/utils/error-codes";
export * from "@shinauth/core/utils/id";
export * from "@shinauth/core/utils/json";
//#endregion
export { betterAuth, shinAuth } from "./auth/full";
// @ts-expect-error
export * from "./types";
export * from "./utils";

// export this as we are referencing OAuth2Tokens in the `refresh-token` api as return type

// telemetry exports for CLI and consumers
export {
	createTelemetry,
	getTelemetryAuthConfig,
	type TelemetryEvent,
} from "@shinauth/telemetry";
// re-export third party types
// @ts-expect-error
export type * from "better-call";
export type { JSONWebKeySet, JWTPayload } from "jose";
export type * from "zod";
export { APIError } from "./api";
