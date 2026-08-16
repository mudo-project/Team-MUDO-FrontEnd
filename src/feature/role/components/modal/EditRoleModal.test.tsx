import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { changeRoleAction } from "../../actions";
import EditRoleModal from "./EditRoleModal";
import { toast } from "sonner";

const refresh = jest.fn();

jest.mock("../../actions", () => ({
    changeRoleAction: jest.fn(),
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

const mockedChangeRoleAction = changeRoleAction as jest.MockedFunction<
    typeof changeRoleAction
>;

const role: RoleListData = {
    roleId: 3,
    name: "조교",
    description: "보조 업무",
    color: "#2C8D50",
    memberCount: 5,
};

describe("EditRoleModal", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("기존 역할 정보를 입력값 기본값으로 표시한다", () => {
        const { container } = render(<EditRoleModal closeModal={jest.fn()} role={role} />);

        expect(screen.getByDisplayValue("조교")).toBeInTheDocument();
        expect(screen.getByDisplayValue("보조 업무")).toBeInTheDocument();
        // 색상 스와치는 aria-label이 감싸는 <label>에 있어 접근성 이름이 라디오
        // input에 연결되지 않는다. 마크업의 고유 id로 직접 조회한다.
        expect(container.querySelector("#edit-role-color-3-0")).toBeChecked();
    });

    it("이름을 수정하고 저장하면 역할 수정 액션을 호출하고 성공 시 새로고침한 후 모달을 닫는다", async () => {
        const closeModal = jest.fn();
        mockedChangeRoleAction.mockResolvedValue({
            success: true,
            message: "역할을 수정했습니다.",
        });

        render(<EditRoleModal closeModal={closeModal} role={role} />);
        fireEvent.change(screen.getByDisplayValue("조교"), {
            target: { value: "재무행정" },
        });
        fireEvent.click(screen.getByRole("button", { name: "수정" }));

        // effect가 반영하는 closeModal 호출을 기다린다. mockedChangeRoleAction 호출
        // 자체는 제출과 동시에 동기적으로 일어나므로, 이를 기다리는 것만으로는
        // 이후 상태 반영(useEffect)이 끝났다고 보장할 수 없다.
        await waitFor(() => {
            expect(closeModal).toHaveBeenCalledTimes(1);
        });
        expect(mockedChangeRoleAction).toHaveBeenCalledWith(
            3,
            expect.anything(),
            expect.any(FormData),
        );
        expect(toast.success).toHaveBeenCalledWith("역할을 수정했습니다.");
        expect(refresh).toHaveBeenCalledTimes(1);
    });

    it("수정이 실패하면 오류 메시지를 노출하고 모달을 유지한다", async () => {
        const closeModal = jest.fn();
        mockedChangeRoleAction.mockResolvedValue({
            success: false,
            message: "역할 수정에 실패했습니다.",
        });

        render(<EditRoleModal closeModal={closeModal} role={role} />);
        fireEvent.click(screen.getByRole("button", { name: "수정" }));

        expect(await screen.findByText("역할 수정에 실패했습니다.")).toHaveAttribute(
            "role",
            "alert",
        );
        expect(toast.error).toHaveBeenCalledWith("역할 수정에 실패했습니다.");
        expect(closeModal).not.toHaveBeenCalled();
    });

    it("닫기 버튼을 클릭하면 닫기 콜백을 호출한다", () => {
        const closeModal = jest.fn();
        render(<EditRoleModal closeModal={closeModal} role={role} />);

        fireEvent.click(screen.getByRole("button", { name: "역할 수정 모달 닫기" }));

        expect(closeModal).toHaveBeenCalledTimes(1);
    });
});
