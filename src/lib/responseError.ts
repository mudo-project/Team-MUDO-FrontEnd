export async function getErrorMessage(
    response: Response,
    fallbackMessage: string,
): Promise<string> {
    try {
        const contentType = response.headers.get("content-type");

        if (contentType?.includes("application/json")) {
            const errorData = await response.json();
            return errorData?.message || fallbackMessage;
        }

        const text = await response.text();
        return text || fallbackMessage;
    } catch {
        return fallbackMessage;
    }
}
