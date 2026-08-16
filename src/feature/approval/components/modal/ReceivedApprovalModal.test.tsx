import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import {
    getApprovalDetailAction,
    summarizeApprovalAttachmentAction,
} from "../../actions";
import ReceivedApprovalModal from "./ReceivedApprovalModal";

jest.mock("../../actions", () => ({
    getApprovalDetailAction: jest.fn(),
    summarizeApprovalAttachmentAction: jest.fn(),
}));

const mockedGetApprovalDetailAction = getApprovalDetailAction as jest.Mock;
const mockedSummarizeApprovalAttachmentAction = summarizeApprovalAttachmentAction as jest.Mock;

const baseApproval = {
    id: 1,
    templateId: 1,
    templateName: "지출 결의서",
    title: "출장비 정산",
    contentType: "TEXT" as const,
    text: "출장비를 정산합니다.",
    attachments: [] as {
        fileId: number;
        aiSummary: string | null;
        summaryStatus: "PENDING" | "COMPLETED" | "FAILED";
        summarizedAt: string | null;
    }[],
    creatorId: 2,
    creatorName: "김민수",
    status: "IN_PROGRESS" as const,
    createdAt: "2026-08-16",
    lines: [
        {
            lineId: 1,
            stepOrder: 1,
            approverId: 1,
            approverName: "이지은",
            status: "PENDING" as const,
            comment: null,
            decidedAt: null,
        },
    ],
};

