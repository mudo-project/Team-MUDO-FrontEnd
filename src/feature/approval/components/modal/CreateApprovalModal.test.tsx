import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { uploadFiles } from "../../../file/uploadFiles";
import { createApprovalAction } from "../../actions";
import CreateApprovalModal from "./CreateApprovalModal";
import { toast } from "sonner";

const refresh = jest.fn();

jest.mock("../../../file/uploadFiles", () => ({
    uploadFiles: jest.fn(),
}));

jest.mock("../../actions", () => ({
    createApprovalAction: jest.fn(),
}));

jest.mock("next/navigation", () => ({
    useRouter: () => ({ refresh }),
}));

jest.mock("sonner", () => ({
    toast: {
        success: jest.fn(),
    },
}));

// ApprovalLine은 자체 테스트 파일에서 검증하므로, 이 테스트에서는
// 상위 상태(setSelectedTemplateId 등)를 직접 조작할 수 있는 단순 대체 컴포넌트로 교체한다.
jest.mock("../ApprovalLine", () => ({
    __esModule: true,
    default: function MockApprovalLine({
        setSelectedTemplateId,
        setApprovalLines,
        setHasChangedApprovalLine,
        setTemplateDatas,
    }: {
        setSelectedTemplateId: (id: string) => void;
        setApprovalLines: (lines: { stepOrder: number; approverId: number; approverName: string }[]) => void;
        setHasChangedApprovalLine: (value: boolean) => void;
        setTemplateDatas: (updater: (prev: { isLoading: boolean }) => { isLoading: boolean }) => void;
    }) {
        return (
            <div>
                <button
                    onClick={() => {
                        setSelectedTemplateId("1");
                        setApprovalLines([{ stepOrder: 1, approverId: 2, approverName: "김민수" }]);
                        setTemplateDatas((prev) => ({ ...prev, isLoading: false }));
                    }}
                    type="button"
                >
                    템플릿 선택
                </button>
                <button onClick={() => setHasChangedApprovalLine(true)} type="button">
                    결재선 변경
                </button>
            </div>
        );
    },
}));

const mockedUploadFiles = uploadFiles as jest.Mock;
const mockedCreateApprovalAction = createApprovalAction as jest.Mock;

const selectTemplate = () => {
    fireEvent.click(screen.getByRole("button", { name: "템플릿 선택" }));
};

const fillTitleAndContent = (title: string, content: string) => {
    fireEvent.change(screen.getByPlaceholderText("결재 제목을 입력하세요"), { target: { value: title } });
    fireEvent.change(screen.getByPlaceholderText("결재 내용을 입력하세요"), { target: { value: content } });
};

const getFileInput = () => document.querySelector('input[type="file"]') as HTMLInputElement;

