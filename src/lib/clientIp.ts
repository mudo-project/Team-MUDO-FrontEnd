import "server-only";
import { headers } from "next/headers";

// 운영 경로는 Caddy(단일 프록시 홉)가 실제 연결 피어의 IP를 X-Forwarded-For의
// 마지막 값으로 항상 append한다. 브라우저가 앞쪽 값을 조작할 수 있으므로 마지막 값만 신뢰한다.
export async function getTrustedClientIp(): Promise<string> {
    const headerList = await headers();
    const forwardedFor = headerList.get("x-forwarded-for");

    if (!forwardedFor) {
        throw new Error("클라이언트 IP를 확인할 수 없습니다.");
    }

    const ip = forwardedFor.split(",").pop()?.trim();

    if (!ip) {
        throw new Error("클라이언트 IP를 확인할 수 없습니다.");
    }

    return ip;
}
