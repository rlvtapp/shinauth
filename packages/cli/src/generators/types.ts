import type { BetterAuthOptions } from "@shinauth/core";
import type { DBAdapter } from "@shinauth/core/db/adapter";

export interface SchemaGeneratorResult {
	code?: string;
	fileName: string;
	overwrite?: boolean;
	append?: boolean;
}

export interface SchemaGenerator {
	<Options extends BetterAuthOptions>(opts: {
		file?: string;
		adapter: DBAdapter;
		options: Options;
	}): Promise<SchemaGeneratorResult>;
}