describe("CreateApprovalModal", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("템플릿을 선택하지 않으면 상신하기 버튼이 비활성화된다", () => {
        render(<CreateApprovalModal closeModal={jest.fn()} />);

        expect(screen.getByRole("button", { name: "상신하기" })).toBeDisabled();
    });

    it("템플릿을 선택하면 상신하기 버튼이 활성화된다", () => {
        render(<CreateApprovalModal closeModal={jest.fn()} />);

        selectTemplate();

        expect(screen.getByRole("button", { name: "상신하기" })).toBeEnabled();
    });

    it("제목과 내용을 입력하지 않고 제출하면 오류 메시지를 표시한다", () => {
        render(<CreateApprovalModal closeModal={jest.fn()} />);

        selectTemplate();
        fireEvent.click(screen.getByRole("button", { name: "상신하기" }));

        expect(screen.getByText("제목과 내용을 입력해주세요")).toBeInTheDocument();
        expect(mockedCreateApprovalAction).not.toHaveBeenCalled();
    });

    it("휴가 시작일만 입력하고 제출하면 오류 메시지를 표시한다", () => {
        render(<CreateApprovalModal closeModal={jest.fn()} />);

        selectTemplate();
        fillTitleAndContent("여름 휴가", "휴가를 신청합니다.");
        fireEvent.change(document.querySelector('input[name="leaveStartDate"]')!, {
            target: { value: "2026-08-20" },
        });
        fireEvent.click(screen.getByRole("button", { name: "상신하기" }));

        expect(screen.getByText("휴가 신청 시 시작일과 종료일을 모두 작성해주세요")).toBeInTheDocument();
        expect(mockedCreateApprovalAction).not.toHaveBeenCalled();
    });

    it("휴가 종료일이 시작일보다 빠르면 오류 메시지를 표시한다", () => {
        render(<CreateApprovalModal closeModal={jest.fn()} />);

        selectTemplate();
        fillTitleAndContent("여름 휴가", "휴가를 신청합니다.");
        fireEvent.change(document.querySelector('input[name="leaveStartDate"]')!, {
            target: { value: "2026-08-20" },
        });
        fireEvent.change(document.querySelector('input[name="leaveEndDate"]')!, {
            target: { value: "2026-08-19" },
        });
        fireEvent.click(screen.getByRole("button", { name: "상신하기" }));

        expect(screen.getByText("휴가 시작일과 종료일을 다시 확인해주세요")).toBeInTheDocument();
    });

    it("허용되지 않은 확장자의 파일을 첨부하면 오류 메시지를 표시하고 목록에 추가하지 않는다", () => {
        render(<CreateApprovalModal closeModal={jest.fn()} />);

        const invalidFile = new File(["내용"], "image.png", { type: "image/png" });
        fireEvent.change(getFileInput(), { target: { files: [invalidFile] } });

        expect(
            screen.getByText("PDF, DOCX, XLSX 파일만 개당 최대 50MB까지 첨부할 수 있습니다."),
        ).toBeInTheDocument();
        expect(screen.queryByText("image.png")).not.toBeInTheDocument();
    });

    it("허용된 확장자의 파일을 첨부하면 목록에 표시된다", () => {
        render(<CreateApprovalModal closeModal={jest.fn()} />);

        const validFile = new File(["내용"], "attachment.pdf", { type: "application/pdf" });
        fireEvent.change(getFileInput(), { target: { files: [validFile] } });

        expect(screen.getByText("attachment.pdf")).toBeInTheDocument();
    });

    it("첨부한 파일을 삭제하면 목록에서 제거된다", () => {
        render(<CreateApprovalModal closeModal={jest.fn()} />);

        const validFile = new File(["내용"], "attachment.pdf", { type: "application/pdf" });
        fireEvent.change(getFileInput(), { target: { files: [validFile] } });
        expect(screen.getByText("attachment.pdf")).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: "attachment.pdf 삭제" }));

        expect(screen.queryByText("attachment.pdf")).not.toBeInTheDocument();
    });

    it("제출이 성공하면 파일을 업로드하고 결재를 신청한 뒤 모달을 닫고 새로고침한다", async () => {
        mockedUploadFiles.mockResolvedValue({ fileIds: [100], uploadedFileIds: {} });
        mockedCreateApprovalAction.mockResolvedValue({
            success: true,
            message: "결재를 신청했습니다.",
            data: { documentId: 7 },
        });
        const closeModal = jest.fn();

        render(<CreateApprovalModal closeModal={closeModal} />);

        selectTemplate();
        fillTitleAndContent("여름 휴가", "휴가를 신청합니다.");
        const validFile = new File(["내용"], "attachment.pdf", { type: "application/pdf" });
        fireEvent.change(getFileInput(), { target: { files: [validFile] } });
        fireEvent.click(screen.getByRole("button", { name: "상신하기" }));

        await waitFor(() => {
            expect(mockedCreateApprovalAction).toHaveBeenCalledWith({
                templateId: 1,
                title: "여름 휴가",
                contentType: "TEXT",
                text: "휴가를 신청합니다.",
                fileIds: [100],
                approverIds: undefined,
            });
        });
        expect(toast.success).toHaveBeenCalledWith("결재를 신청했습니다.");
        expect(closeModal).toHaveBeenCalledTimes(1);
        expect(refresh).toHaveBeenCalledTimes(1);
    });

    it("결재선을 변경했다면 변경된 결재자 ID를 함께 전달한다", async () => {
        mockedUploadFiles.mockResolvedValue({ fileIds: [], uploadedFileIds: {} });
        mockedCreateApprovalAction.mockResolvedValue({
            success: true,
            message: "결재를 신청했습니다.",
            data: { documentId: 7 },
        });

        render(<CreateApprovalModal closeModal={jest.fn()} />);

        selectTemplate();
        fireEvent.click(screen.getByRole("button", { name: "결재선 변경" }));
        fillTitleAndContent("여름 휴가", "휴가를 신청합니다.");
        fireEvent.click(screen.getByRole("button", { name: "상신하기" }));

        await waitFor(() => {
            expect(mockedCreateApprovalAction).toHaveBeenCalledWith(
                expect.objectContaining({ approverIds: [2] }),
            );
        });
    });

    it("결재 신청이 실패하면 오류 메시지를 표시하고 모달을 유지한다", async () => {
        mockedUploadFiles.mockResolvedValue({ fileIds: [], uploadedFileIds: {} });
        mockedCreateApprovalAction.mockResolvedValue({ success: false, message: "결재 신청에 실패했습니다." });
        const closeModal = jest.fn();

        render(<CreateApprovalModal closeModal={closeModal} />);

        selectTemplate();
        fillTitleAndContent("여름 휴가", "휴가를 신청합니다.");
        fireEvent.click(screen.getByRole("button", { name: "상신하기" }));

        expect(await screen.findByText("결재 신청에 실패했습니다.")).toBeInTheDocument();
        expect(closeModal).not.toHaveBeenCalled();
    });

    it("파일 업로드가 실패하면 결재 신청을 호출하지 않고 오류를 표시한다", async () => {
        mockedUploadFiles.mockRejectedValue(new Error("첨부파일 업로드에 실패했습니다."));

        render(<CreateApprovalModal closeModal={jest.fn()} />);

        selectTemplate();
        fillTitleAndContent("여름 휴가", "휴가를 신청합니다.");
        const validFile = new File(["내용"], "attachment.pdf", { type: "application/pdf" });
        fireEvent.change(getFileInput(), { target: { files: [validFile] } });
        fireEvent.click(screen.getByRole("button", { name: "상신하기" }));

        expect(await screen.findByText("첨부파일 업로드에 실패했습니다.")).toBeInTheDocument();
        expect(mockedCreateApprovalAction).not.toHaveBeenCalled();
    });

    it("닫기를 클릭하면 closeModal을 호출한다", () => {
        const closeModal = jest.fn();

        render(<CreateApprovalModal closeModal={closeModal} />);

        fireEvent.click(screen.getByRole("button", { name: "결재 상신 모달 닫기" }));

        expect(closeModal).toHaveBeenCalledTimes(1);
    });
});
