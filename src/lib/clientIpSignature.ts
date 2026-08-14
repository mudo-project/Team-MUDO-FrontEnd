import "server-only";
import { createHmac } from "node:crypto";

export function createClientIpSignature(
    method: string,
    backendPath: string,
    clientIp: string,
    timestamp: string
): string {
    const secret = process.env.CLIENT_IP_SIGNING_SECRET;

    if (!secret) {
        throw new Error("CLIENT_IP_SIGNING_SECRET is missing");
    }

    const payload = [
        method.toUpperCase(),
        backendPath,
        clientIp.trim(),
        timestamp,
    ].join("\n");

    return createHmac("sha256", secret).update(payload, "utf8").digest("base64url");
}
