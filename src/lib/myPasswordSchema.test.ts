import { myPasswordSchema } from "./myPasswordSchema";

describe("myPasswordSchema", () => {
    const validInput = {
        currentPassword: "current1234",
        newPassword: "newpass1234",
        confirmPassword: "newpass1234",
    };

    it("모든 값이 올바르면 검증에 성공한다", () => {
        const result = myPasswordSchema.safeParse(validInput);

        expect(result.success).toBe(true);
    });

    it("현재 비밀번호가 비어있으면 검증에 실패한다", () => {
        const result = myPasswordSchema.safeParse({ ...validInput, currentPassword: "" });

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe("현재 비밀번호를 입력해주세요.");
        }
    });

    it("새 비밀번호가 8자 미만이면 검증에 실패한다", () => {
        const result = myPasswordSchema.safeParse({
            ...validInput,
            newPassword: "short1",
            confirmPassword: "short1",
        });

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe("새 비밀번호는 8자 이상 입력해주세요.");
        }
    });

    it("현재 비밀번호와 새 비밀번호가 같으면 검증에 실패한다", () => {
        const result = myPasswordSchema.safeParse({
            currentPassword: "samepass1234",
            newPassword: "samepass1234",
            confirmPassword: "samepass1234",
        });

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe("현재 비밀번호와 다른 비밀번호를 입력해주세요.");
            expect(result.error.issues[0].path).toEqual(["newPassword"]);
        }
    });

    it("새 비밀번호와 확인이 일치하지 않으면 검증에 실패한다", () => {
        const result = myPasswordSchema.safeParse({
            ...validInput,
            confirmPassword: "different1234",
        });

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe("새 비밀번호가 일치하지 않습니다.");
            expect(result.error.issues[0].path).toEqual(["confirmPassword"]);
        }
    });
});
