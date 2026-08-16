import "server-only";
import { headers } from "next/headers";
import { resolveApiBaseUrl } from "./tenantApiResolver";

export async function getApiBaseUrl(): Promise<string> {
    const requestHeaders = await headers();
    const host =
        requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");

    if (!host) {
        throw new Error("요청 Host를 확인할 수 없습니다.");
    }

    return resolveApiBaseUrl(host);
}
