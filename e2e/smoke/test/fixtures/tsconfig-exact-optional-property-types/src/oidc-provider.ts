import { betterAuth } from "shinauth";
import { oidcProvider } from "shinauth/plugins";

export const auth = betterAuth({
	plugins: [
		oidcProvider({
			loginPage: "/login",
		}),
	],
});
