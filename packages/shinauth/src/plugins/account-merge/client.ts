import type { BetterAuthClientPlugin } from "@shinauth/core";
import { PACKAGE_VERSION } from "../../version";
import type { accountMerge } from ".";

export const accountMergeClient = () => {
	return {
		id: "account-merge-client",
		version: PACKAGE_VERSION,
		$InferServerPlugin: {} as ReturnType<typeof accountMerge>,
		pathMethods: {
			"/account-merge/get-request": "GET",
		},
	} satisfies BetterAuthClientPlugin;
};

export type { AccountMergeOptions } from ".";
