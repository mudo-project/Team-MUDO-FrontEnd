import { noticeCreateSchema } from "./noticeCreateSchema";

const validValues = {
    title: "공지 제목",
    content: "공지 내용",
    pinned: false,
};

describe("noticeCreateSchema", () => {
    it("필수 값이 모두 채워지면 검증을 통과한다", () => {
        const result = noticeCreateSchema.safeParse(validValues);

        expect(result.success).toBe(true);
    });

    it("제목이 비어있으면 에러 메시지와 함께 실패한다", () => {
        const result = noticeCreateSchema.safeParse({ ...validValues, title: "" });

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].path).toEqual(["title"]);
            expect(result.error.issues[0].message).toBe("제목을 입력하세요");
        }
    });

    it("내용이 비어있으면 에러 메시지와 함께 실패한다", () => {
        const result = noticeCreateSchema.safeParse({ ...validValues, content: "" });

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].path).toEqual(["content"]);
            expect(result.error.issues[0].message).toBe("내용을 입력하세요");
        }
    });

    it("상단 고정 값이 없으면 검증에 실패한다", () => {
        const { pinned: _pinned, ...withoutPinned } = validValues;
        const result = noticeCreateSchema.safeParse(withoutPinned);

        expect(result.success).toBe(false);
    });
});
