/**
 * @see https://github.com/rlvtapp/shinauth/issues/9212
 */
import { passkey } from "@shinauth/passkey";
import { passkeyClient } from "@shinauth/passkey/client";
import { betterAuth } from "shinauth";
import { createAuthClient } from "shinauth/react";

export const auth = betterAuth({
	plugins: [
		passkey({
			rpID: "localhost",
			rpName: "App",
			origin: "http://localhost:3000",
		}),
	],
});

export const authWithoutSessionRequired = betterAuth({
	plugins: [
		passkey({
			rpID: "localhost",
			rpName: "App",
			origin: "http://localhost:3000",
			registration: {
				requireSession: false,
			},
		}),
	],
});

export const authClient = createAuthClient({
	baseURL: "http://localhost:3000",
	plugins: [passkeyClient()],
});

authClient.signIn.passkey;
authClient.passkey.addPasskey;
