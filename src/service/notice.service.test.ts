import { fetchWithAuth } from "@/lib/fetch";
import {
    createNotice,
    deleteNotice,
    getNoticeDetail,
    getNoticeList,
    getNoticeReaders,
    pinNotice,
    unpinNotice,
    updateNotice,
} from "./notice.service";

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

const listItem: NoticeListItemData = {
    id: 1,
    title: "공지 제목",
    authorName: "김지수",
    authorRole: "TEACHER",
    pinned: false,
    read: false,
    hasAttachment: false,
    createdAt: "2026-08-01",
};

const detail: NoticeDetailData = {
    id: 1,
    title: "공지 제목",
    content: "공지 내용",
    authorUserId: 10,
    authorName: "김지수",
    authorRole: "TEACHER",
    pinned: false,
    viewCount: 0,
    readerCount: 0,
    totalRecipientCount: 0,
    createdAt: "2026-08-01",
    updatedAt: "2026-08-01",
    attachments: [],
};

describe("getNoticeList", () => {
    afterEach(() => jest.clearAllMocks());

    it("파라미터가 없으면 쿼리스트링 없이 요청한다", async () => {
        const data = { content: [listItem], page: 0, size: 10, hasNext: false };
        mockedFetch.mockResolvedValue(okJsonResponse({ data }));

        const result = await getNoticeList();

        expect(mockedFetch).toHaveBeenCalledWith("/api/notices");
        expect(result).toEqual(data);
    });

    it("파라미터가 있으면 쿼리스트링을 포함해 요청한다", async () => {
        const data = { content: [listItem], page: 1, size: 20, hasNext: true };
        mockedFetch.mockResolvedValue(okJsonResponse({ data }));

        const result = await getNoticeList({ keyword: "공지", page: 1, size: 20 });

        expect(mockedFetch).toHaveBeenCalledWith("/api/notices?keyword=%EA%B3%B5%EC%A7%80&page=1&size=20");
        expect(result).toEqual(data);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failJsonResponse("공지사항 목록 조회에 실패하였습니다."));

        await expect(getNoticeList()).rejects.toThrow("공지사항 목록 조회에 실패하였습니다.");
    });
});

describe("createNotice", () => {
    afterEach(() => jest.clearAllMocks());

    it("응답이 정상이면 생성된 공지 아이디를 반환한다", async () => {
        mockedFetch.mockResolvedValue(okJsonResponse({ data: { noticeId: 1 } }));

        const payload = { title: "공지 제목", content: "공지 내용", pinned: false };
        const result = await createNotice(payload);

        expect(mockedFetch).toHaveBeenCalledWith("/api/notices", {
            method: "POST",
            body: JSON.stringify(payload),
        });
        expect(result).toBe(1);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failJsonResponse("공지사항 작성에 실패하였습니다."));

        await expect(createNotice({ title: "제목", content: "내용" })).rejects.toThrow(
            "공지사항 작성에 실패하였습니다."
        );
    });
});

describe("getNoticeDetail", () => {
    afterEach(() => jest.clearAllMocks());

    it("응답이 정상이면 상세 데이터를 반환한다", async () => {
        mockedFetch.mockResolvedValue(okJsonResponse({ data: detail }));

        const result = await getNoticeDetail(1);

        expect(mockedFetch).toHaveBeenCalledWith("/api/notices/1");
        expect(result).toEqual(detail);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failJsonResponse("공지사항 상세 조회에 실패하였습니다."));

        await expect(getNoticeDetail(1)).rejects.toThrow("공지사항 상세 조회에 실패하였습니다.");
    });
});

describe("getNoticeReaders", () => {
    afterEach(() => jest.clearAllMocks());

    it("응답이 정상이면 읽은 사람 목록을 반환한다", async () => {
        const readers: NoticeReaderData[] = [
            { userId: 1, name: "김지수", role: "TEACHER", readAt: "2026-08-01" },
        ];
        mockedFetch.mockResolvedValue(okJsonResponse({ data: readers }));

        const result = await getNoticeReaders(1);

        expect(mockedFetch).toHaveBeenCalledWith("/api/notices/1/readers");
        expect(result).toEqual(readers);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failJsonResponse("공지사항 읽은 사람 목록조회에 실패하였습니다."));

        await expect(getNoticeReaders(1)).rejects.toThrow("공지사항 읽은 사람 목록조회에 실패하였습니다.");
    });
});

describe("updateNotice", () => {
    afterEach(() => jest.clearAllMocks());

    it("응답이 정상이면 예외 없이 완료된다", async () => {
        mockedFetch.mockResolvedValue({ ok: true });

        const payload = { title: "수정 제목", content: "수정 내용" };
        await expect(updateNotice(1, payload)).resolves.toBeUndefined();
        expect(mockedFetch).toHaveBeenCalledWith("/api/notices/1", {
            method: "PATCH",
            body: JSON.stringify(payload),
        });
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failJsonResponse("공지사항 수정에 실패하였습니다."));

        await expect(updateNotice(1, { title: "제목", content: "내용" })).rejects.toThrow(
            "공지사항 수정에 실패하였습니다."
        );
    });
});

describe("deleteNotice", () => {
    afterEach(() => jest.clearAllMocks());

    it("응답이 정상이면 예외 없이 완료된다", async () => {
        mockedFetch.mockResolvedValue({ ok: true });

        await expect(deleteNotice(1)).resolves.toBeUndefined();
        expect(mockedFetch).toHaveBeenCalledWith("/api/notices/1", { method: "DELETE" });
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failJsonResponse("공지사항 삭제에 실패하였습니다."));

        await expect(deleteNotice(1)).rejects.toThrow("공지사항 삭제에 실패하였습니다.");
    });
});

describe("pinNotice", () => {
    afterEach(() => jest.clearAllMocks());

    it("응답이 정상이면 예외 없이 완료된다", async () => {
        mockedFetch.mockResolvedValue({ ok: true });

        await expect(pinNotice(1)).resolves.toBeUndefined();
        expect(mockedFetch).toHaveBeenCalledWith("/api/notices/1/pin", { method: "POST" });
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failJsonResponse("공지사항 고정에 실패하였습니다."));

        await expect(pinNotice(1)).rejects.toThrow("공지사항 고정에 실패하였습니다.");
    });
});

describe("unpinNotice", () => {
    afterEach(() => jest.clearAllMocks());

    it("응답이 정상이면 예외 없이 완료된다", async () => {
        mockedFetch.mockResolvedValue({ ok: true });

        await expect(unpinNotice(1)).resolves.toBeUndefined();
        expect(mockedFetch).toHaveBeenCalledWith("/api/notices/1/pin", { method: "DELETE" });
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failJsonResponse("공지사항 고정 해제에 실패하였습니다."));

        await expect(unpinNotice(1)).rejects.toThrow("공지사항 고정 해제에 실패하였습니다.");
    });
});
