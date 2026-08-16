import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { getApprovalAttachmentDownloadUrlAction } from "../actions";
import ApprovalAttachmentDownloadButton from "./ApprovalAttachmentDownloadButton";

jest.mock("../actions", () => ({
    getApprovalAttachmentDownloadUrlAction: jest.fn(),
}));

const mockedGetApprovalAttachmentDownloadUrlAction =
    getApprovalAttachmentDownloadUrlAction as jest.Mock;

describe("ApprovalAttachmentDownloadButton", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("다운로드가 성공하면 새 창으로 다운로드 URL을 연다", async () => {
        mockedGetApprovalAttachmentDownloadUrlAction.mockResolvedValue({
            success: true,
            message: "조회했습니다.",
            data: { downloadUrl: "https://example.com/file" },
        });
        const openSpy = jest.spyOn(window, "open").mockImplementation(() => null);

        render(<ApprovalAttachmentDownloadButton documentId={1} fileId={2} />);

        fireEvent.click(screen.getByRole("button", { name: "첨부파일 #2" }));

        await waitFor(() => {
            expect(openSpy).toHaveBeenCalledWith(
                "https://example.com/file",
                "_blank",
                "noopener,noreferrer",
            );
        });
        expect(mockedGetApprovalAttachmentDownloadUrlAction).toHaveBeenCalledWith(1, 2);
    });

    it("다운로드가 실패하면 오류 메시지를 표시한다", async () => {
        mockedGetApprovalAttachmentDownloadUrlAction.mockResolvedValue({
            success: false,
            message: "다운로드 URL 조회에 실패했습니다.",
        });

        render(<ApprovalAttachmentDownloadButton documentId={1} fileId={2} />);

        fireEvent.click(screen.getByRole("button", { name: "첨부파일 #2" }));

        expect(await screen.findByText("다운로드 URL 조회에 실패했습니다.")).toBeInTheDocument();
    });

    it("요청 중에는 버튼을 비활성화하고 로딩 문구를 표시한다", async () => {
        let resolveAction: (value: {
            success: boolean;
            message: string;
            data?: { downloadUrl: string };
        }) => void = () => undefined;
        mockedGetApprovalAttachmentDownloadUrlAction.mockReturnValue(
            new Promise((resolve) => {
                resolveAction = resolve;
            }),
        );

        render(<ApprovalAttachmentDownloadButton documentId={1} fileId={2} />);

        fireEvent.click(screen.getByRole("button", { name: "첨부파일 #2" }));

        const pendingButton = await screen.findByRole("button", {
            name: "다운로드 URL을 불러오는 중입니다.",
        });
        expect(pendingButton).toBeDisabled();

        await act(async () => {
            resolveAction({
                success: true,
                message: "조회했습니다.",
                data: { downloadUrl: "https://example.com/file" },
            });
        });
    });
});
