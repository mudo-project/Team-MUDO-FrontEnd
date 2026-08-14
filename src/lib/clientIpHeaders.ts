import "server-only";
import { getTrustedClientIp } from "./clientIp";
import { createClientIpSignature } from "./clientIpSignature";

// 근태 API 중 IP 서명이 필요한 요청(현재 IP 조회, 와이파이 IP 등록 등)에
// 덧붙일 X-Client-IP* 헤더 3종을 만든다. backendPath는 Spring이 실제로 받는 경로를 사용한다.
export async function buildSignedClientIpHeaders(
    method: string,
    backendPath: string
): Promise<Record<string, string>> {
    const clientIp = await getTrustedClientIp();
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const signature = createClientIpSignature(method, backendPath, clientIp, timestamp);

    return {
        "X-Client-IP": clientIp,
        "X-Client-IP-Timestamp": timestamp,
        "X-Client-IP-Signature": signature,
    };
}
