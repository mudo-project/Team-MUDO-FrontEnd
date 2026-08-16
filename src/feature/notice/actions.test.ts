import { createNotice, deleteNotice, pinNotice, unpinNotice, updateNotice } from "@/service/notice.service";
import {
    createNoticeAction,
    deleteNoticeAction,
    pinNoticeAction,
    unpinNoticeAction,
    updateNoticeAction,
} from "./actions";

jest.mock("../../service/notice.service");

describe("createNoticeAction", () => {
    afterEach(() => jest.clearAllMocks());

    it("제목이 비어있으면 service를 호출하지 않고 실패 결과를 반환한다", async () => {
        const result = await createNoticeAction("   ", "내용");

        expect(result).toEqual({ success: false, message: "공지 제목은 비어 있을 수 없습니다." });
        expect(createNotice).not.toHaveBeenCalled();
    });

    it("내용이 비어있으면 service를 호출하지 않고 실패 결과를 반환한다", async () => {
        const result = await createNoticeAction("제목", "   ");

        expect(result).toEqual({ success: false, message: "공지 내용은 비어 있을 수 없습니다." });
        expect(createNotice).not.toHaveBeenCalled();
    });

    it("service 호출이 성공하면 성공 결과와 공지 아이디를 반환한다", async () => {
        (createNotice as jest.Mock).mockResolvedValue(1);

        const result = await createNoticeAction("제목", "내용", true);

        expect(createNotice).toHaveBeenCalledWith({
            title: "제목",
            content: "내용",
            pinned: true,
            attachments: undefined,
        });
        expect(result).toEqual({ success: true, message: "공지사항이 등록되었습니다.", noticeId: 1 });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        (createNotice as jest.Mock).mockRejectedValue(new Error("이미 등록된 공지입니다."));

        const result = await createNoticeAction("제목", "내용");

        expect(result).toEqual({ success: false, message: "이미 등록된 공지입니다." });
    });
});

describe("updateNoticeAction", () => {
    afterEach(() => jest.clearAllMocks());

    it("제목이 비어있으면 service를 호출하지 않고 실패 결과를 반환한다", async () => {
        const result = await updateNoticeAction(1, "   ", "내용");

        expect(result).toEqual({ success: false, message: "공지 제목은 비어 있을 수 없습니다." });
        expect(updateNotice).not.toHaveBeenCalled();
    });

    it("내용이 비어있으면 service를 호출하지 않고 실패 결과를 반환한다", async () => {
        const result = await updateNoticeAction(1, "제목", "   ");

        expect(result).toEqual({ success: false, message: "공지 내용은 비어 있을 수 없습니다." });
        expect(updateNotice).not.toHaveBeenCalled();
    });

    it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
        (updateNotice as jest.Mock).mockResolvedValue(undefined);

        const result = await updateNoticeAction(1, "수정 제목", "수정 내용");

        expect(updateNotice).toHaveBeenCalledWith(1, { title: "수정 제목", content: "수정 내용" });
        expect(result).toEqual({ success: true, message: "공지사항이 수정되었습니다." });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        (updateNotice as jest.Mock).mockRejectedValue(new Error("수정 권한이 없습니다."));

        const result = await updateNoticeAction(1, "제목", "내용");

        expect(result).toEqual({ success: false, message: "수정 권한이 없습니다." });
    });
});

describe("deleteNoticeAction", () => {
    afterEach(() => jest.clearAllMocks());

    it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
        (deleteNotice as jest.Mock).mockResolvedValue(undefined);

        const result = await deleteNoticeAction(1);

        expect(deleteNotice).toHaveBeenCalledWith(1);
        expect(result).toEqual({ success: true, message: "공지사항이 삭제되었습니다." });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        (deleteNotice as jest.Mock).mockRejectedValue(new Error("삭제 권한이 없습니다."));

        const result = await deleteNoticeAction(1);

        expect(result).toEqual({ success: false, message: "삭제 권한이 없습니다." });
    });
});

describe("pinNoticeAction", () => {
    afterEach(() => jest.clearAllMocks());

    it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
        (pinNotice as jest.Mock).mockResolvedValue(undefined);

        const result = await pinNoticeAction(1);

        expect(pinNotice).toHaveBeenCalledWith(1);
        expect(result).toEqual({ success: true, message: "공지사항이 상단에 고정되었습니다." });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        (pinNotice as jest.Mock).mockRejectedValue(new Error("고정 권한이 없습니다."));

        const result = await pinNoticeAction(1);

        expect(result).toEqual({ success: false, message: "고정 권한이 없습니다." });
    });
});

describe("unpinNoticeAction", () => {
    afterEach(() => jest.clearAllMocks());

    it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
        (unpinNotice as jest.Mock).mockResolvedValue(undefined);

        const result = await unpinNoticeAction(1);

        expect(unpinNotice).toHaveBeenCalledWith(1);
        expect(result).toEqual({ success: true, message: "공지사항 고정이 해제되었습니다." });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        (unpinNotice as jest.Mock).mockRejectedValue(new Error("고정 해제 권한이 없습니다."));

        const result = await unpinNoticeAction(1);

        expect(result).toEqual({ success: false, message: "고정 해제 권한이 없습니다." });
    });
});
