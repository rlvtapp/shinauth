import { betterAuth } from "shinauth";
import { organization } from "shinauth/plugins";

export const auth = betterAuth({
	plugins: [organization({})],
});
