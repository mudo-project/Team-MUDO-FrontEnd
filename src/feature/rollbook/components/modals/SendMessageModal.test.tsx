import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { getMessageCandidatesAction, sendAttendanceMessageAction } from "../../actions";
import { MessageCandidateData } from "@/feature/rollbook/type";
import SendMessageModal from "./SendMessageModal";

jest.mock("../../actions", () => ({
    getMessageCandidatesAction: jest.fn(),
    sendAttendanceMessageAction: jest.fn(),
}));

jest.mock("sonner", () => ({
    toast: { success: jest.fn() },
}));

const mockedGetMessageCandidatesAction =
    getMessageCandidatesAction as jest.MockedFunction<typeof getMessageCandidatesAction>;
const mockedSendAttendanceMessageAction =
    sendAttendanceMessageAction as jest.MockedFunction<typeof sendAttendanceMessageAction>;

const candidates: MessageCandidateData[] = [
    {
        studentId: 1,
        studentName: "김민수",
        status: "ABSENT",
        parentPhone: "010-1111-2222",
        matchedTemplateId: 1,
        matchedTemplateName: "결석 안내",
        eligible: true,
    },
    {
        studentId: 2,
        studentName: "이지은",
        status: "LATE",
        parentPhone: "010-3333-4444",
        matchedTemplateId: 2,
        matchedTemplateName: "지각 안내",
        eligible: true,
    },
];

const renderModal = (closeModal = jest.fn()) =>
    render(
        <SendMessageModal
            closeModal={closeModal}
            date="2026-08-16"
            lectureId={7}
            lectureName="API 수학 정규반"
        />,
    );

describe("SendMessageModal", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("발송 대상을 조회해 전체 선택 상태로 표시한다", async () => {
        mockedGetMessageCandidatesAction.mockResolvedValue({
            success: true,
            message: "조회했습니다.",
            data: candidates,
        });

        renderModal();

        expect(await screen.findByText("김민수")).toBeInTheDocument();
        expect(screen.getByText("이지은")).toBeInTheDocument();
        expect(screen.getByText("2/2명")).toBeInTheDocument();
        expect(screen.getByRole("checkbox", { name: /전체 선택/ })).toBeChecked();
        expect(screen.getByRole("button", { name: "2명에게 전송" })).toBeEnabled();
    });

    it("발송 대상 조회에 실패하면 오류 메시지를 노출한다", async () => {
        mockedGetMessageCandidatesAction.mockResolvedValue({
            success: false,
            message: "문자 발송 대상 조회에 실패했습니다.",
        });

        renderModal();

        expect(
            await screen.findByText("문자 발송 대상 조회에 실패했습니다."),
        ).toHaveAttribute("role", "alert");
    });

    it("학생 체크박스를 해제하면 발송 대상에서 제외한다", async () => {
        mockedGetMessageCandidatesAction.mockResolvedValue({
            success: true,
            message: "조회했습니다.",
            data: candidates,
        });

        renderModal();
        await screen.findByText("김민수");

        fireEvent.click(screen.getByRole("checkbox", { name: /이지은/ }));

        expect(screen.getByText("1/2명")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "1명에게 전송" })).toBeEnabled();
    });

    it("전체 선택을 해제하면 발송 대상을 모두 제외한다", async () => {
        mockedGetMessageCandidatesAction.mockResolvedValue({
            success: true,
            message: "조회했습니다.",
            data: candidates,
        });

        renderModal();
        await screen.findByText("김민수");

        fireEvent.click(screen.getByRole("checkbox", { name: /전체 선택/ }));

        expect(screen.getByText("0/2명")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /명에게 전송/ })).toBeDisabled();
    });

    it("발송 버튼을 클릭하면 선택된 학생에게 문자를 발송한다", async () => {
        mockedGetMessageCandidatesAction.mockResolvedValue({
            success: true,
            message: "조회했습니다.",
            data: candidates,
        });
        mockedSendAttendanceMessageAction.mockResolvedValue({
            success: true,
            message: "출결 안내 문자를 발송했습니다.",
            data: [],
        });
        const closeModal = jest.fn();

        renderModal(closeModal);
        await screen.findByText("김민수");

        fireEvent.click(screen.getByRole("button", { name: "2명에게 전송" }));

        await waitFor(() => {
            expect(mockedSendAttendanceMessageAction).toHaveBeenCalledWith(7, "2026-08-16", {
                studentIds: [1, 2],
            });
        });
        expect(toast.success).toHaveBeenCalledWith("출결 안내 문자를 발송했습니다.");
        expect(closeModal).toHaveBeenCalled();
    });

    it("발송에 실패하면 오류 메시지를 노출하고 모달을 유지한다", async () => {
        mockedGetMessageCandidatesAction.mockResolvedValue({
            success: true,
            message: "조회했습니다.",
            data: candidates,
        });
        mockedSendAttendanceMessageAction.mockResolvedValue({
            success: false,
            message: "출결 안내 문자 발송에 실패했습니다.",
        });
        const closeModal = jest.fn();

        renderModal(closeModal);
        await screen.findByText("김민수");

        fireEvent.click(screen.getByRole("button", { name: "2명에게 전송" }));

        expect(
            await screen.findByText("출결 안내 문자 발송에 실패했습니다."),
        ).toHaveAttribute("role", "alert");
        expect(closeModal).not.toHaveBeenCalled();
    });

    it("닫기 버튼을 클릭하면 closeModal을 호출한다", async () => {
        mockedGetMessageCandidatesAction.mockResolvedValue({
            success: true,
            message: "조회했습니다.",
            data: candidates,
        });
        const closeModal = jest.fn();

        renderModal(closeModal);
        await screen.findByText("김민수");

        fireEvent.click(screen.getByRole("button", { name: "닫기" }));

        expect(closeModal).toHaveBeenCalled();
    });
});
