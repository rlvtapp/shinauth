import type { BetterAuthPlugin, GenericEndpointContext } from "@shinauth/core";
import { createAuthEndpoint } from "@shinauth/core/api";
import { getCurrentAdapter, runWithTransaction } from "@shinauth/core/context";
import type { DBTransactionAdapter, Where } from "@shinauth/core/db/adapter";
import * as z from "zod";
import { APIError, sessionMiddleware } from "../../api";
import { generateRandomString } from "../../crypto";
import type { Account, User } from "../../types";
import { PACKAGE_VERSION } from "../../version";

declare module "@shinauth/core" {
	interface BetterAuthPluginRegistry<AuthOptions, Options> {
		"account-merge": {
			creator: typeof accountMerge;
		};
	}
}

type MergeHookContext = {
	ctx: GenericEndpointContext;
	adapter: DBTransactionAdapter;
	sourceUser: User & Record<string, unknown>;
	targetUser: User & Record<string, unknown>;
	request: AccountMergeVerificationValue;
};

export interface AccountMergeOptions {
	/**
	 * Merge request lifetime in seconds.
	 *
	 * @default 900
	 */
	expiresIn?: number | undefined;
	/**
	 * Merge organization memberships when the organization plugin is enabled.
	 *
	 * @default true
	 */
	mergeOrganizationMemberships?: boolean | undefined;
	/**
	 * Decide whether the signed-in source user may merge into the target user.
	 *
	 * By default, only same-email users are allowed. Apps that start merges from
	 * provider conflicts can inspect request.reason/providerId/accountId here.
	 */
	authorizeMerge?:
		| ((context: MergeHookContext) => boolean | void | Promise<boolean | void>)
		| undefined;
	/**
	 * Called inside the merge transaction before built-in data is moved.
	 */
	beforeMerge?: ((context: MergeHookContext) => Promise<void>) | undefined;
	/**
	 * Called inside the merge transaction after built-in data is moved and before
	 * the source user is deleted. Use this to move app-owned rows.
	 */
	afterMerge?: ((context: MergeHookContext) => Promise<void>) | undefined;
}

type AccountMergeVerificationValue = {
	targetUserId: string;
	reason?: string | undefined;
	providerId?: string | undefined;
	accountId?: string | undefined;
};

type AccountRecord = Account & Record<string, unknown>;

type MemberRecord = {
	id: string;
	organizationId: string;
	userId: string;
	role: string;
} & Record<string, unknown>;

type AccountMergePlanAccount = {
	id: string;
	providerId: string;
	accountId: string;
};

type AccountMergePlanMembership = {
	id: string;
	organizationId: string;
	role: string;
};

type AccountMergePlanRoleMerge = {
	organizationId: string;
	sourceRole: string;
	targetRole: string;
	resultRole: string;
};

type AccountMergePlan = {
	accounts: {
		move: AccountMergePlanAccount[];
		duplicates: AccountMergePlanAccount[];
	};
	organizations: {
		enabled: boolean;
		move: AccountMergePlanMembership[];
		mergeRoles: AccountMergePlanRoleMerge[];
		duplicates: AccountMergePlanMembership[];
	};
	sessions: {
		sourceSessionsWillBeDeleted: true;
	};
};

type RequiredAccountMergeOptions = Required<
	Pick<AccountMergeOptions, "mergeOrganizationMemberships">
> &
	Pick<AccountMergeOptions, "authorizeMerge" | "beforeMerge" | "afterMerge">;

const DEFAULT_EXPIRES_IN_SECONDS = 15 * 60;
const VERIFICATION_PREFIX = "account-merge";

const accountMergeTokenBodySchema = z.object({
	token: z.string(),
});

const accountMergeTokenQuerySchema = z.object({
	token: z.string(),
});

const createAccountMergeRequestBodySchema = z
	.object({
		reason: z.string().optional(),
		providerId: z.string().optional(),
		accountId: z.string().optional(),
	})
	.optional();

