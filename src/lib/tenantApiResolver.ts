import "server-only";

import { getTenantApiEntryPoint } from "@/service/tenant-routing.service";
import { parseFrontendHost } from "./tenantHost";

const TENANT_API_HOST_PATTERN =
    /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.ieum\.store$/;

function getRequiredBaseUrl(name: "TENANT_ROUTING_ORIGIN" | "LOCAL_API_BASE_URL"): string {
    const baseUrl = process.env[name]?.trim().replace(/\/+$/, "");

    if (!baseUrl) {
        throw new Error(`${name} is required`);
    }

    return baseUrl;
}

export async function resolveApiBaseUrl(host: string): Promise<string> {
    const frontendTenant = parseFrontendHost(host);

    if (frontendTenant.type === "root") {
        return getRequiredBaseUrl("TENANT_ROUTING_ORIGIN");
    }

    if (frontendTenant.type === "local") {
        if (process.env.NODE_ENV === "production") {
            throw new Error("운영 환경에서는 localhost를 사용할 수 없습니다.");
        }

        return getRequiredBaseUrl("LOCAL_API_BASE_URL");
    }

    const entryPoint = await getTenantApiEntryPoint(frontendTenant.tenantCode);

    if (entryPoint.data.code !== frontendTenant.tenantCode) {
        throw new Error("테넌트 라우팅 응답이 요청과 일치하지 않습니다.");
    }

    const apiHost = entryPoint.data.apiHost.trim().toLowerCase();

    if (!TENANT_API_HOST_PATTERN.test(apiHost)) {
        throw new Error("유효하지 않은 테넌트 API 호스트입니다.");
    }

    return `https://${apiHost}`;
}
