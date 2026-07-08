import type { BetterAuthOptions } from "@shinauth/core";
import type { DBAdapter } from "@shinauth/core/db/adapter";
import { BetterAuthError } from "@shinauth/core/error";
import { getBaseAdapter } from "./adapter-base";

export async function getAdapter(
	options: BetterAuthOptions,
): Promise<DBAdapter<BetterAuthOptions>> {
	return getBaseAdapter(options, async (opts) => {
		const { createKyselyAdapter } = await import("../adapters/kysely-adapter");
		const { kysely, databaseType, transaction } =
			await createKyselyAdapter(opts);
		if (!kysely) {
			throw new BetterAuthError("Failed to initialize database adapter");
		}
		const { kyselyAdapter } = await import("../adapters/kysely-adapter");
		return kyselyAdapter(kysely, {
			type: databaseType || "sqlite",
			debugLogs:
				opts.database && "debugLogs" in opts.database
					? opts.database.debugLogs
					: false,
			transaction: transaction,
		})(opts);
	});
}
