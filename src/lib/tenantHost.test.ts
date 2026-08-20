import { parseFrontendHost } from "./tenantHost";

describe("parseFrontendHost", () => {
    it("루트 운영 도메인이면 루트 요청으로 반환한다", () => {
        expect(parseFrontendHost("ieum.store")).toEqual({ type: "root" });
    });

    it("프론트 서브도메인이면 테넌트 코드를 반환한다", () => {
        expect(parseFrontendHost("app-academy-d.ieum.store")).toEqual({
            type: "tenant",
            tenantCode: "academy-d",
        });
    });

    it("Host의 대소문자와 포트를 정규화한다", () => {
        expect(parseFrontendHost("APP-ACADEMY-D.IEUM.STORE:443")).toEqual({
            type: "tenant",
            tenantCode: "academy-d",
        });
    });

    it("localhost이면 로컬 요청으로 반환한다", () => {
        expect(parseFrontendHost("localhost:3000")).toEqual({ type: "local" });
    });

    it("지원하지 않는 Host이면 예외를 던진다", () => {
        expect(() => parseFrontendHost("attacker.example.com")).toThrow(
            "지원하지 않는 프론트 도메인입니다.",
        );
    });
});
