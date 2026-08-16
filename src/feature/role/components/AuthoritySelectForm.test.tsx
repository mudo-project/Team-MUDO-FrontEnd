import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { changeRolePermissionsAction } from "../actions";
import AuthoritySelectForm from "./AuthoritySelectForm";
import { toast } from "sonner";

const refresh = jest.fn();

jest.mock("../actions", () => ({
    changeRolePermissionsAction: jest.fn(),
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

const mockedChangeRolePermissionsAction =
    changeRolePermissionsAction as jest.MockedFunction<
        typeof changeRolePermissionsAction
    >;

const role: RoleDetailData = {
    roleId: 1,
    name: "강사",
    description: "수업을 담당하는 역할",
    color: "#2C8D50",
    memberCount: 3,
    permissionCodes: ["ACCOUNT:CREATE", "ACCOUNT:DELETE"],
};

describe("AuthoritySelectForm", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("역할 이름과 설명, 구성원/권한 수를 표시한다", () => {
        render(
            <AuthoritySelectForm role={role}>
                <p>권한 목록</p>
            </AuthoritySelectForm>,
        );

        expect(screen.getByRole("heading", { name: "강사" })).toBeInTheDocument();
        expect(screen.getByText("수업을 담당하는 역할")).toBeInTheDocument();
        expect(screen.getByText("구성원 3명")).toBeInTheDocument();
        expect(screen.getByText("권한 2개 활성")).toBeInTheDocument();
    });

    it("역할 설명이 없으면 설명 영역을 노출하지 않는다", () => {
        render(
            <AuthoritySelectForm role={{ ...role, description: null }}>
                <p>권한 목록</p>
            </AuthoritySelectForm>,
        );

        expect(screen.queryByText("수업을 담당하는 역할")).not.toBeInTheDocument();
    });

    it("전달받은 자식 요소를 노출한다", () => {
        render(
            <AuthoritySelectForm role={role}>
                <p>권한 목록</p>
            </AuthoritySelectForm>,
        );

        expect(screen.getByText("권한 목록")).toBeInTheDocument();
    });

    it("저장하기를 클릭하면 권한 변경 액션을 호출하고 성공하면 성공 토스트를 노출한 후 새로고침한다", async () => {
        mockedChangeRolePermissionsAction.mockResolvedValue({
            success: true,
            message: "역할 권한을 저장했습니다.",
        });

        render(
            <AuthoritySelectForm role={role}>
                <p>권한 목록</p>
            </AuthoritySelectForm>,
        );

        fireEvent.click(screen.getByRole("button", { name: "저장하기" }));

        // action 호출 자체는 제출과 동시에 동기적으로 일어나므로, 이를 기다리는 것만으로는
        // 응답 반영(useEffect) 완료를 보장할 수 없다. refresh 호출을 기준으로 기다린다.
        await waitFor(() => {
            expect(refresh).toHaveBeenCalledTimes(1);
        });
        expect(mockedChangeRolePermissionsAction).toHaveBeenCalledWith(
            role.roleId,
            expect.anything(),
            expect.any(FormData),
        );
        expect(toast.success).toHaveBeenCalledWith("역할 권한을 저장했습니다.");
    });

    it("저장이 실패하면 오류 토스트와 안내 문구를 노출한다", async () => {
        mockedChangeRolePermissionsAction.mockResolvedValue({
            success: false,
            message: "역할 권한 조립에 실패했습니다.",
        });

        render(
            <AuthoritySelectForm role={role}>
                <p>권한 목록</p>
            </AuthoritySelectForm>,
        );

        fireEvent.click(screen.getByRole("button", { name: "저장하기" }));

        expect(
            await screen.findByText("역할 권한 조립에 실패했습니다."),
        ).toHaveAttribute("role", "alert");
        expect(toast.error).toHaveBeenCalledWith("역할 권한 조립에 실패했습니다.");
        expect(refresh).not.toHaveBeenCalled();
    });

    it("저장 요청 중에는 버튼 문구가 변경되고 비활성화된다", async () => {
        let resolveAction: (
            result: Awaited<ReturnType<typeof changeRolePermissionsAction>>,
        ) => void = () => undefined;
        mockedChangeRolePermissionsAction.mockReturnValue(
            new Promise((resolve) => {
                resolveAction = resolve;
            }),
        );

        render(
            <AuthoritySelectForm role={role}>
                <p>권한 목록</p>
            </AuthoritySelectForm>,
        );

        fireEvent.click(screen.getByRole("button", { name: "저장하기" }));

        const pendingButton = await screen.findByRole("button", { name: "저장 중..." });
        expect(pendingButton).toBeDisabled();

        await act(async () => {
            resolveAction({ success: true, message: "역할 권한을 저장했습니다." });
        });
    });
});
