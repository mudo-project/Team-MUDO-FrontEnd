import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { changeMyPasswordAction } from "../actions";
import MyPassword from "./MyPassword";

const mockRefresh = jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: () => ({ push: jest.fn(), refresh: mockRefresh }),
}));

jest.mock("../actions", () => ({
    changeMyPasswordAction: jest.fn(),
}));

jest.mock("sonner", () => ({
    toast: { success: jest.fn(), error: jest.fn() },
}));

const mockedChangeMyPasswordAction = changeMyPasswordAction as jest.MockedFunction<
    typeof changeMyPasswordAction
>;

const fillForm = (values: {
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
}) => {
    if (values.currentPassword !== undefined) {
        fireEvent.change(screen.getByPlaceholderText("현재 비밀번호를 입력해주세요"), {
            target: { value: values.currentPassword },
        });
    }
    if (values.newPassword !== undefined) {
        fireEvent.change(screen.getByPlaceholderText("새 비밀번호를 입력해주세요"), {
            target: { value: values.newPassword },
        });
    }
    if (values.confirmPassword !== undefined) {
        fireEvent.change(screen.getByPlaceholderText("새 비밀번호를 다시 입력해주세요"), {
            target: { value: values.confirmPassword },
        });
    }
};

describe("MyPassword", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("비밀번호 입력 항목을 표시한다", () => {
        render(<MyPassword />);

        expect(screen.getByPlaceholderText("현재 비밀번호를 입력해주세요")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("새 비밀번호를 입력해주세요")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("새 비밀번호를 다시 입력해주세요")).toBeInTheDocument();
    });

    it("현재 비밀번호를 입력하지 않으면 에러 메시지를 노출하고 변경하지 않는다", async () => {
        render(<MyPassword />);

        fillForm({ newPassword: "newpass1234", confirmPassword: "newpass1234" });
        fireEvent.click(screen.getByRole("button", { name: "저장" }));

        expect(await screen.findByText("현재 비밀번호를 입력해주세요.")).toBeInTheDocument();
        expect(mockedChangeMyPasswordAction).not.toHaveBeenCalled();
    });

    it("새 비밀번호가 8자 미만이면 에러 메시지를 노출하고 변경하지 않는다", async () => {
        render(<MyPassword />);

        fillForm({ currentPassword: "current1234", newPassword: "short1", confirmPassword: "short1" });
        fireEvent.click(screen.getByRole("button", { name: "저장" }));

        expect(await screen.findByText("새 비밀번호는 8자 이상 입력해주세요.")).toBeInTheDocument();
        expect(mockedChangeMyPasswordAction).not.toHaveBeenCalled();
    });

    it("현재 비밀번호와 새 비밀번호가 같으면 에러 메시지를 노출하고 변경하지 않는다", async () => {
        render(<MyPassword />);

        fillForm({
            currentPassword: "samepass1234",
            newPassword: "samepass1234",
            confirmPassword: "samepass1234",
        });
        fireEvent.click(screen.getByRole("button", { name: "저장" }));

        expect(
            await screen.findByText("현재 비밀번호와 다른 비밀번호를 입력해주세요."),
        ).toBeInTheDocument();
        expect(mockedChangeMyPasswordAction).not.toHaveBeenCalled();
    });

    it("새 비밀번호와 확인이 일치하지 않으면 에러 메시지를 노출하고 변경하지 않는다", async () => {
        render(<MyPassword />);

        fillForm({
            currentPassword: "current1234",
            newPassword: "newpass1234",
            confirmPassword: "different1234",
        });
        fireEvent.click(screen.getByRole("button", { name: "저장" }));

        expect(await screen.findByText("새 비밀번호가 일치하지 않습니다.")).toBeInTheDocument();
        expect(mockedChangeMyPasswordAction).not.toHaveBeenCalled();
    });

    it("모든 값이 올바르면 비밀번호 변경 액션을 호출하고 성공 시 새로고침한다", async () => {
        mockedChangeMyPasswordAction.mockResolvedValue({
            success: true,
            message: "비밀번호를 변경했습니다.",
        });

        render(<MyPassword />);

        fillForm({
            currentPassword: "current1234",
            newPassword: "newpass1234",
            confirmPassword: "newpass1234",
        });
        fireEvent.click(screen.getByRole("button", { name: "저장" }));

        await waitFor(() => {
            expect(mockedChangeMyPasswordAction).toHaveBeenCalledWith({
                currentPassword: "current1234",
                newPassword: "newpass1234",
            });
        });
        expect(toast.success).toHaveBeenCalledWith("비밀번호를 변경했습니다.");
        expect(mockRefresh).toHaveBeenCalled();
    });

    it("변경에 실패하면 실패 토스트를 노출한다", async () => {
        mockedChangeMyPasswordAction.mockResolvedValue({
            success: false,
            message: "비밀번호 변경에 실패했습니다.",
        });

        render(<MyPassword />);

        fillForm({
            currentPassword: "current1234",
            newPassword: "newpass1234",
            confirmPassword: "newpass1234",
        });
        fireEvent.click(screen.getByRole("button", { name: "저장" }));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("비밀번호 변경에 실패했습니다.");
        });
        expect(mockRefresh).not.toHaveBeenCalled();
    });

    it("액션 호출이 예외를 던지면 기본 실패 메시지를 노출한다", async () => {
        mockedChangeMyPasswordAction.mockRejectedValue(new Error("네트워크 오류"));

        render(<MyPassword />);

        fillForm({
            currentPassword: "current1234",
            newPassword: "newpass1234",
            confirmPassword: "newpass1234",
        });
        fireEvent.click(screen.getByRole("button", { name: "저장" }));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("비밀번호 변경에 실패했습니다.");
        });
    });
});
