import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { getCurrentUserIdAction } from "@/feature/messenger/actions";
import { deleteNoticeAction, pinNoticeAction, unpinNoticeAction } from "../actions";
import NoticeDetailToolbar from "./NoticeDetailToolbar";

const push = jest.fn();
const refresh = jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: () => ({ push, refresh }),
}));

jest.mock("sonner", () => ({
    toast: {
        error: jest.fn(),
        success: jest.fn(),
    },
}));

jest.mock("../../messenger/actions", () => ({
    getCurrentUserIdAction: jest.fn(),
}));

jest.mock("../actions", () => ({
    deleteNoticeAction: jest.fn(),
    pinNoticeAction: jest.fn(),
    unpinNoticeAction: jest.fn(),
    updateNoticeAction: jest.fn(),
}));

const mockedGetCurrentUserIdAction = getCurrentUserIdAction as jest.MockedFunction<typeof getCurrentUserIdAction>;
const mockedDeleteNoticeAction = deleteNoticeAction as jest.MockedFunction<typeof deleteNoticeAction>;
const mockedPinNoticeAction = pinNoticeAction as jest.MockedFunction<typeof pinNoticeAction>;
const mockedUnpinNoticeAction = unpinNoticeAction as jest.MockedFunction<typeof unpinNoticeAction>;

const baseNotice: NoticeDetailData = {
    id: 1,
    title: "제목",
    content: "내용",
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

describe("NoticeDetailToolbar", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("작성자가 아니면 고정 버튼을 노출하지 않는다", async () => {
        mockedGetCurrentUserIdAction.mockResolvedValue(999);
        render(<NoticeDetailToolbar notice={baseNotice} />);

        await waitFor(() => {
            expect(getCurrentUserIdAction).toHaveBeenCalled();
        });

        expect(screen.queryByRole("button", { name: "상단 고정" })).not.toBeInTheDocument();
    });

    it("작성자면 고정 버튼을 노출한다", async () => {
        mockedGetCurrentUserIdAction.mockResolvedValue(10);
        render(<NoticeDetailToolbar notice={baseNotice} />);

        expect(await screen.findByRole("button", { name: "상단 고정" })).toBeInTheDocument();
    });

    it("고정 버튼을 클릭하면 고정 API를 호출하고 배지를 노출한다", async () => {
        mockedGetCurrentUserIdAction.mockResolvedValue(10);
        mockedPinNoticeAction.mockResolvedValue({ success: true, message: "공지사항이 상단에 고정되었습니다." });
        render(<NoticeDetailToolbar notice={baseNotice} />);

        fireEvent.click(await screen.findByRole("button", { name: "상단 고정" }));

        await waitFor(() => {
            expect(pinNoticeAction).toHaveBeenCalledWith(1);
        });
        expect(toast.success).toHaveBeenCalledWith("공지사항이 상단에 고정되었습니다.");
        expect(screen.getByText("고정")).toBeInTheDocument();
    });

    it("이미 고정된 공지에서 고정 해제 버튼을 클릭하면 고정 해제 API를 호출한다", async () => {
        mockedGetCurrentUserIdAction.mockResolvedValue(10);
        mockedUnpinNoticeAction.mockResolvedValue({ success: true, message: "공지사항 고정이 해제되었습니다." });
        render(<NoticeDetailToolbar notice={{ ...baseNotice, pinned: true }} />);

        fireEvent.click(await screen.findByRole("button", { name: "상단 고정 해제" }));

        await waitFor(() => {
            expect(unpinNoticeAction).toHaveBeenCalledWith(1);
        });
        expect(toast.success).toHaveBeenCalledWith("공지사항 고정이 해제되었습니다.");
    });

    it("삭제 아이콘 클릭 후 확인하면 삭제 API를 호출하고 목록으로 이동한다", async () => {
        mockedGetCurrentUserIdAction.mockResolvedValue(10);
        mockedDeleteNoticeAction.mockResolvedValue({ success: true, message: "공지사항이 삭제되었습니다." });
        render(<NoticeDetailToolbar notice={baseNotice} />);

        fireEvent.click(await screen.findByRole("button", { name: "공지 삭제" }));
        fireEvent.click(screen.getByRole("button", { name: "확인" }));

        await waitFor(() => {
            expect(deleteNoticeAction).toHaveBeenCalledWith(1);
        });
        expect(push).toHaveBeenCalledWith("/notice");
        expect(toast.success).toHaveBeenCalledWith("공지사항이 삭제되었습니다.");
    });

    it("삭제에 실패하면 에러 토스트를 노출하고 목록으로 이동하지 않는다", async () => {
        mockedGetCurrentUserIdAction.mockResolvedValue(10);
        mockedDeleteNoticeAction.mockResolvedValue({ success: false, message: "공지사항 삭제에 실패하였습니다." });
        render(<NoticeDetailToolbar notice={baseNotice} />);

        fireEvent.click(await screen.findByRole("button", { name: "공지 삭제" }));
        fireEvent.click(screen.getByRole("button", { name: "확인" }));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("공지사항 삭제에 실패하였습니다.");
        });
        expect(push).not.toHaveBeenCalled();
    });
});
