import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { setupPasswordAction } from "../actions";
import PasswordForm from "./PasswordForm";
import { toast } from "sonner";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: () => ({ push: mockPush }),
}));

jest.mock("../actions", () => ({
    setupPasswordAction: jest.fn(),
}));

jest.mock("sonner", () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

const mockedSetupPasswordAction = setupPasswordAction as jest.MockedFunction<
    typeof setupPasswordAction
>;

const submitForm = () => {
    fireEvent.submit(
        screen.getByRole("button", { name: "저장" }).closest("form")!,
    );
};

const fillValidForm = () => {
    fireEvent.change(screen.getByLabelText("이메일"), {
        target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("전화번호"), {
        target: { value: "010-1234-5678" },
    });
    fireEvent.change(screen.getByLabelText("비밀번호"), {
        target: { value: "password1234" },
    });
    fireEvent.change(screen.getByLabelText("비밀번호 확인"), {
        target: { value: "password1234" },
    });
};

describe("PasswordForm", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("값을 입력하지 않고 제출하면 이메일 형식 에러 메시지를 노출한다", async () => {
        render(<PasswordForm />);

        submitForm();

        expect(
            await screen.findByText("올바른 이메일 형식이 아닙니다."),
        ).toBeInTheDocument();
        expect(mockedSetupPasswordAction).not.toHaveBeenCalled();
    });

    it("비밀번호와 비밀번호 확인이 일치하지 않으면 에러 메시지를 노출한다", async () => {
        render(<PasswordForm />);

        fireEvent.change(screen.getByLabelText("이메일"), {
            target: { value: "test@example.com" },
        });
        fireEvent.change(screen.getByLabelText("전화번호"), {
            target: { value: "010-1234-5678" },
        });
        fireEvent.change(screen.getByLabelText("비밀번호"), {
            target: { value: "password1234" },
        });
        fireEvent.change(screen.getByLabelText("비밀번호 확인"), {
            target: { value: "differentPassword1" },
        });

        submitForm();

        expect(
            await screen.findByText("비밀번호가 일치하지 않습니다."),
        ).toBeInTheDocument();
        expect(mockedSetupPasswordAction).not.toHaveBeenCalled();
    });

    it("입력값이 유효하면 setupPasswordAction을 호출하고 성공 시 로그인 페이지로 이동한다", async () => {
        mockedSetupPasswordAction.mockResolvedValue({
            success: true,
            message: "비밀번호 설정이 완료되었습니다.",
        });
        render(<PasswordForm />);

        fillValidForm();
        submitForm();

        await waitFor(() => {
            expect(mockedSetupPasswordAction).toHaveBeenCalledWith({
                email: "test@example.com",
                phone: "010-1234-5678",
                newPassword: "password1234",
            });
        });
        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith("비밀번호 설정이 완료되었습니다.");
        });
        expect(mockPush).toHaveBeenCalledWith("/auth");
    });

    it("setupPasswordAction이 실패하면 에러 토스트를 표시하고 이동하지 않는다", async () => {
        mockedSetupPasswordAction.mockResolvedValue({
            success: false,
            message: "최초 비밀번호 설정에 실패했습니다.",
        });
        render(<PasswordForm />);

        fillValidForm();
        submitForm();

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("최초 비밀번호 설정에 실패했습니다.");
        });
        expect(mockPush).not.toHaveBeenCalled();
    });
});
