import { getErrorMessage } from "./responseError";

describe("getErrorMessage", () => {
    it("JSON 오류 응답이면 서버 메시지를 반환한다", async () => {
        const response = {
            headers: { get: () => "application/json" },
            json: () => Promise.resolve({ message: "등록되지 않은 학원입니다." }),
        } as unknown as Response;

        await expect(getErrorMessage(response, "fallback")).resolves.toBe(
            "등록되지 않은 학원입니다.",
        );
    });

    it("텍스트 오류 응답이면 응답 본문을 반환한다", async () => {
        const response = {
            headers: { get: () => "text/plain" },
            text: () => Promise.resolve("service unavailable"),
        } as unknown as Response;

        await expect(getErrorMessage(response, "fallback")).resolves.toBe(
            "service unavailable",
        );
    });

    it("오류 응답을 읽지 못하면 fallback 메시지를 반환한다", async () => {
        const response = {
            headers: { get: () => "application/json" },
            json: () => Promise.reject(new Error("invalid json")),
        } as unknown as Response;

        await expect(getErrorMessage(response, "fallback")).resolves.toBe(
            "fallback",
        );
    });
});
