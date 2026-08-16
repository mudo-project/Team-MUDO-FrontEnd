import { fireEvent, render, screen } from "@testing-library/react";
import MessengerSidebar from "./MessengerSidebar";

function MockChatSidebar() {
    return <div>채팅 목록 영역</div>;
}

function MockTaskSidebar({ view }: { view: "received" | "sent" }) {
    return <div>업무 목록 영역: {view}</div>;
}

function MockChatCreateModal({ onClose }: { onClose: () => void }) {
    return (
        <div>
            새 채팅 모달
            <button onClick={onClose} type="button">
                닫기
            </button>
        </div>
    );
}

jest.mock("./ChatSidebar", () => MockChatSidebar);
jest.mock("./TaskSidebar", () => MockTaskSidebar);
jest.mock("./ChatCreateModal", () => MockChatCreateModal);

describe("MessengerSidebar", () => {
    it("기본 상태에서는 채팅 탭이 선택되어 채팅 목록을 보여준다", () => {
        render(<MessengerSidebar />);

        expect(screen.getByText("채팅 목록 영역")).toBeInTheDocument();
        expect(screen.queryByText(/업무 목록 영역/)).not.toBeInTheDocument();
    });

    it("업무 탭을 클릭하면 드롭다운이 열리고 받은 업무 목록이 기본으로 노출된다", () => {
        render(<MessengerSidebar />);

        fireEvent.click(screen.getByRole("button", { name: "업무" }));

        expect(screen.getByRole("button", { name: "받은 업무" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "전달한 업무" })).toBeInTheDocument();
        expect(screen.getByText("업무 목록 영역: received")).toBeInTheDocument();
    });

    it("업무 탭을 다시 클릭하면 드롭다운이 닫힌다", () => {
        render(<MessengerSidebar />);

        fireEvent.click(screen.getByRole("button", { name: "업무" }));
        fireEvent.click(screen.getByRole("button", { name: "업무" }));

        expect(screen.queryByRole("button", { name: "받은 업무" })).not.toBeInTheDocument();
    });

    it("전달한 업무를 선택하면 드롭다운이 닫히고 전달한 업무 목록으로 전환된다", () => {
        render(<MessengerSidebar />);

        fireEvent.click(screen.getByRole("button", { name: "업무" }));
        fireEvent.click(screen.getByRole("button", { name: "전달한 업무" }));

        expect(screen.queryByRole("button", { name: "받은 업무" })).not.toBeInTheDocument();
        expect(screen.getByText("업무 목록 영역: sent")).toBeInTheDocument();
    });

    it("채팅 탭으로 돌아가면 다시 채팅 목록을 보여준다", () => {
        render(<MessengerSidebar />);

        fireEvent.click(screen.getByRole("button", { name: "업무" }));
        fireEvent.click(screen.getByRole("button", { name: "채팅" }));

        expect(screen.getByText("채팅 목록 영역")).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "받은 업무" })).not.toBeInTheDocument();
    });

    it("채팅방 추가 버튼을 클릭하면 새 채팅 모달이 열리고 닫을 수 있다", () => {
        render(<MessengerSidebar />);

        fireEvent.click(screen.getByRole("button", { name: "새 채팅 만들기" }));
        expect(screen.getByText("새 채팅 모달")).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: "닫기" }));
        expect(screen.queryByText("새 채팅 모달")).not.toBeInTheDocument();
    });
});