function verificationIdentifier(token: string) {
	return `${VERIFICATION_PREFIX}:${token}`;
}

function serializeMergeValue(value: AccountMergeVerificationValue) {
	return JSON.stringify(value);
}

function parseMergeValue(value: string): AccountMergeVerificationValue | null {
	try {
		const parsed = JSON.parse(value) as unknown;
		if (
			parsed &&
			typeof parsed === "object" &&
			"targetUserId" in parsed &&
			typeof parsed.targetUserId === "string"
		) {
			return {
				targetUserId: parsed.targetUserId,
				reason:
					"reason" in parsed && typeof parsed.reason === "string"
						? parsed.reason
						: undefined,
				providerId:
					"providerId" in parsed && typeof parsed.providerId === "string"
						? parsed.providerId
						: undefined,
				accountId:
					"accountId" in parsed && typeof parsed.accountId === "string"
						? parsed.accountId
						: undefined,
			};
		}
	} catch {}
	return null;
}

function defaultAuthorizeMerge({
	sourceUser,
	targetUser,
}: MergeHookContext): boolean {
	return (
		typeof sourceUser.email === "string" &&
		sourceUser.email.length > 0 &&
		sourceUser.email === targetUser.email &&
		sourceUser.emailVerified === true &&
		targetUser.emailVerified === true
	);
}

function roleRank(role: string | null | undefined) {
	switch (role) {
		case "owner":
			return 3;
		case "admin":
			return 2;
		case "member":
			return 1;
		default:
			return 0;
	}
}

function pickHigherRole(
	left: string | null | undefined,
	right: string | null | undefined,
) {
	return roleRank(right) > roleRank(left)
		? (right ?? left ?? "member")
		: (left ?? right ?? "member");
}

async function findUser(adapter: DBTransactionAdapter, userId: string) {
	return adapter.findOne<User & Record<string, unknown>>({
		model: "user",
		where: [{ field: "id", value: userId }],
	});
}

async function readMergeRequest(ctx: GenericEndpointContext, token: string) {
	const verification = await ctx.context.internalAdapter.findVerificationValue(
		verificationIdentifier(token),
	);
	if (!verification) return null;
	if (verification.expiresAt <= new Date()) {
		await ctx.context.internalAdapter.deleteVerificationByIdentifier(
			verificationIdentifier(token),
		);
		return null;
	}
	return parseMergeValue(verification.value);
}

function accountPlanEntry(account: AccountRecord): AccountMergePlanAccount {
	return {
		id: account.id,
		providerId: account.providerId,
		accountId: account.accountId,
	};
}

function membershipPlanEntry(
	membership: MemberRecord,
): AccountMergePlanMembership {
	return {
		id: membership.id,
		organizationId: membership.organizationId,
		role: membership.role,
	};
}

async function getAccountMergeAccountPlan(
	adapter: DBTransactionAdapter,
	sourceUserId: string,
	targetUserId: string,
) {
	const [sourceAccounts, targetAccounts] = await Promise.all([
		adapter.findMany<AccountRecord>({
			model: "account",
			where: [{ field: "userId", value: sourceUserId }],
		}),
		adapter.findMany<AccountRecord>({
			model: "account",
			where: [{ field: "userId", value: targetUserId }],
		}),
	]);

	const targetAccountKeys = new Set(
		targetAccounts.map((entry) => `${entry.providerId}:${entry.accountId}`),
	);

	return sourceAccounts.reduce(
		(plan, sourceAccount) => {
			const accountKey = `${sourceAccount.providerId}:${sourceAccount.accountId}`;
			if (targetAccountKeys.has(accountKey)) {
				plan.duplicates.push(accountPlanEntry(sourceAccount));
			} else {
				plan.move.push(accountPlanEntry(sourceAccount));
			}
			return plan;
		},
		{
			move: [] as AccountMergePlanAccount[],
			duplicates: [] as AccountMergePlanAccount[],
		},
	);
}

