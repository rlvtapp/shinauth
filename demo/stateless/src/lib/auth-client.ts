import { createAuthClient } from "shinauth/react";

export const authClient = createAuthClient();

export const { signIn, signOut, useSession } = authClient;
