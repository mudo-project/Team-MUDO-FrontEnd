import { changeMemoColor, createMemo, deleteMemo, updateMemo } from "@/service/memo.service";
import { changeMemoColorAction, createMemoAction, deleteMemoAction, updateMemoAction } from "./actions";

jest.mock("../../service/memo.service");

describe("createMemoAction", () => {
    afterEach(() => jest.clearAllMocks());

    it("제목이 비어있으면 실패 결과를 반환한다", async () => {
        const result = await createMemoAction("  ", "내용", "B9827F");

        expect(result).toEqual({ success: false, message: "제목을 입력해주세요." });
    });

    it("제목이 100자를 초과하면 실패 결과를 반환한다", async () => {
        const result = await createMemoAction("a".repeat(101), "내용", "B9827F");

        expect(result).toEqual({ success: false, message: "제목은 최대 100자까지 입력할 수 있습니다." });
    });

    it("색상 코드가 올바르지 않으면 실패 결과를 반환한다", async () => {
        const result = await createMemoAction("제목", "내용", "XYZ");

        expect(result).toEqual({ success: false, message: "올바르지 않은 색상입니다." });
    });

    it("service 호출이 성공하면 생성된 아이디와 함께 성공 결과를 반환한다", async () => {
        (createMemo as jest.Mock).mockResolvedValue(1);

        const result = await createMemoAction("제목", "내용", "B9827F");

        expect(createMemo).toHaveBeenCalledWith({ title: "제목", content: "내용", color: "B9827F" });
        expect(result).toEqual({ success: true, message: "메모가 생성되었습니다.", id: 1 });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        (createMemo as jest.Mock).mockRejectedValue(new Error("메모 생성에 실패하였습니다."));

        const result = await createMemoAction("제목", "내용", "B9827F");

        expect(result).toEqual({ success: false, message: "메모 생성에 실패하였습니다." });
    });
});

describe("updateMemoAction", () => {
    afterEach(() => jest.clearAllMocks());

    it("제목이 비어있으면 실패 결과를 반환한다", async () => {
        const result = await updateMemoAction(1, "  ", "내용");

        expect(result).toEqual({ success: false, message: "제목을 입력해주세요." });
    });

    it("제목이 100자를 초과하면 실패 결과를 반환한다", async () => {
        const result = await updateMemoAction(1, "a".repeat(101), "내용");

        expect(result).toEqual({ success: false, message: "제목은 최대 100자까지 입력할 수 있습니다." });
    });

    it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
        (updateMemo as jest.Mock).mockResolvedValue(undefined);

        const result = await updateMemoAction(1, "제목", "내용");

        expect(updateMemo).toHaveBeenCalledWith(1, { title: "제목", content: "내용" });
        expect(result).toEqual({ success: true, message: "메모가 수정되었습니다." });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        (updateMemo as jest.Mock).mockRejectedValue(new Error("메모 수정에 실패하였습니다."));

        const result = await updateMemoAction(1, "제목", "내용");

        expect(result).toEqual({ success: false, message: "메모 수정에 실패하였습니다." });
    });
});

describe("changeMemoColorAction", () => {
    afterEach(() => jest.clearAllMocks());

    it("색상 코드가 올바르지 않으면 실패 결과를 반환한다", async () => {
        const result = await changeMemoColorAction(1, "XYZ");

        expect(result).toEqual({ success: false, message: "올바르지 않은 색상입니다." });
    });

    it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
        (changeMemoColor as jest.Mock).mockResolvedValue(undefined);

        const result = await changeMemoColorAction(1, "7894C2");

        expect(changeMemoColor).toHaveBeenCalledWith(1, { color: "7894C2" });
        expect(result).toEqual({ success: true, message: "메모 색상이 변경되었습니다." });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        (changeMemoColor as jest.Mock).mockRejectedValue(new Error("메모 색상 변경에 실패하였습니다."));

        const result = await changeMemoColorAction(1, "7894C2");

        expect(result).toEqual({ success: false, message: "메모 색상 변경에 실패하였습니다." });
    });
});

describe("deleteMemoAction", () => {
    afterEach(() => jest.clearAllMocks());

    it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
        (deleteMemo as jest.Mock).mockResolvedValue(undefined);

        const result = await deleteMemoAction(1);

        expect(deleteMemo).toHaveBeenCalledWith(1);
        expect(result).toEqual({ success: true, message: "메모가 삭제되었습니다." });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        (deleteMemo as jest.Mock).mockRejectedValue(new Error("메모 삭제에 실패하였습니다."));

        const result = await deleteMemoAction(1);

        expect(result).toEqual({ success: false, message: "메모 삭제에 실패하였습니다." });
    });
});
