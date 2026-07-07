import { electronClient } from "@shinauth/electron/client";
import { storage } from "@shinauth/electron/storage";
import { createAuthClient } from "shinauth/client";

export const authClient = createAuthClient({
	baseURL: "http://localhost:3000/api/auth",
	plugins: [
		electronClient({
			protocol: {
				scheme: "com.better-auth.demo",
			},
			signInURL: "http://localhost:3000/sign-in",
			storage: storage(),
		}),
	],
});
