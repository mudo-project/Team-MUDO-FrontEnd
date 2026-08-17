import { createStudentSchema } from "./studentSchema";

const validInput = {
    name: "홍길동",
    grade: "MIDDLE_1" as const,
    school: "서울중학교",
    phone: "010-1234-5678",
    parentPhone: "010-2345-6789",
    note: "특이사항 없음",
};

describe("createStudentSchema", () => {
    it("모든 값이 올바르면 검증에 성공한다", () => {
        const result = createStudentSchema.safeParse(validInput);

        expect(result.success).toBe(true);
    });

    it("전화번호와 특이사항이 빈 문자열이어도 검증에 성공한다", () => {
        const result = createStudentSchema.safeParse({
            ...validInput,
            phone: "",
            parentPhone: "",
            note: "",
        });

        expect(result.success).toBe(true);
    });

    it("이름이 비어있으면 검증에 실패한다", () => {
        const result = createStudentSchema.safeParse({ ...validInput, name: "  " });

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe("이름을 입력해주세요.");
        }
    });

    it("이름이 50자를 초과하면 검증에 실패한다", () => {
        const result = createStudentSchema.safeParse({
            ...validInput,
            name: "a".repeat(51),
        });

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe("이름은 50자 이하로 입력해주세요.");
        }
    });

    it("학년이 올바르지 않으면 검증에 실패한다", () => {
        const result = createStudentSchema.safeParse({ ...validInput, grade: "INVALID" });

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe("학년을 선택해주세요.");
        }
    });

    it("학교명이 100자를 초과하면 검증에 실패한다", () => {
        const result = createStudentSchema.safeParse({
            ...validInput,
            school: "a".repeat(101),
        });

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe("학교명은 100자 이하로 입력해주세요.");
        }
    });

    it("학생 연락처 형식이 올바르지 않으면 검증에 실패한다", () => {
        const result = createStudentSchema.safeParse({ ...validInput, phone: "01012345678" });

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe(
                "전화번호 형식이 맞지 않습니다. (예: 010-1234-5678)",
            );
        }
    });

    it("학부모 연락처 형식이 올바르지 않으면 검증에 실패한다", () => {
        const result = createStudentSchema.safeParse({
            ...validInput,
            parentPhone: "010-123-4567",
        });

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe(
                "전화번호 형식이 맞지 않습니다. (예: 010-1234-5678)",
            );
        }
    });

    it("특이사항이 500자를 초과하면 검증에 실패한다", () => {
        const result = createStudentSchema.safeParse({
            ...validInput,
            note: "a".repeat(501),
        });

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe("특이사항은 500자 이하로 입력해주세요.");
        }
    });
});
