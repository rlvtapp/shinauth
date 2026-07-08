import { oauthProviderResourceClient } from "@shinauth/oauth-provider/resource-client";
import { createAuthClient } from "shinauth/client";
import { auth } from "./auth";

export const serverClient = createAuthClient({
	plugins: [oauthProviderResourceClient(auth)],
});
