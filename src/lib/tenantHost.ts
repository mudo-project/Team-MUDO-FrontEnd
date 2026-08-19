export type FrontendTenant =
    | { type: "root" }
    | { type: "tenant"; tenantCode: string }
    | { type: "local" };

const ROOT_FRONTEND_HOST = "ieum.store";
const LOCAL_FRONTEND_HOST = "localhost";
const TENANT_FRONTEND_HOST_PATTERN = /^app-([a-z0-9]+(?:-[a-z0-9]+)*)\.ieum\.store$/;

export function parseFrontendHost(host: string): FrontendTenant {
    const normalizedHost = host.trim().toLowerCase().split(":", 1)[0];

    if (normalizedHost === ROOT_FRONTEND_HOST) {
        return { type: "root" };
    }

    if (normalizedHost === LOCAL_FRONTEND_HOST) {
        return { type: "local" };
    }

    const tenantMatch = normalizedHost.match(TENANT_FRONTEND_HOST_PATTERN);

    if (tenantMatch) {
        return { type: "tenant", tenantCode: tenantMatch[1] };
    }

    throw new Error("지원하지 않는 프론트 도메인입니다.");
}
