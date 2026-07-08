import type { BetterAuthOptions } from "@shinauth/core";
import type {
	InferDBFieldsFromOptionsInput,
	InferDBFieldsFromPluginsInput,
} from "@shinauth/core/db";
import type {
	ExtractPluginField,
	InferPluginFieldFromTuple,
	UnionToIntersection,
} from "./helper";

export type AdditionalUserFieldsInput<Options extends BetterAuthOptions> =
	InferDBFieldsFromPluginsInput<"user", Options["plugins"]> &
		InferDBFieldsFromOptionsInput<Options["user"]>;

export type AdditionalSessionFieldsInput<Options extends BetterAuthOptions> =
	InferDBFieldsFromPluginsInput<"session", Options["plugins"]> &
		InferDBFieldsFromOptionsInput<Options["session"]>;

export type InferPluginTypes<O extends BetterAuthOptions> =
	O["plugins"] extends readonly [unknown, ...unknown[]]
		? InferPluginFieldFromTuple<O["plugins"], "$Infer">
		: O["plugins"] extends Array<infer P>
			? UnionToIntersection<ExtractPluginField<P, "$Infer">>
			: {};

export type {
	Account,
	RateLimit,
	Session,
	User,
	Verification,
} from "@shinauth/core/db";
