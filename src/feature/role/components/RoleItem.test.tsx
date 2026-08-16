import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { deleteRoleAction } from "../actions";
import RoleItem from "./RoleItem";
import { toast } from "sonner";

const push = jest.fn();
const refresh = jest.fn();

jest.mock("../actions", () => ({
    deleteRoleAction: jest.fn(),
}));

jest.mock("next/navigation", () => ({
    useRouter: () => ({ push, refresh }),
}));

jest.mock("sonner", () => ({
    toast: {
        error: jest.fn(),
        success: jest.fn(),
    },
}));

jest.mock("./modal/EditRoleModal", () => {
    return function MockEditRoleModal({ closeModal }: { closeModal: () => void }) {
        return (
            <div role="dialog">
                역할 수정 모달
                <button onClick={closeModal} type="button">
                    수정 모달 닫기
                </button>
            </div>
        );
    };
});

const mockedDeleteRoleAction = deleteRoleAction as jest.MockedFunction<
    typeof deleteRoleAction
>;

const role: RoleListData = {
    roleId: 3,
    name: "조교",
    description: "보조 업무",
    color: "#2C8D50",
    memberCount: 5,
};

describe("RoleItem", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("역할 이름과 구성원 수를 표시한다", () => {
        render(<RoleItem isSelected={false} role={role} />);

        expect(screen.getByText("조교")).toBeInTheDocument();
        expect(screen.getByText("5명")).toBeInTheDocument();
    });

    it("역할 메뉴 버튼을 클릭하면 수정, 삭제 메뉴를 노출한다", () => {
        render(<RoleItem isSelected={false} role={role} />);

        fireEvent.click(screen.getByRole("button", { name: "조교 역할 메뉴" }));

        expect(screen.getByRole("button", { name: "수정" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "삭제" })).toBeInTheDocument();
    });

    it("수정을 클릭하면 메뉴를 닫고 수정 모달을 연다", () => {
        render(<RoleItem isSelected={false} role={role} />);

        fireEvent.click(screen.getByRole("button", { name: "조교 역할 메뉴" }));
        fireEvent.click(screen.getByRole("button", { name: "수정" }));

        expect(screen.getByRole("dialog")).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "삭제" })).not.toBeInTheDocument();
    });

    it("삭제를 클릭하면 메뉴를 닫고 삭제 확인 모달을 연다", () => {
        render(<RoleItem isSelected={false} role={role} />);

        fireEvent.click(screen.getByRole("button", { name: "조교 역할 메뉴" }));
        fireEvent.click(screen.getByRole("button", { name: "삭제" }));

        expect(screen.getByText("삭제하시겠습니까?")).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "수정" })).not.toBeInTheDocument();
    });

    it("선택된 역할을 삭제하면 성공 토스트를 노출하고 역할 목록 화면으로 이동한다", async () => {
        mockedDeleteRoleAction.mockResolvedValue({
            success: true,
            message: "역할을 삭제했습니다.",
        });

        render(<RoleItem isSelected role={role} />);

        fireEvent.click(screen.getByRole("button", { name: "조교 역할 메뉴" }));
        fireEvent.click(screen.getByRole("button", { name: "삭제" }));
        fireEvent.click(screen.getByRole("button", { name: "확인" }));

        await waitFor(() => {
            expect(mockedDeleteRoleAction).toHaveBeenCalledWith(3);
        });
        expect(toast.success).toHaveBeenCalledWith("역할을 삭제했습니다.");
        expect(push).toHaveBeenCalledWith("/role");
        expect(refresh).not.toHaveBeenCalled();
    });

    it("선택되지 않은 역할을 삭제하면 현재 화면을 새로고침한다", async () => {
        mockedDeleteRoleAction.mockResolvedValue({
            success: true,
            message: "역할을 삭제했습니다.",
        });

        render(<RoleItem isSelected={false} role={role} />);

        fireEvent.click(screen.getByRole("button", { name: "조교 역할 메뉴" }));
        fireEvent.click(screen.getByRole("button", { name: "삭제" }));
        fireEvent.click(screen.getByRole("button", { name: "확인" }));

        await waitFor(() => {
            expect(refresh).toHaveBeenCalledTimes(1);
        });
        expect(push).not.toHaveBeenCalled();
    });

    it("삭제가 실패하면 오류 토스트를 노출한다", async () => {
        mockedDeleteRoleAction.mockResolvedValue({
            success: false,
            message: "역할 삭제에 실패했습니다.",
        });

        render(<RoleItem isSelected={false} role={role} />);

        fireEvent.click(screen.getByRole("button", { name: "조교 역할 메뉴" }));
        fireEvent.click(screen.getByRole("button", { name: "삭제" }));
        fireEvent.click(screen.getByRole("button", { name: "확인" }));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("역할 삭제에 실패했습니다.");
        });
        expect(push).not.toHaveBeenCalled();
        expect(refresh).not.toHaveBeenCalled();
    });
});
