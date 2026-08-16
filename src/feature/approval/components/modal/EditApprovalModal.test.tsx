import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { getUserListAction } from "../../../auth/actions";
import { useUserStore } from "../../../../store/useUserStore";
import { changeApprovalLinesAction } from "../../actions";
import EditApprovalModal from "./EditApprovalModal";
import { ApprovalDetailData } from "../../type";
import { toast } from "sonner";

const refresh = jest.fn();

jest.mock("../../actions", () => ({
    changeApprovalLinesAction: jest.fn(),
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

const mockedChangeApprovalLinesAction = changeApprovalLinesAction as jest.Mock;
const mockedGetUserListAction = getUserListAction as jest.Mock;

const users: UserListResponse[] = [
    { userId: 1, name: "본인", username: "me" },
    { userId: 2, name: "김민수", username: "minsu" },
    { userId: 3, name: "이지은", username: "jieun" },
];

const approval: ApprovalDetailData = {
    id: 1,
    templateId: 1,
    templateName: "휴가 신청",
    title: "여름 휴가",
    contentType: "TEXT",
    text: "휴가를 신청합니다.",
    attachments: [],
    creatorId: 1,
    creatorName: "본인",
    status: "IN_PROGRESS",
    createdAt: "2026-08-16",
    lines: [
        { lineId: 1, stepOrder: 1, approverId: 2, approverName: "김민수", status: "PENDING", comment: null, decidedAt: null },
    ],
};

describe("EditApprovalModal", () => {
    beforeEach(() => {
        act(() => {
            useUserStore.setState({ user: { ...useUserStore.getState().user, sub: "1" } });
        });
        mockedGetUserListAction.mockResolvedValue({ success: true, message: "조회했습니다.", data: users });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("기존 결재 라인을 선택 상태로 표시한다", async () => {
        render(<EditApprovalModal approval={approval} closeModal={jest.fn()} documentId={1} />);

        expect(await screen.findByLabelText("1차 결재자")).toHaveValue("2");
    });

    it("결재자 추가를 클릭하면 결재선을 추가한다", async () => {
        render(<EditApprovalModal approval={approval} closeModal={jest.fn()} documentId={1} />);

        await screen.findByLabelText("1차 결재자");
        fireEvent.click(screen.getByRole("button", { name: "결재자 추가" }));

        expect(screen.getByLabelText("2차 결재자")).toHaveValue("3");
    });

    it("결재선이 한 명이면 삭제할 수 없다", async () => {
        render(<EditApprovalModal approval={approval} closeModal={jest.fn()} documentId={1} />);

        await screen.findByLabelText("1차 결재자");
        fireEvent.click(screen.getByRole("button", { name: "1차 결재자 삭제" }));

        expect(screen.getByLabelText("1차 결재자")).toBeInTheDocument();
    });

    it("수정이 성공하면 성공 메시지를 알리고 모달을 닫은 뒤 새로고침한다", async () => {
        mockedChangeApprovalLinesAction.mockResolvedValue({ success: true, message: "결재선을 수정했습니다." });
        const closeModal = jest.fn();

        render(<EditApprovalModal approval={approval} closeModal={closeModal} documentId={1} />);

        await screen.findByLabelText("1차 결재자");
        fireEvent.click(screen.getByRole("button", { name: "수정하기" }));

        await waitFor(() => {
            expect(mockedChangeApprovalLinesAction).toHaveBeenCalledWith(1, { approverIds: [2] });
        });
        expect(toast.success).toHaveBeenCalledWith("결재선을 수정했습니다.");
        expect(closeModal).toHaveBeenCalledTimes(1);
        expect(refresh).toHaveBeenCalledTimes(1);
    });

    it("수정이 실패하면 오류 메시지를 표시하고 모달을 유지한다", async () => {
        mockedChangeApprovalLinesAction.mockResolvedValue({ success: false, message: "결재선 수정에 실패했습니다." });
        const closeModal = jest.fn();

        render(<EditApprovalModal approval={approval} closeModal={closeModal} documentId={1} />);

        await screen.findByLabelText("1차 결재자");
        fireEvent.click(screen.getByRole("button", { name: "수정하기" }));

        expect(await screen.findByText("결재선 수정에 실패했습니다.")).toHaveAttribute("role", "alert");
        expect(closeModal).not.toHaveBeenCalled();
    });

    it("구성원 조회에 실패해도 오류를 표시하지 않고 기존 결재선을 그대로 유지한다", async () => {
        mockedGetUserListAction.mockResolvedValue({ success: false, message: "구성원 조회에 실패했습니다." });

        render(<EditApprovalModal approval={approval} closeModal={jest.fn()} documentId={1} />);

        expect(await screen.findByLabelText("1차 결재자")).toHaveValue("2");
        expect(screen.queryByRole("alert")).not.toBeInTheDocument();
        expect(screen.getByRole("button", { name: "결재자 추가" })).toBeDisabled();
    });
});
