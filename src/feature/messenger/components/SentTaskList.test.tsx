import { fireEvent, render, screen } from "@testing-library/react";
import { RoomTaskCard } from "../utils";
import SentTaskList from "./SentTaskList";

jest.mock("../actions", () => ({
    completeTaskCardAction: jest.fn(),
    deleteTaskCardAction: jest.fn(),
}));

const buildCard = (overrides: Partial<MessengerTaskCardItemData>): MessengerTaskCardItemData => ({
    id: 1,
    assignerId: 1,
    assignerName: "로그인 사용자",
    content: "보강 교실 변경 안내 부탁드립니다",
    dueDate: null,
    assignees: [],
    completedCount: 0,
    assigneeCount: 0,
    fullyCompleted: false,
    createdAt: "2026-08-01T00:00:00",
    ...overrides,
});

describe("SentTaskList", () => {
    it("로그인 사용자가 등록자가 아닌 카드는 노출하지 않는다", () => {
        const items: RoomTaskCard[] = [{ roomId: 1, roomName: "1반", card: buildCard({ assignerId: 999 }) }];
        render(<SentTaskList items={items} currentUserId={1} onChange={jest.fn()} />);

        expect(screen.queryByText("보강 교실 변경 안내 부탁드립니다")).not.toBeInTheDocument();
    });

    it("담당자가 없으면 완료율을 0%로 계산한다", () => {
        const items: RoomTaskCard[] = [{ roomId: 1, roomName: "1반", card: buildCard({ completedCount: 0, assigneeCount: 0 }) }];
        render(<SentTaskList items={items} currentUserId={1} onChange={jest.fn()} />);

        expect(screen.getByText("완료")).toBeInTheDocument();
        expect(screen.getByText("0/0")).toBeInTheDocument();
    });

    it("완료 인원 수를 진행률로 표시한다", () => {
        const items: RoomTaskCard[] = [{ roomId: 1, roomName: "1반", card: buildCard({ completedCount: 1, assigneeCount: 2 }) }];
        render(<SentTaskList items={items} currentUserId={1} onChange={jest.fn()} />);

        expect(screen.getByText("1/2")).toBeInTheDocument();
    });

    it("카드 본문을 클릭하면 업무카드 상세조회 모달이 열린다", () => {
        const items: RoomTaskCard[] = [{ roomId: 1, roomName: "1반", card: buildCard({}) }];
        render(<SentTaskList items={items} currentUserId={1} onChange={jest.fn()} />);

        fireEvent.click(screen.getByText("보강 교실 변경 안내 부탁드립니다"));

        expect(screen.getByRole("button", { name: "업무카드 상세조회 닫기" })).toBeInTheDocument();
    });
});
