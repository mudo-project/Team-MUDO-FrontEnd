import { memoCreateSchema } from "./memoCreateSchema";

const validValues = {
    title: "메모 제목",
    content: "메모 내용",
};

describe("memoCreateSchema", () => {
    it("제목과 내용이 모두 채워지면 검증을 통과한다", () => {
        const result = memoCreateSchema.safeParse(validValues);

        expect(result.success).toBe(true);
    });

    it("제목이 비어있으면 에러 메시지와 함께 실패한다", () => {
        const result = memoCreateSchema.safeParse({ ...validValues, title: "" });

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].path).toEqual(["title"]);
            expect(result.error.issues[0].message).toBe("제목을 입력해주세요.");
        }
    });

    it("내용이 비어있으면 에러 메시지와 함께 실패한다", () => {
        const result = memoCreateSchema.safeParse({ ...validValues, content: "" });

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].path).toEqual(["content"]);
            expect(result.error.issues[0].message).toBe("내용을 입력해주세요.");
        }
    });
});
