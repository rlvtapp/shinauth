import type { BetterAuthPluginDBSchema } from "@shinauth/core/db";

export const schema = {
	user: {
		fields: {
			isAnonymous: {
				type: "boolean",
				required: false,
				input: false,
				defaultValue: false,
			},
		},
	},
} satisfies BetterAuthPluginDBSchema;
