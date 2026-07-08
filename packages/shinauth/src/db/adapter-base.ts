import type { BetterAuthOptions } from "@shinauth/core";
import { getAuthTables } from "@shinauth/core/db";
import type { DBAdapter } from "@shinauth/core/db/adapter";
import { logger } from "@shinauth/core/env";
import type { MemoryDB } from "@shinauth/memory-adapter";

export async function getBaseAdapter(
	options: BetterAuthOptions,
	handleDirectDatabase: (
		options: BetterAuthOptions,
	) => Promise<DBAdapter<BetterAuthOptions>>,
): Promise<DBAdapter<BetterAuthOptions>> {
	let adapter: DBAdapter<BetterAuthOptions>;

	if (!options.database) {
		const tables = getAuthTables(options);
		const memoryDB = Object.keys(tables).reduce<MemoryDB>((acc, key) => {
			acc[key] = [];
			return acc;
		}, {});
		const { memoryAdapter } = await import("@shinauth/memory-adapter");
		adapter = memoryAdapter(memoryDB)(options);
	} else if (typeof options.database === "function") {
		adapter = options.database(options);
	} else {
		adapter = await handleDirectDatabase(options);
	}

	// patch for 1.3.x to ensure we have a transaction function in the adapter
	if (!adapter.transaction) {
		logger.warn(
			"Adapter does not correctly implement transaction function, patching it automatically. Please update your adapter implementation.",
		);
		adapter.transaction = async (cb) => {
			return cb(adapter);
		};
	}

	return adapter;
}
