import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { getUserListAction } from "../../../auth/actions";
import { createApprovalTemplateAction } from "../../actions";
import CreateApprovalTemplateModal from "./CreateApprovalTemplateModal";
import { toast } from "sonner";

const refresh = jest.fn();

jest.mock("../../actions", () => ({
    createApprovalTemplateAction: jest.fn(),
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

const mockedCreateApprovalTemplateAction = createApprovalTemplateAction as jest.Mock;
const mockedGetUserListAction = getUserListAction as jest.Mock;

const users: UserListResponse[] = [
    { userId: 1, name: "본인", username: "me" },
    { userId: 2, name: "김민수", username: "minsu" },
];

const submitTemplate = () => {
    fireEvent.change(screen.getByLabelText(/템플릿 이름/), { target: { value: "휴가 신청서" } });
    fireEvent.submit(screen.getByRole("button", { name: "템플릿 저장" }).closest("form")!);
};

describe("CreateApprovalTemplateModal", () => {
    beforeEach(() => {
        mockedGetUserListAction.mockResolvedValue({ success: true, message: "조회했습니다.", data: users });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("결재자 추가를 클릭하면 결재선 입력 행을 추가한다", async () => {
        render(<CreateApprovalTemplateModal closeModal={jest.fn()} />);

        await screen.findByRole("option", { name: "김민수 (minsu)" });
        expect(screen.getByLabelText("1차 결재자")).toBeInTheDocument();
        expect(screen.queryByLabelText("2차 결재자")).not.toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: "결재자 추가" }));

        expect(screen.getByLabelText("2차 결재자")).toBeInTheDocument();
    });

    it("생성이 성공하면 성공 메시지를 알리고 모달을 닫은 뒤 새로고침한다", async () => {
        mockedCreateApprovalTemplateAction.mockResolvedValue({
            success: true,
            message: "템플릿을 생성했습니다.",
            data: { templateId: 10 },
        });
        const closeModal = jest.fn();

        render(<CreateApprovalTemplateModal closeModal={closeModal} />);
        await screen.findByRole("option", { name: "김민수 (minsu)" });

        submitTemplate();

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith("템플릿을 생성했습니다.");
        });
        expect(closeModal).toHaveBeenCalledTimes(1);
        expect(refresh).toHaveBeenCalledTimes(1);
    });

    it("생성이 실패하면 오류 메시지를 표시하고 모달을 유지한다", async () => {
        mockedCreateApprovalTemplateAction.mockResolvedValue({
            success: false,
            message: "결재자를 한 명 이상 선택해 주세요.",
        });
        const closeModal = jest.fn();

        render(<CreateApprovalTemplateModal closeModal={closeModal} />);
        await screen.findByRole("option", { name: "김민수 (minsu)" });

        submitTemplate();

        expect(await screen.findByText("결재자를 한 명 이상 선택해 주세요.")).toBeInTheDocument();
        expect(closeModal).not.toHaveBeenCalled();
    });
});