async function getAccountMergeOrganizationPlan(
	ctx: GenericEndpointContext,
	adapter: DBTransactionAdapter,
	options: RequiredAccountMergeOptions,
	sourceUserId: string,
	targetUserId: string,
): Promise<AccountMergePlan["organizations"]> {
	const emptyPlan = {
		enabled: false,
		move: [],
		mergeRoles: [],
		duplicates: [],
	};
	if (
		!options.mergeOrganizationMemberships ||
		!ctx.context.hasPlugin("organization")
	) {
		return emptyPlan;
	}

	const [sourceMemberships, targetMemberships] = await Promise.all([
		adapter.findMany<MemberRecord>({
			model: "member",
			where: [{ field: "userId", value: sourceUserId }],
		}),
		adapter.findMany<MemberRecord>({
			model: "member",
			where: [{ field: "userId", value: targetUserId }],
		}),
	]);

	const targetMembershipByOrg = new Map(
		targetMemberships.map((entry) => [entry.organizationId, entry]),
	);

	return sourceMemberships.reduce<AccountMergePlan["organizations"]>(
		(plan, sourceMembership) => {
			const existingMembership = targetMembershipByOrg.get(
				sourceMembership.organizationId,
			);
			if (!existingMembership) {
				plan.move.push(membershipPlanEntry(sourceMembership));
				return plan;
			}

			const resultRole = pickHigherRole(
				existingMembership.role,
				sourceMembership.role,
			);
			if (resultRole !== existingMembership.role) {
				plan.mergeRoles.push({
					organizationId: sourceMembership.organizationId,
					sourceRole: sourceMembership.role,
					targetRole: existingMembership.role,
					resultRole,
				});
			} else {
				plan.duplicates.push(membershipPlanEntry(sourceMembership));
			}
			return plan;
		},
		{
			enabled: true,
			move: [],
			mergeRoles: [],
			duplicates: [],
		},
	);
}

async function getAccountMergePlan(
	ctx: GenericEndpointContext,
	adapter: DBTransactionAdapter,
	options: RequiredAccountMergeOptions,
	sourceUserId: string,
	targetUserId: string,
): Promise<AccountMergePlan> {
	const [accounts, organizations] = await Promise.all([
		getAccountMergeAccountPlan(adapter, sourceUserId, targetUserId),
		getAccountMergeOrganizationPlan(
			ctx,
			adapter,
			options,
			sourceUserId,
			targetUserId,
		),
	]);

	return {
		accounts,
		organizations,
		sessions: {
			sourceSessionsWillBeDeleted: true,
		},
	};
}

async function moveAccounts(
	adapter: DBTransactionAdapter,
	sourceUserId: string,
	targetUserId: string,
) {
	const [sourceAccounts, targetAccounts] = await Promise.all([
		adapter.findMany<AccountRecord>({
			model: "account",
			where: [{ field: "userId", value: sourceUserId }],
		}),
		adapter.findMany<AccountRecord>({
			model: "account",
			where: [{ field: "userId", value: targetUserId }],
		}),
	]);

	const targetAccountKeys = new Set(
		targetAccounts.map((entry) => `${entry.providerId}:${entry.accountId}`),
	);

	for (const sourceAccount of sourceAccounts) {
		const accountKey = `${sourceAccount.providerId}:${sourceAccount.accountId}`;
		if (targetAccountKeys.has(accountKey)) {
			await adapter.delete({
				model: "account",
				where: [{ field: "id", value: sourceAccount.id }],
			});
			continue;
		}

		await adapter.update({
			model: "account",
			where: [{ field: "id", value: sourceAccount.id }],
			update: { userId: targetUserId },
		});
	}
}