describe("ReceivedApprovalModal", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("결재 상세를 조회해 제목과 결재 라인, 내용을 표시한다", async () => {
        mockedGetApprovalDetailAction.mockResolvedValue({
            success: true,
            message: "조회했습니다.",
            data: baseApproval,
        });

        render(
            <ReceivedApprovalModal
                activeModal={jest.fn()}
                closeModal={jest.fn()}
                id={1}
                noneActiveModal={jest.fn()}
            />,
        );

        expect(await screen.findByRole("heading", { name: "출장비 정산" })).toBeInTheDocument();
        expect(screen.getByText("1차 · 이지은")).toBeInTheDocument();
        expect(screen.getByText("출장비를 정산합니다.")).toBeInTheDocument();
        expect(screen.getByText("첨부파일이 없습니다.")).toBeInTheDocument();
        expect(screen.getByText("생성된 AI 요약이 없습니다.")).toBeInTheDocument();
        expect(mockedSummarizeApprovalAttachmentAction).not.toHaveBeenCalled();
    });

    it("요약이 없는 첨부파일이 있으면 요약을 생성한 뒤 다시 조회해 요약을 표시한다", async () => {
        const approvalWithAttachment = {
            ...baseApproval,
            attachments: [{ fileId: 10, aiSummary: null, summaryStatus: "PENDING" as const, summarizedAt: null }],
        };
        mockedGetApprovalDetailAction
            .mockResolvedValueOnce({ success: true, message: "조회했습니다.", data: approvalWithAttachment })
            .mockResolvedValueOnce({
                success: true,
                message: "조회했습니다.",
                data: {
                    ...approvalWithAttachment,
                    attachments: [
                        {
                            fileId: 10,
                            aiSummary: "출장비 40만원 정산 요청입니다.",
                            summaryStatus: "COMPLETED" as const,
                            summarizedAt: "2026-08-16",
                        },
                    ],
                },
            });
        mockedSummarizeApprovalAttachmentAction.mockResolvedValue({
            success: true,
            message: "요약을 생성했습니다.",
            data: { fileId: 10, aiSummary: "출장비 40만원 정산 요청입니다.", summaryStatus: "COMPLETED", summarizedAt: "2026-08-16" },
        });

        render(
            <ReceivedApprovalModal
                activeModal={jest.fn()}
                closeModal={jest.fn()}
                id={1}
                noneActiveModal={jest.fn()}
            />,
        );

        await waitFor(() => {
            expect(mockedSummarizeApprovalAttachmentAction).toHaveBeenCalledWith(1, 10);
        });
        expect(await screen.findByText("출장비 40만원 정산 요청입니다.")).toBeInTheDocument();
        expect(mockedGetApprovalDetailAction).toHaveBeenCalledTimes(2);
    });

    it("요약 생성이 실패하면 요약 실패 메시지를 표시한다", async () => {
        const approvalWithAttachment = {
            ...baseApproval,
            attachments: [{ fileId: 10, aiSummary: null, summaryStatus: "PENDING" as const, summarizedAt: null }],
        };
        mockedGetApprovalDetailAction.mockResolvedValue({
            success: true,
            message: "조회했습니다.",
            data: approvalWithAttachment,
        });
        mockedSummarizeApprovalAttachmentAction.mockResolvedValue({
            success: false,
            message: "첨부파일 요약 생성에 실패했습니다.",
        });

        render(
            <ReceivedApprovalModal
                activeModal={jest.fn()}
                closeModal={jest.fn()}
                id={1}
                noneActiveModal={jest.fn()}
            />,
        );

        expect(await screen.findByText("첨부파일 요약 생성에 실패했습니다.")).toBeInTheDocument();
    });

    it("승인을 클릭하면 activeModal을 호출한다", async () => {
        mockedGetApprovalDetailAction.mockResolvedValue({
            success: true,
            message: "조회했습니다.",
            data: baseApproval,
        });
        const activeModal = jest.fn();

        render(
            <ReceivedApprovalModal
                activeModal={activeModal}
                closeModal={jest.fn()}
                id={1}
                noneActiveModal={jest.fn()}
            />,
        );

        await screen.findByRole("heading", { name: "출장비 정산" });
        fireEvent.click(screen.getByRole("button", { name: "승인" }));

        expect(activeModal).toHaveBeenCalledTimes(1);
    });

    it("반려를 클릭하면 noneActiveModal을 호출한다", async () => {
        mockedGetApprovalDetailAction.mockResolvedValue({
            success: true,
            message: "조회했습니다.",
            data: baseApproval,
        });
        const noneActiveModal = jest.fn();

        render(
            <ReceivedApprovalModal
                activeModal={jest.fn()}
                closeModal={jest.fn()}
                id={1}
                noneActiveModal={noneActiveModal}
            />,
        );

        await screen.findByRole("heading", { name: "출장비 정산" });
        fireEvent.click(screen.getByRole("button", { name: "반려" }));

        expect(noneActiveModal).toHaveBeenCalledTimes(1);
    });

    it("결재 라인에 의견이 있으면 의견 섹션을 표시한다", async () => {
        mockedGetApprovalDetailAction.mockResolvedValue({
            success: true,
            message: "조회했습니다.",
            data: {
                ...baseApproval,
                lines: [{ ...baseApproval.lines[0], comment: "확인했습니다", status: "APPROVED" as const }],
            },
        });

        render(
            <ReceivedApprovalModal
                activeModal={jest.fn()}
                closeModal={jest.fn()}
                id={1}
                noneActiveModal={jest.fn()}
            />,
        );

        expect(await screen.findByText('"확인했습니다"')).toBeInTheDocument();
    });

    it("닫기를 클릭하면 closeModal을 호출한다", async () => {
        mockedGetApprovalDetailAction.mockResolvedValue({
            success: true,
            message: "조회했습니다.",
            data: baseApproval,
        });
        const closeModal = jest.fn();

        render(
            <ReceivedApprovalModal
                activeModal={jest.fn()}
                closeModal={closeModal}
                id={1}
                noneActiveModal={jest.fn()}
            />,
        );

        await screen.findByRole("heading", { name: "출장비 정산" });
        fireEvent.click(screen.getByRole("button", { name: "결재 확인 모달 닫기" }));

        expect(closeModal).toHaveBeenCalledTimes(1);
    });
});
