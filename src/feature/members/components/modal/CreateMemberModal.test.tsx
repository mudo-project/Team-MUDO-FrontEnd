import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { getRoleListAction } from "../../../role/actions";
import { createEmployeeAccountAction } from "../../actions";
import CreateMemberModal from "./CreateMemberModal";
import { toast } from "sonner";

const refresh = jest.fn();

jest.mock("../../../role/actions", () => ({
    getRoleListAction: jest.fn(),
}));

jest.mock("../../actions", () => ({
    createEmployeeAccountAction: jest.fn(),
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

const mockedGetRoleListAction = getRoleListAction as jest.MockedFunction<
    typeof getRoleListAction
>;
const mockedCreateEmployeeAccountAction =
    createEmployeeAccountAction as jest.MockedFunction<
        typeof createEmployeeAccountAction
    >;

const fillRequiredFields = async () => {
    await screen.findByRole("option", { name: "강사" });
    fireEvent.change(screen.getByPlaceholderText("이름을 입력해주세요"), {
        target: { value: "김민수" },
    });
    fireEvent.change(screen.getByPlaceholderText("아이디를 입력해주세요"), {
        target: { value: "kimms" },
    });
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "1" } });
};

describe("CreateMemberModal", () => {
    beforeEach(() => {
        mockedGetRoleListAction.mockResolvedValue({
            success: true,
            message: "조회했습니다.",
            data: [{ roleId: 1, name: "강사", description: null, color: null, memberCount: 0 }],
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("이름과 아이디를 입력하지 않고 저장하면 검증 메시지를 노출한다", async () => {
        render(<CreateMemberModal closeModal={jest.fn()} />);
        await screen.findByRole("option", { name: "강사" });

        fireEvent.click(screen.getByRole("button", { name: "저장" }));

        expect(await screen.findByText("이름을 입력해 주세요.")).toBeInTheDocument();
        expect(
            screen.getByText("아이디는 2자 이상 50자 이하여야 합니다."),
        ).toBeInTheDocument();
        expect(mockedCreateEmployeeAccountAction).not.toHaveBeenCalled();
    });

    it("필수 값을 입력하고 저장하면 발급된 임시 비밀번호를 노출한다", async () => {
        mockedCreateEmployeeAccountAction.mockResolvedValue({
            success: true,
            message: "직원 계정을 발급했습니다.",
            data: { userId: 1, username: "kimms", temporaryPassword: "temp1234" },
        });

        render(<CreateMemberModal closeModal={jest.fn()} />);
        await fillRequiredFields();
        fireEvent.click(screen.getByRole("button", { name: "저장" }));

        expect(await screen.findByText(/아이디: kimms/)).toBeInTheDocument();
        expect(screen.getByText(/비밀번호: temp1234/)).toBeInTheDocument();
        expect(toast.success).toHaveBeenCalledWith("직원 계정을 발급했습니다.");
    });

    it("저장이 실패하면 오류 메시지를 토스트로 노출한다", async () => {
        mockedCreateEmployeeAccountAction.mockResolvedValue({
            success: false,
            message: "이미 존재하는 아이디입니다.",
        });

        render(<CreateMemberModal closeModal={jest.fn()} />);
        await fillRequiredFields();
        fireEvent.click(screen.getByRole("button", { name: "저장" }));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("이미 존재하는 아이디입니다.");
        });
    });

    it("임시 비밀번호 발급 전에 닫기를 클릭하면 바로 닫기 콜백을 호출한다", async () => {
        const closeModal = jest.fn();
        render(<CreateMemberModal closeModal={closeModal} />);
        await screen.findByRole("option", { name: "강사" });

        fireEvent.click(screen.getByRole("button", { name: "구성원 정보 모달 닫기" }));

        expect(closeModal).toHaveBeenCalledTimes(1);
    });

    it("임시 비밀번호가 발급된 상태에서 닫기를 시도하면 확인 모달을 노출한다", async () => {
        const closeModal = jest.fn();
        mockedCreateEmployeeAccountAction.mockResolvedValue({
            success: true,
            message: "직원 계정을 발급했습니다.",
            data: { userId: 1, username: "kimms", temporaryPassword: "temp1234" },
        });

        render(<CreateMemberModal closeModal={closeModal} />);
        await fillRequiredFields();
        fireEvent.click(screen.getByRole("button", { name: "저장" }));
        await screen.findByText(/아이디: kimms/);

        fireEvent.click(screen.getByRole("button", { name: "구성원 정보 모달 닫기" }));

        expect(
            screen.getByText(/임시비밀번호는 재조회가 불가능합니다/),
        ).toBeInTheDocument();
        expect(closeModal).not.toHaveBeenCalled();

        fireEvent.click(screen.getByRole("button", { name: "확인" }));

        expect(closeModal).toHaveBeenCalledTimes(1);
        expect(refresh).toHaveBeenCalledTimes(1);
    });

    it("복사 버튼을 클릭하면 계정 정보를 클립보드에 복사한다", async () => {
        Object.assign(navigator, {
            clipboard: { writeText: jest.fn().mockResolvedValue(undefined) },
        });
        mockedCreateEmployeeAccountAction.mockResolvedValue({
            success: true,
            message: "직원 계정을 발급했습니다.",
            data: { userId: 1, username: "kimms", temporaryPassword: "temp1234" },
        });

        render(<CreateMemberModal closeModal={jest.fn()} />);
        await fillRequiredFields();
        fireEvent.click(screen.getByRole("button", { name: "저장" }));
        await screen.findByText(/아이디: kimms/);

        fireEvent.click(screen.getByRole("button", { name: "링크 복사" }));

        await waitFor(() => {
            expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
                "아이디: kimms 비밀번호: temp1234",
            );
        });
        expect(toast.success).toHaveBeenCalledWith("복사되었습니다");
    });
});
