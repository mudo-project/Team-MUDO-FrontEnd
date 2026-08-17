import { myInfoUpdateSchema } from "./authSchema";

// 이 파일은 mypage 도메인(MyInfo)이 사용하는 myInfoUpdateSchema만 검증한다.
// authSchema, authEditSchema는 다른 도메인(auth, role)에서 사용하므로 이 작업 범위에 포함하지 않는다.
describe("myInfoUpdateSchema", () => {
    const validInput = { email: "teacher@example.com", phone: "010-1234-5678" };

    it("이메일과 전화번호 형식이 올바르면 검증에 성공한다", () => {
        const result = myInfoUpdateSchema.safeParse(validInput);

        expect(result.success).toBe(true);
    });

    it("이메일 형식이 올바르지 않으면 검증에 실패한다", () => {
        const result = myInfoUpdateSchema.safeParse({ ...validInput, email: "invalid-email" });

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe("올바른 이메일 형식이 아닙니다.");
        }
    });

    it("전화번호 형식이 올바르지 않으면 검증에 실패한다", () => {
        const result = myInfoUpdateSchema.safeParse({ ...validInput, phone: "01012345678" });

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe("전화번호 형식이 올바르지 않습니다.");
        }
    });
});
