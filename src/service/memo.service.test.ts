import { fetchWithAuth } from "@/lib/fetch";
import { changeMemoColor, createMemo, deleteMemo, getMemoList, updateMemo } from "./memo.service";

jest.mock("../lib/fetch");

const mockedFetch = fetchWithAuth as jest.Mock;

const okJsonResponse = (data: unknown) => ({
    ok: true,
    json: () => Promise.resolve(data),
});

const failJsonResponse = (message: string) => ({
    ok: false,
    headers: { get: () => "application/json" },
    json: () => Promise.resolve({ message }),
});

const memo: MemoData = {
    id: 1,
    title: "메모 제목",
    content: "메모 내용",
    color: "B9827F",
    positionX: null,
    positionY: null,
    width: null,
    height: null,
    createdAt: "2026-08-01",
    updatedAt: "2026-08-01",
};

describe("getMemoList", () => {
    afterEach(() => jest.clearAllMocks());

    it("정렬 기준이 없으면 쿼리스트링 없이 요청한다", async () => {
        mockedFetch.mockResolvedValue(okJsonResponse({ data: [memo] }));

        const result = await getMemoList();

        expect(mockedFetch).toHaveBeenCalledWith("/api/memos");
        expect(result).toEqual([memo]);
    });

    it("정렬 기준이 있으면 쿼리스트링을 포함해 요청한다", async () => {
        mockedFetch.mockResolvedValue(okJsonResponse({ data: [memo] }));

        const result = await getMemoList("OLDEST");

        expect(mockedFetch).toHaveBeenCalledWith("/api/memos?sort=OLDEST");
        expect(result).toEqual([memo]);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failJsonResponse("메모 목록 조회에 실패하였습니다."));

        await expect(getMemoList()).rejects.toThrow("메모 목록 조회에 실패하였습니다.");
    });
});

describe("createMemo", () => {
    afterEach(() => jest.clearAllMocks());

    it("응답이 정상이면 생성된 메모 아이디를 반환한다", async () => {
        mockedFetch.mockResolvedValue(okJsonResponse({ data: { id: 1 } }));

        const payload = { title: "메모 제목", content: "메모 내용", color: "B9827F" };
        const result = await createMemo(payload);

        expect(mockedFetch).toHaveBeenCalledWith("/api/memos", {
            method: "POST",
            body: JSON.stringify(payload),
        });
        expect(result).toBe(1);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failJsonResponse("메모 생성에 실패하였습니다."));

        await expect(createMemo({ title: "제목", content: "내용", color: "B9827F" })).rejects.toThrow(
            "메모 생성에 실패하였습니다."
        );
    });
});

describe("updateMemo", () => {
    afterEach(() => jest.clearAllMocks());

    it("응답이 정상이면 예외 없이 완료된다", async () => {
        mockedFetch.mockResolvedValue({ ok: true });

        const payload = { title: "수정 제목", content: "수정 내용" };
        await expect(updateMemo(1, payload)).resolves.toBeUndefined();
        expect(mockedFetch).toHaveBeenCalledWith("/api/memos/1", {
            method: "PATCH",
            body: JSON.stringify(payload),
        });
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failJsonResponse("메모 수정에 실패하였습니다."));

        await expect(updateMemo(1, { title: "제목", content: "내용" })).rejects.toThrow(
            "메모 수정에 실패하였습니다."
        );
    });
});

describe("changeMemoColor", () => {
    afterEach(() => jest.clearAllMocks());

    it("응답이 정상이면 예외 없이 완료된다", async () => {
        mockedFetch.mockResolvedValue({ ok: true });

        await expect(changeMemoColor(1, { color: "7894C2" })).resolves.toBeUndefined();
        expect(mockedFetch).toHaveBeenCalledWith("/api/memos/1/color", {
            method: "PATCH",
            body: JSON.stringify({ color: "7894C2" }),
        });
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failJsonResponse("메모 색상 변경에 실패하였습니다."));

        await expect(changeMemoColor(1, { color: "7894C2" })).rejects.toThrow(
            "메모 색상 변경에 실패하였습니다."
        );
    });
});

describe("deleteMemo", () => {
    afterEach(() => jest.clearAllMocks());

    it("응답이 정상이면 예외 없이 완료된다", async () => {
        mockedFetch.mockResolvedValue({ ok: true });

        await expect(deleteMemo(1)).resolves.toBeUndefined();
        expect(mockedFetch).toHaveBeenCalledWith("/api/memos/1", { method: "DELETE" });
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failJsonResponse("메모 삭제에 실패하였습니다."));

        await expect(deleteMemo(1)).rejects.toThrow("메모 삭제에 실패하였습니다.");
    });
});
