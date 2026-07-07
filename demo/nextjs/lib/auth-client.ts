import { electronProxyClient } from "@shinauth/electron/proxy";
import { dashClient } from "@shinauth/infra/client";
import { oauthProviderClient } from "@shinauth/oauth-provider/client";
import { passkeyClient } from "@shinauth/passkey/client";
import { stripeClient } from "@shinauth/stripe/client";
import {
	adminClient,
	customSessionClient,
	deviceAuthorizationClient,
	lastLoginMethodClient,
	multiSessionClient,
	oneTapClient,
	organizationClient,
	twoFactorClient,
} from "shinauth/client/plugins";
import { createAuthClient } from "shinauth/react";
import { toast } from "sonner";
import type { auth } from "./auth";

export const authClient = createAuthClient({
	plugins: [
		dashClient(),
		organizationClient(),
		twoFactorClient({
			onTwoFactorRedirect() {
				window.location.href = "/two-factor";
			},
		}),
		passkeyClient(),
		adminClient(),
		multiSessionClient(),
		oneTapClient({
			clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
			promptOptions: {
				maxAttempts: 1,
			},
		}),
		oauthProviderClient(),
		stripeClient({
			subscription: true,
		}),
		customSessionClient<typeof auth>(),
		deviceAuthorizationClient(),
		lastLoginMethodClient(),
		electronProxyClient({
			protocol: {
				scheme: "com.better-auth.demo",
			},
		}),
	],
	fetchOptions: {
		onError(e) {
			if (e.error.status === 429) {
				toast.error("Too many requests. Please try again later.");
			}
		},
	},
});
