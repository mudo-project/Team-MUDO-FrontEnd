import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { getUserListAction } from "../../../auth/actions";
import { changeApprovalTemplateAction, getApprovalTemplateDetailAction } from "../../actions";
import EditApprovalTemplateModal from "./EditApprovalTemplateModal";
import { toast } from "sonner";

const refresh = jest.fn();

jest.mock("../../actions", () => ({
    createApprovalTemplateAction: jest.fn(),
    changeApprovalTemplateAction: jest.fn(),
    getApprovalTemplateDetailAction: jest.fn(),
}));

jest.mock("../../../auth/actions", () => ({
    getUserListAction: jest.fn(),
}));

jest.mock("next/navigation", () => ({
    useRouter: () => ({ refresh }),
}));

jest.mock("sonner", () => ({
    toast: {
        success: jest.fn(),
    },
}));

const mockedChangeApprovalTemplateAction = changeApprovalTemplateAction as jest.Mock;
const mockedGetApprovalTemplateDetailAction = getApprovalTemplateDetailAction as jest.Mock;
const mockedGetUserListAction = getUserListAction as jest.Mock;

const users: UserListResponse[] = [
    { userId: 1, name: "본인", username: "me" },
    { userId: 2, name: "김민수", username: "minsu" },
];

const templateDetail = {
    id: 1,
    name: "기존 템플릿",
    createdAt: "2026-08-01T00:00:00.000Z",
    creatorId: 1,
    lines: [{ stepOrder: 1, approverId: 2, approverName: "김민수" }],
};

describe("EditApprovalTemplateModal", () => {
    beforeEach(() => {
        mockedGetUserListAction.mockResolvedValue({ success: true, message: "조회했습니다.", data: users });
        mockedGetApprovalTemplateDetailAction.mockResolvedValue({
            success: true,
            message: "조회했습니다.",
            data: templateDetail,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("조회한 템플릿 이름과 결재선을 입력에 표시한다", async () => {
        render(<EditApprovalTemplateModal closeModal={jest.fn()} id={1} />);

        expect(await screen.findByDisplayValue("기존 템플릿")).toBeInTheDocument();
        expect(screen.getByLabelText("1차 결재자")).toHaveValue("2");
    });

    it("결재자 추가를 클릭하면 결재선 입력 행을 추가한다", async () => {
        render(<EditApprovalTemplateModal closeModal={jest.fn()} id={1} />);

        await screen.findByDisplayValue("기존 템플릿");
        fireEvent.click(screen.getByRole("button", { name: "결재자 추가" }));

        expect(screen.getByLabelText("2차 결재자")).toBeInTheDocument();
    });

    it("수정이 성공하면 성공 메시지를 알리고 모달을 닫은 뒤 새로고침한다", async () => {
        mockedChangeApprovalTemplateAction.mockResolvedValue({
            success: true,
            message: "결재 템플릿을 수정했습니다.",
        });
        const closeModal = jest.fn();

        render(<EditApprovalTemplateModal closeModal={closeModal} id={1} />);
        const nameInput = await screen.findByDisplayValue("기존 템플릿");
        fireEvent.change(nameInput, { target: { value: "변경된 템플릿" } });
        fireEvent.submit(screen.getByRole("button", { name: "템플릿 수정" }).closest("form")!);

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith("결재 템플릿을 수정했습니다.");
        });
        expect(mockedChangeApprovalTemplateAction.mock.calls[0][0]).toBe(1);
        expect(closeModal).toHaveBeenCalledTimes(1);
        expect(refresh).toHaveBeenCalledTimes(1);
    });

    it("수정이 실패하면 오류 메시지를 표시하고 모달을 유지한다", async () => {
        mockedChangeApprovalTemplateAction.mockResolvedValue({
            success: false,
            message: "결재자를 한 명 이상 선택해 주세요.",
        });
        const closeModal = jest.fn();

        render(<EditApprovalTemplateModal closeModal={closeModal} id={1} />);
        await screen.findByDisplayValue("기존 템플릿");
        fireEvent.submit(screen.getByRole("button", { name: "템플릿 수정" }).closest("form")!);

        expect(await screen.findByText("결재자를 한 명 이상 선택해 주세요.")).toBeInTheDocument();
        expect(closeModal).not.toHaveBeenCalled();
    });

    it("템플릿 상세 조회가 실패해도 기본 결재선 한 행으로 폼을 표시한다", async () => {
        mockedGetApprovalTemplateDetailAction.mockResolvedValue({
            success: false,
            message: "결재 템플릿 상세 조회에 실패했습니다.",
        });

        render(<EditApprovalTemplateModal closeModal={jest.fn()} id={1} />);

        expect(await screen.findByLabelText("1차 결재자")).toBeInTheDocument();
        expect(screen.queryByLabelText("2차 결재자")).not.toBeInTheDocument();
    });
});
