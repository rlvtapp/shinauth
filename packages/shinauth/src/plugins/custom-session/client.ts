import type { Auth } from "shinauth";
import { InferServerPlugin } from "../../client/plugins";
import type { BetterAuthOptions } from "../../types";

export const customSessionClient = <
	A extends
		| Auth
		| {
				options: BetterAuthOptions;
		  },
>() => {
	return InferServerPlugin<A, "custom-session">();
};
