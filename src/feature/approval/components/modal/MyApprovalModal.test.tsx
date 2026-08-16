import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import {
    cancelApprovalAction,
    getApprovalDetailAction,
    hideApprovalHistoryAction,
    resubmitApprovalAction,
} from "../../actions";
import MyApprovalModal from "./MyApprovalModal";
import { toast } from "sonner";

const refresh = jest.fn();

jest.mock("../../actions", () => ({
    cancelApprovalAction: jest.fn(),
    getApprovalDetailAction: jest.fn(),
    hideApprovalHistoryAction: jest.fn(),
    resubmitApprovalAction: jest.fn(),
}));

jest.mock("next/navigation", () => ({
    useRouter: () => ({ refresh }),
}));

jest.mock("sonner", () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

jest.mock("./EditApprovalModal", () => ({
    __esModule: true,
    default: () => <div>결재라인 수정 모달</div>,
}));

const mockedGetApprovalDetailAction = getApprovalDetailAction as jest.Mock;
const mockedCancelApprovalAction = cancelApprovalAction as jest.Mock;
const mockedResubmitApprovalAction = resubmitApprovalAction as jest.Mock;
const mockedHideApprovalHistoryAction = hideApprovalHistoryAction as jest.Mock;

const inProgressApproval = {
    id: 1,
    templateId: 1,
    templateName: "휴가 신청",
    title: "여름 휴가",
    contentType: "TEXT" as const,
    text: "휴가를 신청합니다.",
    attachments: [],
    creatorId: 1,
    creatorName: "김민수",
    status: "IN_PROGRESS" as const,
    createdAt: "2026-08-16",
    lines: [
        { lineId: 1, stepOrder: 1, approverId: 2, approverName: "이지은", status: "PENDING" as const, comment: null, decidedAt: null },
    ],
};

const rejectedApproval = {
    ...inProgressApproval,
    status: "REJECTED" as const,
    lines: [
        {
            lineId: 1,
            stepOrder: 1,
            approverId: 2,
            approverName: "이지은",
            status: "REJECTED" as const,
            comment: "다시 작성해주세요",
            decidedAt: "2026-08-16",
        },
    ],
};

describe("MyApprovalModal", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("진행중 문서는 결재라인 수정과 결재 취소 버튼을 보여준다", async () => {
        mockedGetApprovalDetailAction.mockResolvedValue({
            success: true,
            message: "조회했습니다.",
            data: inProgressApproval,
        });

        render(<MyApprovalModal closeModal={jest.fn()} id={1} />);

        expect(await screen.findByRole("heading", { name: "여름 휴가" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "결재라인 수정" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "결재 취소" })).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "재상신" })).not.toBeInTheDocument();
    });

    it("결재 취소가 성공하면 성공 메시지를 알리고 모달을 닫은 뒤 새로고침한다", async () => {
        mockedGetApprovalDetailAction.mockResolvedValue({
            success: true,
            message: "조회했습니다.",
            data: inProgressApproval,
        });
        mockedCancelApprovalAction.mockResolvedValue({ success: true, message: "결재 신청을 취소했습니다." });
        const closeModal = jest.fn();

        render(<MyApprovalModal closeModal={closeModal} id={1} />);
        await screen.findByRole("heading", { name: "여름 휴가" });
        fireEvent.click(screen.getByRole("button", { name: "결재 취소" }));

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith("결재 신청을 취소했습니다.");
        });
        expect(closeModal).toHaveBeenCalledTimes(1);
        expect(refresh).toHaveBeenCalledTimes(1);
    });

    it("결재 취소가 실패하면 오류를 알리고 모달을 유지한다", async () => {
        mockedGetApprovalDetailAction.mockResolvedValue({
            success: true,
            message: "조회했습니다.",
            data: inProgressApproval,
        });
        mockedCancelApprovalAction.mockResolvedValue({ success: false, message: "취소에 실패했습니다." });
        const closeModal = jest.fn();

        render(<MyApprovalModal closeModal={closeModal} id={1} />);
        await screen.findByRole("heading", { name: "여름 휴가" });
        fireEvent.click(screen.getByRole("button", { name: "결재 취소" }));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("취소에 실패했습니다.");
        });
        expect(closeModal).not.toHaveBeenCalled();
    });

    it("결재라인 수정을 클릭하면 결재라인 수정 모달을 연다", async () => {
        mockedGetApprovalDetailAction.mockResolvedValue({
            success: true,
            message: "조회했습니다.",
            data: inProgressApproval,
        });

        render(<MyApprovalModal closeModal={jest.fn()} id={1} />);
        await screen.findByRole("heading", { name: "여름 휴가" });
        fireEvent.click(screen.getByRole("button", { name: "결재라인 수정" }));

        expect(screen.getByText("결재라인 수정 모달")).toBeInTheDocument();
    });

    it("반려된 문서는 삭제와 재상신 버튼을 보여주고 결재라인 수정/취소는 숨긴다", async () => {
        mockedGetApprovalDetailAction.mockResolvedValue({
            success: true,
            message: "조회했습니다.",
            data: rejectedApproval,
        });

        render(<MyApprovalModal closeModal={jest.fn()} id={1} />);

        await screen.findByRole("heading", { name: "여름 휴가" });
        expect(screen.getByRole("button", { name: "삭제" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "재상신" })).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "결재라인 수정" })).not.toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "결재 취소" })).not.toBeInTheDocument();
    });

    it("재상신이 성공하면 성공 메시지를 알리고 모달을 닫은 뒤 새로고침한다", async () => {
        mockedGetApprovalDetailAction.mockResolvedValue({
            success: true,
            message: "조회했습니다.",
            data: rejectedApproval,
        });
        mockedResubmitApprovalAction.mockResolvedValue({ success: true, message: "결재를 재상신했습니다." });
        const closeModal = jest.fn();

        render(<MyApprovalModal closeModal={closeModal} id={1} />);
        await screen.findByRole("heading", { name: "여름 휴가" });
        fireEvent.click(screen.getByRole("button", { name: "재상신" }));

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith("결재를 재상신했습니다.");
        });
        expect(closeModal).toHaveBeenCalledTimes(1);
    });

    it("삭제(이력 삭제)가 성공하면 성공 메시지를 알리고 모달을 닫은 뒤 새로고침한다", async () => {
        mockedGetApprovalDetailAction.mockResolvedValue({
            success: true,
            message: "조회했습니다.",
            data: rejectedApproval,
        });
        mockedHideApprovalHistoryAction.mockResolvedValue({ success: true, message: "내 결재 이력에서 삭제했습니다." });
        const closeModal = jest.fn();

        render(<MyApprovalModal closeModal={closeModal} id={1} />);
        await screen.findByRole("heading", { name: "여름 휴가" });
        fireEvent.click(screen.getByRole("button", { name: "삭제" }));

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith("내 결재 이력에서 삭제했습니다.");
        });
        expect(closeModal).toHaveBeenCalledTimes(1);
    });

    it("조회에 실패하면 오류 메시지를 표시한다", async () => {
        mockedGetApprovalDetailAction.mockResolvedValue({
            success: false,
            message: "결재 상세 조회에 실패했습니다.",
        });

        render(<MyApprovalModal closeModal={jest.fn()} id={1} />);

        expect(await screen.findByText("결재 상세 조회에 실패했습니다.")).toBeInTheDocument();
    });
});
