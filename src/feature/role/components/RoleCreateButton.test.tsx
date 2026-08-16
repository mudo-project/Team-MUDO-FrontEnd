import { fireEvent, render, screen } from "@testing-library/react";
import RoleCreateButton from "./RoleCreateButton";

jest.mock("./modal/CreateRoleModal", () => {
    return function MockCreateRoleModal({ closeModal }: { closeModal: () => void }) {
        return (
            <div role="dialog">
                역할 생성 모달
                <button onClick={closeModal} type="button">
                    모달 닫기
                </button>
            </div>
        );
    };
});

describe("RoleCreateButton", () => {
    it("역할 추가 버튼을 클릭하면 역할 생성 모달을 노출한다", () => {
        render(<RoleCreateButton />);

        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: "역할 추가" }));

        expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("모달의 닫기 콜백이 호출되면 역할 생성 모달을 닫는다", () => {
        render(<RoleCreateButton />);

        fireEvent.click(screen.getByRole("button", { name: "역할 추가" }));
        fireEvent.click(screen.getByRole("button", { name: "모달 닫기" }));

        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
});
