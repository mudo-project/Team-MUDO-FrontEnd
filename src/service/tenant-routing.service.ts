import "server-only";

import type { TenantEntryPointResponse } from "@/feature/tenant-routing/type";
import { getErrorMessage } from "@/lib/responseError";

const TENANT_ENTRY_POINT_ERROR_CODES: Record<number, string> = {
    404: "PLATFORM_404_1",
    503: "PLATFORM_503_1",
};

export class TenantEntryPointError extends Error {
    constructor(
        message: string,
        public readonly status: number,
        public readonly serviceCode: string,
    ) {
        super(message);
        this.name = "TenantEntryPointError";
    }
}

function getTenantRoutingOrigin(): string {
    const origin = process.env.TENANT_ROUTING_ORIGIN?.trim().replace(/\/+$/, "");

    if (!origin) {
        throw new Error("TENANT_ROUTING_ORIGIN is required");
    }

    return origin;
}

export async function getTenantApiEntryPoint(
    tenantCode: string,
): Promise<TenantEntryPointResponse> {
    const origin = getTenantRoutingOrigin();
    const response = await fetch(
        `${origin}/api/public/tenants/${encodeURIComponent(tenantCode)}`,
    );

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "테넌트 API 진입점 조회에 실패했습니다.",
        );

        throw new TenantEntryPointError(
            message,
            response.status,
            TENANT_ENTRY_POINT_ERROR_CODES[response.status] ?? "UNKNOWN",
        );
    }

    return response.json();
}
