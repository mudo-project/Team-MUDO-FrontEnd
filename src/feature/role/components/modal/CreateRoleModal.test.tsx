import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createRoleAction } from "../../actions";
import CreateRoleModal from "./CreateRoleModal";
import { toast } from "sonner";

const push = jest.fn();
const refresh = jest.fn();

jest.mock("../../actions", () => ({
    createRoleAction: jest.fn(),
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

const mockedCreateRoleAction = createRoleAction as jest.MockedFunction<
    typeof createRoleAction
>;

const submitForm = (name: string) => {
    fireEvent.change(screen.getByLabelText("역할 이름"), { target: { value: name } });
    fireEvent.click(screen.getByRole("button", { name: "생성" }));
};

describe("CreateRoleModal", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("이름을 입력하고 생성하면 생성된 역할 화면으로 이동하고 모달을 닫는다", async () => {
        const closeModal = jest.fn();
        mockedCreateRoleAction.mockResolvedValue({
            success: true,
            message: "역할을 생성했습니다.",
            data: { roleId: 9 },
        });

        render(<CreateRoleModal closeModal={closeModal} />);
        submitForm("조교");

        await waitFor(() => {
            expect(closeModal).toHaveBeenCalledTimes(1);
        });
        expect(push).toHaveBeenCalledWith("/role?roleId=9");
        expect(toast.success).toHaveBeenCalledWith("역할을 생성했습니다.");
    });

    it("생성된 역할 번호가 없으면 화면을 새로고침한다", async () => {
        const closeModal = jest.fn();
        mockedCreateRoleAction.mockResolvedValue({
            success: true,
            message: "역할을 생성했습니다.",
        });

        render(<CreateRoleModal closeModal={closeModal} />);
        submitForm("조교");

        await waitFor(() => {
            expect(refresh).toHaveBeenCalledTimes(1);
        });
        expect(push).not.toHaveBeenCalled();
    });

    it("생성이 실패하면 오류 메시지를 노출한다", async () => {
        const closeModal = jest.fn();
        mockedCreateRoleAction.mockResolvedValue({
            success: false,
            message: "역할 이름은 1자 이상 50자 이하로 입력해주세요.",
        });

        render(<CreateRoleModal closeModal={closeModal} />);
        submitForm("조교");

        expect(
            await screen.findByText("역할 이름은 1자 이상 50자 이하로 입력해주세요."),
        ).toHaveAttribute("role", "alert");
        expect(toast.error).toHaveBeenCalledWith(
            "역할 이름은 1자 이상 50자 이하로 입력해주세요.",
        );
        expect(closeModal).not.toHaveBeenCalled();
    });

    it("닫기 버튼을 클릭하면 닫기 콜백을 호출한다", () => {
        const closeModal = jest.fn();
        render(<CreateRoleModal closeModal={closeModal} />);

        fireEvent.click(screen.getByRole("button", { name: "새 역할 만들기 모달 닫기" }));

        expect(closeModal).toHaveBeenCalledTimes(1);
    });

    it("색상 스와치를 선택하면 선택 상태가 변경된다", () => {
        const { container } = render(<CreateRoleModal closeModal={jest.fn()} />);

        // 색상 스와치는 aria-label이 감싸는 <label>에 있어 접근성 이름이 라디오
        // input에 연결되지 않는다. 마크업의 고유 id로 직접 조회한다.
        const secondSwatch = container.querySelector<HTMLInputElement>("#role-color-1")!;
        const firstSwatch = container.querySelector<HTMLInputElement>("#role-color-0")!;

        fireEvent.click(secondSwatch);

        expect(secondSwatch).toBeChecked();
        expect(firstSwatch).not.toBeChecked();
    });
});
