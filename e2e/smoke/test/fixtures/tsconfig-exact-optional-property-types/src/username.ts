import { betterAuth } from "shinauth";
import { username } from "shinauth/plugins";

export const auth = betterAuth({
	emailAndPassword: {
		enabled: true,
	},
	plugins: [
		username({
			minUsernameLength: 4,
			maxUsernameLength: 15,
		}),
	],
});