async function moveOrganizationMemberships(
	ctx: GenericEndpointContext,
	adapter: DBTransactionAdapter,
	sourceUserId: string,
	targetUserId: string,
) {
	if (!ctx.context.hasPlugin("organization")) return;
	const [sourceMemberships, targetMemberships] = await Promise.all([
		adapter.findMany<MemberRecord>({
			model: "member",
			where: [{ field: "userId", value: sourceUserId }],
		}),
		adapter.findMany<MemberRecord>({
			model: "member",
			where: [{ field: "userId", value: targetUserId }],
		}),
	]);

	const targetMembershipByOrg = new Map(
		targetMemberships.map((entry) => [entry.organizationId, entry]),
	);

	for (const sourceMembership of sourceMemberships) {
		const existingMembership = targetMembershipByOrg.get(
			sourceMembership.organizationId,
		);
		if (!existingMembership) {
			await adapter.update({
				model: "member",
				where: [{ field: "id", value: sourceMembership.id }],
				update: { userId: targetUserId },
			});
			continue;
		}

		const higherRole = pickHigherRole(
			existingMembership.role,
			sourceMembership.role,
		);
		if (higherRole !== existingMembership.role) {
			await adapter.update({
				model: "member",
				where: [{ field: "id", value: existingMembership.id }],
				update: { role: higherRole },
			});
		}

		await adapter.delete({
			model: "member",
			where: [{ field: "id", value: sourceMembership.id }],
		});
	}
}

async function updatePluginModelUserId(
	ctx: GenericEndpointContext,
	adapter: DBTransactionAdapter,
	pluginId: string,
	model: string,
	where: Where[],
	update: Record<string, string>,
) {
	if (!ctx.context.hasPlugin(pluginId)) return;
	await adapter.updateMany({ model, where, update });
}

async function mergeUsers(
	ctx: GenericEndpointContext,
	options: RequiredAccountMergeOptions,
	data: AccountMergeVerificationValue,
) {
	const sourceUserId = ctx.context.session?.user.id;
	if (!sourceUserId) {
		throw new APIError("UNAUTHORIZED", {
			message: "You must be signed in to merge accounts.",
		});
	}
	const targetUserId = data.targetUserId;
	if (sourceUserId === targetUserId) {
		throw new APIError("BAD_REQUEST", {
			message: "Choose a different account to merge.",
		});
	}

	return runWithTransaction(ctx.context.adapter, async () => {
		const adapter = await getCurrentAdapter(ctx.context.adapter);
		const [sourceUser, targetUser] = await Promise.all([
			findUser(adapter, sourceUserId),
			findUser(adapter, targetUserId),
		]);

		if (!sourceUser || !targetUser) {
			throw new APIError("BAD_REQUEST", {
				message: "The selected accounts could not be found.",
			});
		}

		const hookContext = { ctx, adapter, sourceUser, targetUser, request: data };
		const authorized = await (options.authorizeMerge ?? defaultAuthorizeMerge)(
			hookContext,
		);
		if (authorized === false) {
			throw new APIError("FORBIDDEN", {
				message: "You are not allowed to merge these accounts.",
			});
		}
		await options.beforeMerge?.(hookContext);
		await moveAccounts(adapter, sourceUserId, targetUserId);
		if (options.mergeOrganizationMemberships) {
			await moveOrganizationMemberships(
				ctx,
				adapter,
				sourceUserId,
				targetUserId,
			);
		}
		await updatePluginModelUserId(
			ctx,
			adapter,
			"sso",
			"ssoProvider",
			[{ field: "userId", value: sourceUserId }],
			{ userId: targetUserId },
		);
		await options.afterMerge?.(hookContext);
		await adapter.deleteMany({
			model: "session",
			where: [{ field: "userId", value: sourceUserId }],
		});
		await adapter.delete({
			model: "user",
			where: [{ field: "id", value: sourceUserId }],
		});

		return { sourceUser, targetUser };
	});
}

