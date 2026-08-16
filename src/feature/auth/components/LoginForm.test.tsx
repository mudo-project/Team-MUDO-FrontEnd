import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { loginAction } from "../actions";
import { useUserStore } from "../../../store/useUserStore";
import { decodeJWT } from "../../../lib/decode";
import LoginForm from "./LoginForm";
import { toast } from "sonner";

const push = jest.fn();

jest.mock("../actions", () => ({
    loginAction: jest.fn(),
}));

jest.mock("../../../lib/decode", () => ({
    decodeJWT: jest.fn(),
}));

jest.mock("next/navigation", () => ({
    useRouter: () => ({ push }),
}));

jest.mock("sonner", () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

const mockedLoginAction = loginAction as jest.Mock;
const mockedDecodeJWT = decodeJWT as jest.Mock;

const fillLoginForm = (username: string, password: string) => {
    fireEvent.change(screen.getByPlaceholderText("아이디를 입력하세요"), {
        target: { value: username },
    });
    fireEvent.change(screen.getByPlaceholderText("비밀번호를 입력하세요"), {
        target: { value: password },
    });
};

describe("LoginForm", () => {
    beforeEach(() => {
        mockedDecodeJWT.mockResolvedValue({
            sub: "1",
            username: "kim",
            roleId: 1,
            accountType: "MEMBER",
            adminScope: "null",
            mustChangePw: false,
            iat: 0,
            exp: 0,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
        act(() => {
            useUserStore.getState().clearUser();
            useUserStore.getState().clearPermissions();
        });
    });

    it("아이디, 비밀번호 입력창과 로그인 버튼을 표시한다", () => {
        render(<LoginForm />);

        expect(screen.getByPlaceholderText("아이디를 입력하세요")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("비밀번호를 입력하세요")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "로그인" })).toBeInTheDocument();
    });

    it("비밀번호 보기 버튼을 클릭하면 비밀번호 입력 타입이 전환된다", () => {
        render(<LoginForm />);
        const passwordInput = document.querySelector('input[name="password"]') as HTMLInputElement;

        expect(passwordInput).toHaveAttribute("type", "password");

        fireEvent.click(screen.getByRole("button", { name: "비밀번호 보기" }));

        expect(passwordInput).toHaveAttribute("type", "text");
    });

    it("아이디와 비밀번호를 입력하고 제출하면 입력값을 담아 로그인 액션을 호출한다", async () => {
        mockedLoginAction.mockResolvedValue({ success: false, message: "" });
        render(<LoginForm />);

        fillLoginForm("kim", "pw1234");
        fireEvent.submit(screen.getByRole("button", { name: "로그인" }).closest("form")!);

        await waitFor(() => expect(mockedLoginAction).toHaveBeenCalledTimes(1));
        const submittedFormData = mockedLoginAction.mock.calls[0][1] as FormData;
        expect(submittedFormData.get("username")).toBe("kim");
        expect(submittedFormData.get("password")).toBe("pw1234");
    });

    it("로그인에 성공하고 비밀번호를 변경할 필요가 없으면 역할 선택 화면으로 이동한다", async () => {
        mockedLoginAction.mockResolvedValue({
            success: true,
            message: "로그인에 성공했습니다.",
            data: {
                accessToken: "token",
                mustChangePw: false,
                permissions: ["APPROVAL:TEMPLATE_MANAGE"],
            },
        });
        render(<LoginForm />);

        fillLoginForm("kim", "pw1234");
        fireEvent.submit(screen.getByRole("button", { name: "로그인" }).closest("form")!);

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith("로그인에 성공했습니다.");
        });
        expect(push).toHaveBeenCalledWith("/role");
        expect(useUserStore.getState().permissions).toEqual(["APPROVAL:TEMPLATE_MANAGE"]);
    });

    it("비밀번호를 변경해야 하는 계정으로 로그인하면 비밀번호 설정 화면으로 이동한다", async () => {
        mockedLoginAction.mockResolvedValue({
            success: true,
            message: "로그인에 성공했습니다.",
            data: { accessToken: "token", mustChangePw: true, permissions: [] },
        });
        render(<LoginForm />);

        fillLoginForm("kim", "pw1234");
        fireEvent.submit(screen.getByRole("button", { name: "로그인" }).closest("form")!);

        await waitFor(() => {
            expect(push).toHaveBeenCalledWith("/password-setup");
        });
    });

    it("로그인에 실패하면 오류 메시지를 토스트로 알린다", async () => {
        mockedLoginAction.mockResolvedValue({
            success: false,
            message: "아이디 또는 비밀번호가 일치하지 않습니다.",
        });
        render(<LoginForm />);

        fillLoginForm("kim", "wrong");
        fireEvent.submit(screen.getByRole("button", { name: "로그인" }).closest("form")!);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("아이디 또는 비밀번호가 일치하지 않습니다.");
        });
        expect(push).not.toHaveBeenCalled();
    });
});
