import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { getRoleListAction } from "@/feature/role/actions";
import {
    changeMemberStatusAction,
    updateMemberAction,
} from "@/feature/members/actions";
import { MemberListData } from "../../type";
import ViewMembersModal from "./ViewMembersModal";
import { toast } from "sonner";

const refresh = jest.fn();

jest.mock("@/feature/role/actions", () => ({
    getRoleListAction: jest.fn(),
}));

jest.mock("@/feature/members/actions", () => ({
    changeMemberStatusAction: jest.fn(),
    updateMemberAction: jest.fn(),
}));

jest.mock("next/navigation", () => ({
    useRouter: () => ({ refresh }),
}));

jest.mock("sonner", () => ({
    toast: {
        error: jest.fn(),
        success: jest.fn(),
    },
}));

jest.mock("date-fns", () => ({
    format: jest.fn(() => "2026-01-10"),
}));

const mockedGetRoleListAction = getRoleListAction as jest.MockedFunction<
    typeof getRoleListAction
>;
const mockedUpdateMemberAction = updateMemberAction as jest.MockedFunction<
    typeof updateMemberAction
>;
const mockedChangeMemberStatusAction =
    changeMemberStatusAction as jest.MockedFunction<typeof changeMemberStatusAction>;

const member: MemberListData = {
    userId: 5,
    name: "김민수",
    email: "kim@example.com",
    phone: "010-1234-5678",
    roleId: 2,
    roleName: "강사",
    joinedAt: "2026-01-10T00:00:00.000Z",
    status: "ACTIVE",
    attendanceStatus: "PRESENT",
};

describe("ViewMembersModal", () => {
    beforeEach(() => {
        mockedGetRoleListAction.mockResolvedValue({
            success: true,
            message: "조회했습니다.",
            data: [
                { roleId: 2, name: "강사", description: null, color: null, memberCount: 0 },
                { roleId: 3, name: "조교", description: null, color: null, memberCount: 0 },
            ],
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("구성원 정보를 입력 필드에 표시한다", async () => {
        render(<ViewMembersModal closeModal={jest.fn()} member={member} />);

        expect(await screen.findByDisplayValue("김민수")).toBeInTheDocument();
        expect(screen.getByDisplayValue("kim@example.com")).toBeInTheDocument();
        expect(screen.getByDisplayValue("010-1234-5678")).toBeInTheDocument();
        expect(screen.getByDisplayValue("2026-01-10")).toBeInTheDocument();
        expect(screen.getByRole("heading", { name: "김민수" })).toBeInTheDocument();
    });

    it("이름을 수정하고 저장하면 변경된 필드만 담아 수정 액션을 호출하고, 성공 시 목록을 새로고침한 후 모달을 닫는다", async () => {
        const closeModal = jest.fn();
        mockedUpdateMemberAction.mockResolvedValue({
            success: true,
            message: "구성원 정보를 수정했습니다.",
        });

        render(<ViewMembersModal closeModal={closeModal} member={member} />);
        await screen.findByDisplayValue("김민수");

        fireEvent.change(screen.getByDisplayValue("김민수"), {
            target: { value: "이민수" },
        });
        fireEvent.click(screen.getByRole("button", { name: "저장" }));

        await waitFor(() => {
            expect(mockedUpdateMemberAction).toHaveBeenCalledWith(5, { name: "이민수" });
        });
        expect(toast.success).toHaveBeenCalledWith("구성원 정보를 수정했습니다.");
        expect(refresh).toHaveBeenCalledTimes(1);
        expect(closeModal).toHaveBeenCalledTimes(1);
    });

    it("수정이 실패하면 오류 토스트를 노출하고 모달을 유지한다", async () => {
        const closeModal = jest.fn();
        mockedUpdateMemberAction.mockResolvedValue({
            success: false,
            message: "구성원 정보 수정에 실패했습니다.",
        });

        render(<ViewMembersModal closeModal={closeModal} member={member} />);
        await screen.findByDisplayValue("김민수");

        fireEvent.change(screen.getByDisplayValue("김민수"), {
            target: { value: "이민수" },
        });
        fireEvent.click(screen.getByRole("button", { name: "저장" }));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("구성원 정보 수정에 실패했습니다.");
        });
        expect(closeModal).not.toHaveBeenCalled();
    });

    it("퇴사 처리 버튼을 클릭하고 확인하면 재직 상태 변경 액션을 호출한다", async () => {
        mockedChangeMemberStatusAction.mockResolvedValue({
            success: true,
            message: "구성원 재직 상태를 변경했습니다.",
        });

        render(<ViewMembersModal closeModal={jest.fn()} member={member} />);
        await screen.findByDisplayValue("김민수");

        fireEvent.click(screen.getByRole("button", { name: "퇴사 처리" }));
        expect(screen.getByText(/퇴사 처리 하시겠습니까/)).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: "확인" }));

        await waitFor(() => {
            expect(mockedChangeMemberStatusAction).toHaveBeenCalledWith(5, "RESIGNED");
        });
        expect(toast.success).toHaveBeenCalledWith("구성원 재직 상태를 변경했습니다.");
    });

    it("변경 사항 없이 닫기를 클릭하면 바로 모달을 닫는다", async () => {
        const closeModal = jest.fn();
        render(<ViewMembersModal closeModal={closeModal} member={member} />);
        await screen.findByDisplayValue("김민수");

        fireEvent.click(screen.getByRole("button", { name: "구성원 정보 모달 닫기" }));

        expect(closeModal).toHaveBeenCalledTimes(1);
    });
});