export const accountMerge = (options?: AccountMergeOptions | undefined) => {
	const expiresIn = options?.expiresIn ?? DEFAULT_EXPIRES_IN_SECONDS;
	const opts: RequiredAccountMergeOptions = {
		mergeOrganizationMemberships: options?.mergeOrganizationMemberships ?? true,
		authorizeMerge: options?.authorizeMerge,
		beforeMerge: options?.beforeMerge,
		afterMerge: options?.afterMerge,
	};

	return {
		id: "account-merge",
		version: PACKAGE_VERSION,
		endpoints: {
			/**
			 * ### Endpoint
			 *
			 * POST `/account-merge/create-request`
			 */
			createAccountMergeRequest: createAuthEndpoint(
				"/account-merge/create-request",
				{
					method: "POST",
					use: [sessionMiddleware],
					body: createAccountMergeRequestBodySchema,
				},
				async (ctx) => {
					const targetUserId = ctx.context.session?.user.id;
					if (!targetUserId) {
						throw new APIError("UNAUTHORIZED", {
							message: "You must be signed in to create a merge request.",
						});
					}
					const targetUser =
						await ctx.context.internalAdapter.findUserById(targetUserId);
					if (!targetUser) {
						throw new APIError("NOT_FOUND", {
							message: "Target user not found",
						});
					}
					const token = generateRandomString(32, "a-z", "A-Z", "0-9");
					const expiresAt = new Date(Date.now() + expiresIn * 1000);
					await ctx.context.internalAdapter.createVerificationValue({
						identifier: verificationIdentifier(token),
						value: serializeMergeValue({
							targetUserId,
							reason: ctx.body?.reason,
							providerId: ctx.body?.providerId,
							accountId: ctx.body?.accountId,
						}),
						expiresAt,
					});
					return ctx.json({ token, expiresAt });
				},
			),
			/**
			 * ### Endpoint
			 *
			 * GET `/account-merge/get-request`
			 */
			getAccountMergeRequest: createAuthEndpoint(
				"/account-merge/get-request",
				{
					method: "GET",
					use: [sessionMiddleware],
					query: accountMergeTokenQuerySchema,
				},
				async (ctx) => {
					const currentUser = ctx.context.session?.user;
					if (!currentUser) {
						throw new APIError("UNAUTHORIZED", {
							message: "You must be signed in to inspect a merge request.",
						});
					}
					const request = await readMergeRequest(ctx, ctx.query.token);
					if (!request) {
						throw new APIError("NOT_FOUND", {
							message: "Merge request not found or expired",
						});
					}
					const adapter = await getCurrentAdapter(ctx.context.adapter);
					const targetUser = await findUser(adapter, request.targetUserId);
					if (!targetUser) {
						throw new APIError("NOT_FOUND", {
							message: "Target user not found",
						});
					}
					const state =
						currentUser.id === request.targetUserId ? "same-user" : "ready";
					const plan =
						state === "ready"
							? await getAccountMergePlan(
									ctx,
									adapter,
									opts,
									currentUser.id,
									request.targetUserId,
								)
							: null;
					return ctx.json({
						state,
						targetUser,
						currentUser,
						request,
						plan,
					});
				},
			),
			/**
			 * ### Endpoint
			 *
			 * POST `/account-merge/confirm`
			 */
			confirmAccountMerge: createAuthEndpoint(
				"/account-merge/confirm",
				{
					method: "POST",
					use: [sessionMiddleware],
					body: accountMergeTokenBodySchema,
				},
				async (ctx) => {
					const verification =
						await ctx.context.internalAdapter.consumeVerificationValue(
							verificationIdentifier(ctx.body.token),
						);
					if (!verification || verification.expiresAt <= new Date()) {
						throw new APIError("NOT_FOUND", {
							message: "Merge request not found or expired",
						});
					}
					const request = parseMergeValue(verification.value);
					if (!request) {
						throw new APIError("BAD_REQUEST", {
							message: "Merge request is invalid",
						});
					}
					const result = await mergeUsers(ctx, opts, request);
					return ctx.json({
						sourceUser: result.sourceUser,
						targetUser: result.targetUser,
					});
				},
			),
		},
		options,
	} satisfies BetterAuthPlugin;
};
