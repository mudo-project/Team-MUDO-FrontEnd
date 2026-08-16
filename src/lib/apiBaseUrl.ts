import "server-only";

export function getApiBaseUrl(): string {
    const apiBaseUrl = process.env.API_BASE_URL?.trim().replace(/\/+$/, "");

    if (!apiBaseUrl) {
        throw new Error("API_BASE_URL is required");
    }

    return apiBaseUrl;
}
