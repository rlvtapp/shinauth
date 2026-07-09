import { describe, expect, it, vi } from "vitest";
import { getTestInstance } from "../../test-utils/test-instance";
import { isAPIError } from "../../utils/is-api-error";
import { organization } from "../organization";
import { organizationClient } from "../organization/client";
import type { AccountMergeOptions } from ".";
import { accountMerge } from ".";

describe("accountMerge", async () => {
	it("moves source accounts into the target user and deletes the source user", async () => {
		const { auth, signInWithTestUser, signInWithUser } = await getTestInstance({
			plugins: [accountMerge({ authorizeMerge: () => true })],
		});
		const ctx = await auth.$context;
		await auth.api.signUpEmail({
			body: {
				email: "source@example.com",
				password: "password1234",
				name: "Source User",
			},
		});
		const target = await signInWithTestUser();
		const source = await signInWithUser("source@example.com", "password1234");
		await ctx.internalAdapter.createAccount({
			userId: source.res.user.id,
			providerId: "github",
			accountId: "github-source",
		});

		const request = await auth.api.createAccountMergeRequest({
			headers: target.headers,
		});

		const result = await auth.api.confirmAccountMerge({
			headers: source.headers,
			body: { token: request.token },
		});

		expect(result.targetUser.id).toBe(target.user.id);
		expect(
			await ctx.internalAdapter.findUserById(source.res.user.id),
		).toBeNull();
		const targetAccounts = await ctx.internalAdapter.findAccounts(
			target.user.id,
		);
		expect(
			targetAccounts.some(
				(account) =>
					account.providerId === "github" &&
					account.accountId === "github-source",
			),
		).toBe(true);
	});

	it("deduplicates matching provider accounts during merge", async () => {
		const { auth, signInWithTestUser, signInWithUser } = await getTestInstance({
			plugins: [accountMerge({ authorizeMerge: () => true })],
		});
		const ctx = await auth.$context;
		await auth.api.signUpEmail({
			body: {
				email: "source-dedupe@example.com",
				password: "password1234",
				name: "Source User",
			},
		});
		const target = await signInWithTestUser();
		const source = await signInWithUser(
			"source-dedupe@example.com",
			"password1234",
		);
		await ctx.internalAdapter.createAccount({
			userId: target.user.id,
			providerId: "github",
			accountId: "same-github",
		});
		await ctx.internalAdapter.createAccount({
			userId: source.res.user.id,
			providerId: "github",
			accountId: "same-github",
		});

		const request = await auth.api.createAccountMergeRequest({
			headers: target.headers,
		});
		await auth.api.confirmAccountMerge({
			headers: source.headers,
			body: { token: request.token },
		});

		const targetAccounts = await ctx.internalAdapter.findAccounts(
			target.user.id,
		);
		expect(
			targetAccounts.filter(
				(account) =>
					account.providerId === "github" &&
					account.accountId === "same-github",
			),
		).toHaveLength(1);
	});

	it("merges organization memberships and keeps the higher role", async () => {
		const { auth, signInWithTestUser, signInWithUser, client } =
			await getTestInstance(
				{
					plugins: [
						organization(),
						accountMerge({ authorizeMerge: () => true }),
					],
				},
				{
					clientOptions: {
						plugins: [organizationClient()],
					},
				},
			);
		const ctx = await auth.$context;
		await auth.api.signUpEmail({
			body: {
				email: "source-member@example.com",
				password: "password1234",
				name: "Source User",
			},
		});
		const target = await signInWithTestUser();
		const source = await signInWithUser(
			"source-member@example.com",
			"password1234",
		);
		const org = await client.organization.create({
			name: "Merge Org",
			slug: "merge-org",
			fetchOptions: { headers: target.headers, throw: true },
		});
		await ctx.adapter.create({
			model: "member",
			data: {
				organizationId: org.id,
				userId: source.res.user.id,
				role: "owner",
				createdAt: new Date(),
			},
		});

		const request = await auth.api.createAccountMergeRequest({
			headers: target.headers,
		});
		await auth.api.confirmAccountMerge({
			headers: source.headers,
			body: { token: request.token },
		});

		const memberships = await ctx.adapter.findMany<{
			organizationId: string;
			userId: string;
			role: string;
		}>({
			model: "member",
			where: [
				{ field: "organizationId", value: org.id },
				{ field: "userId", value: target.user.id },
			],
		});
		expect(memberships).toHaveLength(1);
		expect(memberships[0]?.role).toBe("owner");
	});

	it("previews what will happen before confirm", async () => {
		const { auth, signInWithTestUser, signInWithUser, client } =
			await getTestInstance(
				{
					plugins: [
						organization(),
						accountMerge({ authorizeMerge: () => true }),
					],
				},
				{
					clientOptions: {
						plugins: [organizationClient()],
					},
				},
			);
		const ctx = await auth.$context;
		await auth.api.signUpEmail({
			body: {
				email: "source-preview@example.com",
				password: "password1234",
				name: "Source User",
			},
		});
		const target = await signInWithTestUser();
		const source = await signInWithUser(
			"source-preview@example.com",
			"password1234",
		);
		await ctx.internalAdapter.createAccount({
			userId: source.res.user.id,
			providerId: "github",
			accountId: "github-preview-move",
		});
		await ctx.internalAdapter.createAccount({
			userId: target.user.id,
			providerId: "google",
			accountId: "google-preview-duplicate",
		});
		await ctx.internalAdapter.createAccount({
			userId: source.res.user.id,
			providerId: "google",
			accountId: "google-preview-duplicate",
		});
		const org = await client.organization.create({
			name: "Preview Org",
			slug: "preview-org",
			fetchOptions: { headers: target.headers, throw: true },
		});
		const [targetMembership] = await ctx.adapter.findMany<{ id: string }>({
			model: "member",
			where: [
				{ field: "organizationId", value: org.id },
				{ field: "userId", value: target.user.id },
			],
		});
		expect(targetMembership).toBeDefined();
		await ctx.adapter.update({
			model: "member",
			where: [{ field: "id", value: targetMembership!.id }],
			update: { role: "member" },
		});
		await ctx.adapter.create({
			model: "member",
			data: {
				organizationId: org.id,
				userId: source.res.user.id,
				role: "owner",
				createdAt: new Date(),
			},
		});

		const request = await auth.api.createAccountMergeRequest({
			headers: target.headers,
			body: {
				reason: "provider-conflict",
				providerId: "github",
				accountId: "github-preview-move",
			},
		});
		const preview = await auth.api.getAccountMergeRequest({
			headers: source.headers,
			query: { token: request.token },
		});

		expect(preview.state).toBe("ready");
		expect(preview.request).toMatchObject({
			reason: "provider-conflict",
			providerId: "github",
			accountId: "github-preview-move",
		});
		expect(preview.plan?.accounts.move).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					providerId: "github",
					accountId: "github-preview-move",
				}),
			]),
		);
		expect(preview.plan?.accounts.duplicates).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					providerId: "google",
					accountId: "google-preview-duplicate",
				}),
			]),
		);
		expect(preview.plan?.organizations.mergeRoles).toEqual([
			expect.objectContaining({
				organizationId: org.id,
				sourceRole: "owner",
				targetRole: "member",
				resultRole: "owner",
			}),
		]);
		expect(preview.plan?.sessions.sourceSessionsWillBeDeleted).toBe(true);
	});

	it("runs hooks inside the merge flow", async () => {
		const afterMergeContexts: Array<
			Parameters<NonNullable<AccountMergeOptions["afterMerge"]>>[0]
		> = [];
		const afterMerge: NonNullable<AccountMergeOptions["afterMerge"]> = async (
			context,
		) => {
			afterMergeContexts.push(context);
		};
		const { auth, signInWithTestUser, signInWithUser } = await getTestInstance({
			plugins: [accountMerge({ authorizeMerge: () => true, afterMerge })],
		});
		await auth.api.signUpEmail({
			body: {
				email: "source-hook@example.com",
				password: "password1234",
				name: "Source User",
			},
		});
		const target = await signInWithTestUser();
		const source = await signInWithUser(
			"source-hook@example.com",
			"password1234",
		);
		const request = await auth.api.createAccountMergeRequest({
			headers: target.headers,
		});

		await auth.api.confirmAccountMerge({
			headers: source.headers,
			body: { token: request.token },
		});

		expect(afterMergeContexts).toHaveLength(1);
		expect(afterMergeContexts[0]?.sourceUser.id).toBe(source.res.user.id);
		expect(afterMergeContexts[0]?.targetUser.id).toBe(target.user.id);
	});

	it("rejects merges that fail the default authorization policy", async () => {
		const { auth, signInWithTestUser, signInWithUser } = await getTestInstance({
			plugins: [accountMerge()],
		});
		await auth.api.signUpEmail({
			body: {
				email: "source-policy@example.com",
				password: "password1234",
				name: "Source User",
			},
		});
		const target = await signInWithTestUser();
		const source = await signInWithUser(
			"source-policy@example.com",
			"password1234",
		);
		const request = await auth.api.createAccountMergeRequest({
			headers: target.headers,
		});

		const result = await auth.api
			.confirmAccountMerge({
				headers: source.headers,
				body: { token: request.token },
			})
			.catch((error) => error);

		expect(isAPIError(result)).toBe(true);
		expect(
			await (await auth.$context).internalAdapter.findUserById(
				source.res.user.id,
			),
		).not.toBeNull();
	});

	it("passes merge intent to authorization and hooks", async () => {
		const authorizeMerge = vi.fn(({ request }) => {
			return (
				request.reason === "provider-conflict" &&
				request.providerId === "github" &&
				request.accountId === "github-intent"
			);
		});
		const afterMergeContexts: Array<
			Parameters<NonNullable<AccountMergeOptions["afterMerge"]>>[0]
		> = [];
		const afterMerge: NonNullable<AccountMergeOptions["afterMerge"]> = async (
			context,
		) => {
			afterMergeContexts.push(context);
		};
		const { auth, signInWithTestUser, signInWithUser } = await getTestInstance({
			plugins: [accountMerge({ authorizeMerge, afterMerge })],
		});
		await auth.api.signUpEmail({
			body: {
				email: "source-intent@example.com",
				password: "password1234",
				name: "Source User",
			},
		});
		const target = await signInWithTestUser();
		const source = await signInWithUser(
			"source-intent@example.com",
			"password1234",
		);
		const request = await auth.api.createAccountMergeRequest({
			headers: target.headers,
			body: {
				reason: "provider-conflict",
				providerId: "github",
				accountId: "github-intent",
			},
		});

		await auth.api.confirmAccountMerge({
			headers: source.headers,
			body: { token: request.token },
		});

		expect(authorizeMerge).toHaveBeenCalledOnce();
		expect(afterMergeContexts).toHaveLength(1);
		expect(afterMergeContexts[0]?.request).toMatchObject({
			reason: "provider-conflict",
			providerId: "github",
			accountId: "github-intent",
		});
	});

	it("rejects reused merge tokens", async () => {
		const { auth, signInWithTestUser, signInWithUser } = await getTestInstance({
			plugins: [accountMerge({ authorizeMerge: () => true })],
		});
		await auth.api.signUpEmail({
			body: {
				email: "source-reuse@example.com",
				password: "password1234",
				name: "Source User",
			},
		});
		await auth.api.signUpEmail({
			body: {
				email: "source-reuse-second@example.com",
				password: "password1234",
				name: "Source User Two",
			},
		});
		const target = await signInWithTestUser();
		const source = await signInWithUser(
			"source-reuse@example.com",
			"password1234",
		);
		const secondSource = await signInWithUser(
			"source-reuse-second@example.com",
			"password1234",
		);
		const request = await auth.api.createAccountMergeRequest({
			headers: target.headers,
		});
		await auth.api.confirmAccountMerge({
			headers: source.headers,
			body: { token: request.token },
		});

		const secondResult = await auth.api
			.confirmAccountMerge({
				headers: secondSource.headers,
				body: { token: request.token },
			})
			.catch((error) => error);

		expect(isAPIError(secondResult)).toBe(true);
	});
});
