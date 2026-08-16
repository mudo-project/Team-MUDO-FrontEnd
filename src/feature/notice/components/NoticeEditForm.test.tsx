import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { pinNoticeAction, unpinNoticeAction, updateNoticeAction } from "../actions";
import NoticeEditForm from "./NoticeEditForm";

const refresh = jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: () => ({ refresh }),
}));

jest.mock("sonner", () => ({
    toast: {
        error: jest.fn(),
        success: jest.fn(),
    },
}));

jest.mock("../actions", () => ({
    updateNoticeAction: jest.fn(),
    pinNoticeAction: jest.fn(),
    unpinNoticeAction: jest.fn(),
}));

const mockedUpdateNoticeAction = updateNoticeAction as jest.MockedFunction<typeof updateNoticeAction>;
const mockedPinNoticeAction = pinNoticeAction as jest.MockedFunction<typeof pinNoticeAction>;
const mockedUnpinNoticeAction = unpinNoticeAction as jest.MockedFunction<typeof unpinNoticeAction>;

const baseNotice: NoticeDetailData = {
    id: 1,
    title: "기존 제목",
    content: "기존 내용",
    authorUserId: 1,
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

const openModal = (notice: NoticeDetailData = baseNotice) => {
    render(<NoticeEditForm notice={notice} />);
    fireEvent.click(screen.getByRole("button", { name: "공지 수정" }));
};

describe("NoticeEditForm", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("기존 공지 값이 입력 필드에 채워진 상태로 열린다", () => {
        openModal();

        expect(screen.getByLabelText("제목 *")).toHaveValue("기존 제목");
        expect(screen.getByLabelText("내용 *")).toHaveValue("기존 내용");
    });

    it("제목과 내용을 비우고 수정하면 에러 메시지를 노출한다", async () => {
        openModal();

        fireEvent.change(screen.getByLabelText("제목 *"), { target: { value: "" } });
        fireEvent.change(screen.getByLabelText("내용 *"), { target: { value: "" } });
        fireEvent.click(screen.getByRole("button", { name: "수정" }));

        expect(await screen.findByText("제목을 입력하세요")).toBeInTheDocument();
        expect(await screen.findByText("내용을 입력하세요")).toBeInTheDocument();
        expect(updateNoticeAction).not.toHaveBeenCalled();
    });

    it("상단 고정 여부를 바꾸지 않고 수정하면 고정 API를 호출하지 않는다", async () => {
        mockedUpdateNoticeAction.mockResolvedValue({ success: true, message: "공지사항이 수정되었습니다." });
        openModal();

        fireEvent.change(screen.getByLabelText("제목 *"), { target: { value: "수정된 제목" } });
        fireEvent.click(screen.getByRole("button", { name: "수정" }));

        await waitFor(() => {
            expect(updateNoticeAction).toHaveBeenCalledWith(1, "수정된 제목", "기존 내용");
        });
        expect(pinNoticeAction).not.toHaveBeenCalled();
        expect(unpinNoticeAction).not.toHaveBeenCalled();
        expect(toast.success).toHaveBeenCalledWith("공지사항이 수정되었습니다.");
        expect(refresh).toHaveBeenCalled();
    });

    it("상단 고정을 체크하고 수정하면 고정 API를 함께 호출한다", async () => {
        mockedUpdateNoticeAction.mockResolvedValue({ success: true, message: "공지사항이 수정되었습니다." });
        mockedPinNoticeAction.mockResolvedValue({ success: true, message: "공지사항이 상단에 고정되었습니다." });
        openModal();

        fireEvent.click(screen.getByLabelText("상단 고정", { exact: false }));
        fireEvent.click(screen.getByRole("button", { name: "수정" }));

        await waitFor(() => {
            expect(pinNoticeAction).toHaveBeenCalledWith(1);
        });
        expect(screen.queryByRole("heading", { name: "공지 수정" })).not.toBeInTheDocument();
    });

    it("수정 API가 실패하면 에러 토스트를 노출하고 고정 API는 호출하지 않는다", async () => {
        mockedUpdateNoticeAction.mockResolvedValue({ success: false, message: "공지사항 수정에 실패하였습니다." });
        openModal();

        fireEvent.click(screen.getByRole("button", { name: "수정" }));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("공지사항 수정에 실패하였습니다.");
        });
        expect(pinNoticeAction).not.toHaveBeenCalled();
        expect(unpinNoticeAction).not.toHaveBeenCalled();
    });
});
