import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { format } from "date-fns";
import { toast } from "sonner";
import { MyProfileData } from "../type";
import { updateMyProfileAction } from "../actions";
import MyInfo from "./MyInfo";

const mockRefresh = jest.fn();
const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: () => ({ push: mockPush, refresh: mockRefresh }),
}));

jest.mock("../actions", () => ({
    getMyProfileAction: jest.fn(),
    updateMyProfileAction: jest.fn(),
}));

jest.mock("sonner", () => ({
    toast: { success: jest.fn(), error: jest.fn() },
}));

const mockedUpdateMyProfileAction = updateMyProfileAction as jest.MockedFunction<
    typeof updateMyProfileAction
>;

const profile: MyProfileData = {
    userId: 1,
    name: "김강사",
    email: "teacher@example.com",
    phone: "010-1111-2222",
    roleId: 1,
    roleName: "강사",
    joinedAt: "2026-01-15",
    status: "ACTIVE",
};

describe("MyInfo", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("프로필 정보를 표시한다", () => {
        render(<MyInfo profile={profile} />);

        expect(screen.getByText("김강사")).toBeInTheDocument();
        expect(screen.getByText("강사")).toBeInTheDocument();
        expect(screen.getByText(format(profile.joinedAt, "yyyy-MM-dd"))).toBeInTheDocument();
        expect(screen.getByPlaceholderText("전화번호를 입력해주세요")).toHaveValue("010-1111-2222");
        expect(screen.getByPlaceholderText("이메일을 입력해주세요")).toHaveValue("teacher@example.com");
    });

    it("역할이 없으면 기본 문구를 표시한다", () => {
        render(<MyInfo profile={{ ...profile, roleName: null }} />);

        expect(screen.getByText("역할 없음")).toBeInTheDocument();
    });

    it("이메일 형식이 올바르지 않으면 에러 메시지를 노출하고 저장하지 않는다", async () => {
        render(<MyInfo profile={profile} />);

        fireEvent.change(screen.getByPlaceholderText("이메일을 입력해주세요"), {
            target: { value: "invalid-email" },
        });
        fireEvent.click(screen.getByRole("button", { name: "저장" }));

        expect(await screen.findByText("올바른 이메일 형식이 아닙니다.")).toBeInTheDocument();
        expect(mockedUpdateMyProfileAction).not.toHaveBeenCalled();
    });

    it("전화번호 형식이 올바르지 않으면 에러 메시지를 노출하고 저장하지 않는다", async () => {
        render(<MyInfo profile={profile} />);

        fireEvent.change(screen.getByPlaceholderText("전화번호를 입력해주세요"), {
            target: { value: "01011112222" },
        });
        fireEvent.click(screen.getByRole("button", { name: "저장" }));

        expect(await screen.findByText("전화번호 형식이 올바르지 않습니다.")).toBeInTheDocument();
        expect(mockedUpdateMyProfileAction).not.toHaveBeenCalled();
    });

    it("저장에 성공하면 성공 토스트를 노출하고 새로고침한다", async () => {
        mockedUpdateMyProfileAction.mockResolvedValue({
            success: true,
            message: "내 정보를 수정했습니다.",
        });

        render(<MyInfo profile={profile} />);

        fireEvent.change(screen.getByPlaceholderText("전화번호를 입력해주세요"), {
            target: { value: "010-9999-8888" },
        });
        fireEvent.click(screen.getByRole("button", { name: "저장" }));

        await waitFor(() => {
            expect(mockedUpdateMyProfileAction).toHaveBeenCalledWith({
                phone: "010-9999-8888",
                email: "teacher@example.com",
            });
        });
        expect(toast.success).toHaveBeenCalledWith("내 정보를 수정했습니다.");
        expect(mockRefresh).toHaveBeenCalled();
    });

    it("저장에 실패하면 실패 토스트를 노출한다", async () => {
        mockedUpdateMyProfileAction.mockResolvedValue({
            success: false,
            message: "내 정보 수정에 실패했습니다.",
        });

        render(<MyInfo profile={profile} />);

        fireEvent.click(screen.getByRole("button", { name: "저장" }));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("내 정보 수정에 실패했습니다.");
        });
        expect(mockRefresh).not.toHaveBeenCalled();
    });

    it("액션 호출이 예외를 던지면 기본 실패 메시지를 노출한다", async () => {
        mockedUpdateMyProfileAction.mockRejectedValue(new Error("네트워크 오류"));

        render(<MyInfo profile={profile} />);

        fireEvent.click(screen.getByRole("button", { name: "저장" }));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("내 정보 수정에 실패했습니다.");
        });
    });
});
