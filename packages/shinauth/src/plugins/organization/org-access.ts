import type { GenericEndpointContext } from "@shinauth/core";
import { APIError } from "@shinauth/core/error";
import { ORGANIZATION_ERROR_CODES } from "./error-codes";

type SsoPluginForOrganizationAccess = {
	options?: {
		orgAccess?: {
			enabled?: boolean;
			requireSsoByDefault?: boolean;
		};
	};
};

type SsoProviderForOrganizationAccess = {
	providerId: string;
	organizationId?: string | null;
	requireSsoForOrgAccess?: boolean | null;
};

function getSsoOrgAccessOptions(ctx: GenericEndpointContext) {
	const ssoPlugin = ctx.context.getPlugin(
		"sso",
	) as SsoPluginForOrganizationAccess | null;
	return ssoPlugin?.options?.orgAccess;
}

export async function isOrganizationVisibleForSession(
	ctx: GenericEndpointContext,
	organizationId: string,
) {
	const orgAccess = getSsoOrgAccessOptions(ctx);
	if (!orgAccess?.enabled) {
		return true;
	}

	const ssoProviders =
		await ctx.context.adapter.findMany<SsoProviderForOrganizationAccess>({
			model: "ssoProvider",
			where: [{ field: "organizationId", value: organizationId }],
		});
	if (ssoProviders.length === 0) {
		return true;
	}

	const requiredProviders = ssoProviders.filter(
		(provider) =>
			provider.requireSsoForOrgAccess ?? orgAccess.requireSsoByDefault ?? false,
	);
	if (requiredProviders.length === 0) {
		return true;
	}

	const session = ctx.context.session?.session as
		| { authSource?: string | null; authProviderId?: string | null }
		| undefined;
	if (
		session?.authSource !== "sso-oidc" &&
		session?.authSource !== "sso-saml"
	) {
		return false;
	}

	return ssoProviders.some(
		(provider) => provider.providerId === session.authProviderId,
	);
}

export async function assertOrganizationVisibleForSession(
	ctx: GenericEndpointContext,
	organizationId: string,
) {
	if (await isOrganizationVisibleForSession(ctx, organizationId)) {
		return;
	}
	throw APIError.from(
		"FORBIDDEN",
		ORGANIZATION_ERROR_CODES.USER_IS_NOT_A_MEMBER_OF_THE_ORGANIZATION,
	);
}

export async function filterOrganizationsVisibleForSession<
	Organization extends { id: string },
>(ctx: GenericEndpointContext, organizations: Organization[]) {
	const orgAccess = getSsoOrgAccessOptions(ctx);
	if (!orgAccess?.enabled) {
		return organizations;
	}
	const visibleOrganizations = await Promise.all(
		organizations.map(async (organization) => ({
			organization,
			visible: await isOrganizationVisibleForSession(ctx, organization.id),
		})),
	);
	return visibleOrganizations
		.filter((entry) => entry.visible)
		.map((entry) => entry.organization);
}
