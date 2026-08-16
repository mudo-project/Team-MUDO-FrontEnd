import { fireEvent, render, screen } from "@testing-library/react";
import { useUserStore } from "@/store/useUserStore";
import MemberCreateButton from "./MemberCreateButton";

jest.mock("./modal/CreateMemberModal", () => {
    return function MockCreateMemberModal({ closeModal }: { closeModal: () => void }) {
        return (
            <div role="dialog">
                계정 생성 모달
                <button onClick={closeModal} type="button">
                    모달 닫기
                </button>
            </div>
        );
    };
});

describe("MemberCreateButton", () => {
    beforeEach(() => {
        useUserStore.setState({ permissions: [] });
    });

    it("ACCOUNT:CREATE 권한이 없으면 계정 생성 버튼을 노출하지 않는다", () => {
        render(<MemberCreateButton />);

        expect(screen.queryByRole("button", { name: "계정 생성" })).not.toBeInTheDocument();
    });

    it("ACCOUNT:CREATE 권한이 있으면 계정 생성 버튼을 노출한다", () => {
        useUserStore.setState({ permissions: ["ACCOUNT:CREATE"] });

        render(<MemberCreateButton />);

        expect(screen.getByRole("button", { name: "계정 생성" })).toBeInTheDocument();
    });

    it("계정 생성 버튼을 클릭하면 계정 생성 모달을 노출한다", () => {
        useUserStore.setState({ permissions: ["ACCOUNT:CREATE"] });

        render(<MemberCreateButton />);
        fireEvent.click(screen.getByRole("button", { name: "계정 생성" }));

        expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("모달의 닫기 콜백이 호출되면 계정 생성 모달을 닫는다", () => {
        useUserStore.setState({ permissions: ["ACCOUNT:CREATE"] });

        render(<MemberCreateButton />);
        fireEvent.click(screen.getByRole("button", { name: "계정 생성" }));
        fireEvent.click(screen.getByRole("button", { name: "모달 닫기" }));

        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
});
