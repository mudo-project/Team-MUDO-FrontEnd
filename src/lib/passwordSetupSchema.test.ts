import { passwordSetupSchema } from "./passwordSetupSchema";

const validInput = {
    email: "test@example.com",
    phone: "010-1234-5678",
    newPassword: "password1234",
    confirmPassword: "password1234",
};

describe("passwordSetupSchema", () => {
    it("모든 값이 올바르면 검증에 성공한다", () => {
        const result = passwordSetupSchema.safeParse(validInput);

        expect(result.success).toBe(true);
    });

    it("비밀번호가 8자 미만이면 검증에 실패한다", () => {
        const result = passwordSetupSchema.safeParse({
            ...validInput,
            newPassword: "1234",
            confirmPassword: "1234",
        });

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe(
                "비밀번호는 8자 이상 입력해주세요.",
            );
        }
    });

    it("비밀번호가 100자를 초과하면 검증에 실패한다", () => {
        const longPassword = "a".repeat(101);
        const result = passwordSetupSchema.safeParse({
            ...validInput,
            newPassword: longPassword,
            confirmPassword: longPassword,
        });

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe(
                "비밀번호는 100자 이하로 입력해주세요.",
            );
        }
    });

    it("비밀번호 확인이 비어있으면 검증에 실패한다", () => {
        const result = passwordSetupSchema.safeParse({
            ...validInput,
            confirmPassword: "",
        });

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(
                result.error.issues.some(
                    (issue) => issue.message === "비밀번호 확인을 입력해주세요.",
                ),
            ).toBe(true);
        }
    });

    it("이메일 형식이 올바르지 않으면 검증에 실패한다", () => {
        const result = passwordSetupSchema.safeParse({
            ...validInput,
            email: "invalid-email",
        });

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(
                result.error.issues.some(
                    (issue) => issue.message === "올바른 이메일 형식이 아닙니다.",
                ),
            ).toBe(true);
        }
    });

    it("전화번호 형식이 올바르지 않으면 검증에 실패한다", () => {
        const result = passwordSetupSchema.safeParse({
            ...validInput,
            phone: "01012345678",
        });

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(
                result.error.issues.some(
                    (issue) => issue.message === "전화번호 형식이 올바르지 않습니다.",
                ),
            ).toBe(true);
        }
    });

    it("비밀번호와 비밀번호 확인이 일치하지 않으면 검증에 실패한다", () => {
        const result = passwordSetupSchema.safeParse({
            ...validInput,
            confirmPassword: "differentPassword1",
        });

        expect(result.success).toBe(false);
        if (!result.success) {
            const mismatchIssue = result.error.issues.find(
                (issue) => issue.message === "비밀번호가 일치하지 않습니다.",
            );
            expect(mismatchIssue).toBeDefined();
            expect(mismatchIssue?.path).toEqual(["confirmPassword"]);
        }
    });
});
