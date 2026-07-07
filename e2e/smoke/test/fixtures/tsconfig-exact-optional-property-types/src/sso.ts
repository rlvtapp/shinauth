import { sso } from "@shinauth/sso";
import { betterAuth } from "shinauth";

export const auth = betterAuth({
	plugins: [sso()],
});
