import { fireEvent, render, screen } from "@testing-library/react";
import AuthoritySelectGroup from "./AuthoritySelectGroup";

const role: RoleDetailData = {
    roleId: 1,
    name: "강사",
    description: null,
    color: "#2C8D50",
    memberCount: 3,
    permissionCodes: ["ACCOUNT:CREATE"],
};

const group = [
    {
        permissionId: 1,
        code: "ACCOUNT:CREATE",
        resource: "ACCOUNT",
        action: "CREATE",
        description: "계정 생성 권한",
    },
    {
        permissionId: 2,
        code: "ACCOUNT:DELETE",
        resource: "ACCOUNT",
        action: "DELETE",
        description: "계정 삭제 권한",
    },
];

describe("AuthoritySelectGroup", () => {
    it("권한 코드와 설명을 표시한다", () => {
        render(<AuthoritySelectGroup group={group} role={role} />);

        expect(screen.getByText("ACCOUNT:CREATE")).toBeInTheDocument();
        expect(screen.getByText("계정 생성 권한")).toBeInTheDocument();
        expect(screen.getByText("ACCOUNT:DELETE")).toBeInTheDocument();
        expect(screen.getByText("계정 삭제 권한")).toBeInTheDocument();
    });

    it("role.permissionCodes에 포함된 권한만 초기에 선택 상태로 표시한다", () => {
        render(<AuthoritySelectGroup group={group} role={role} />);

        expect(screen.getByRole("checkbox", { name: /ACCOUNT:CREATE/ })).toBeChecked();
        expect(screen.getByRole("checkbox", { name: /ACCOUNT:DELETE/ })).not.toBeChecked();
    });

    it("일부만 선택되어 있으면 전체 선택 체크박스는 부분 선택 상태로 표시한다", () => {
        render(<AuthoritySelectGroup group={group} role={role} />);

        expect(screen.getByRole("checkbox", { name: "전체 선택" })).toBePartiallyChecked();
    });

    it("전체 선택을 클릭하면 그룹의 모든 권한을 선택한다", () => {
        render(<AuthoritySelectGroup group={group} role={role} />);

        fireEvent.click(screen.getByRole("checkbox", { name: "전체 선택" }));

        expect(screen.getByRole("checkbox", { name: /ACCOUNT:CREATE/ })).toBeChecked();
        expect(screen.getByRole("checkbox", { name: /ACCOUNT:DELETE/ })).toBeChecked();
    });

    it("나머지 권한을 마저 선택하면 전체 선택도 선택 상태가 된다", () => {
        render(<AuthoritySelectGroup group={group} role={role} />);

        fireEvent.click(screen.getByRole("checkbox", { name: /ACCOUNT:DELETE/ }));

        expect(screen.getByRole("checkbox", { name: "전체 선택" })).toBeChecked();
    });

    it("선택된 권한을 해제하면 전체 선택도 해제된다", () => {
        render(
            <AuthoritySelectGroup
                group={group}
                role={{ ...role, permissionCodes: ["ACCOUNT:CREATE", "ACCOUNT:DELETE"] }}
            />,
        );

        fireEvent.click(screen.getByRole("checkbox", { name: /ACCOUNT:CREATE/ }));

        expect(screen.getByRole("checkbox", { name: "전체 선택" })).not.toBeChecked();
        expect(screen.getByRole("checkbox", { name: /ACCOUNT:DELETE/ })).toBeChecked();
    });
});
