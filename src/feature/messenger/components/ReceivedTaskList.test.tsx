import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { completeTaskCardAction } from "../actions";
import { RoomTaskCard } from "../utils";
import ReceivedTaskList from "./ReceivedTaskList";

jest.mock("../actions", () => ({
    completeTaskCardAction: jest.fn(),
    deleteTaskCardAction: jest.fn(),
}));

const mockedCompleteTaskCardAction = completeTaskCardAction as jest.MockedFunction<typeof completeTaskCardAction>;

const buildCard = (overrides: Partial<MessengerTaskCardItemData>): MessengerTaskCardItemData => ({
    id: 1,
    assignerId: 100,
    assignerName: "김지수",
    content: "보강 교실 변경 안내 부탁드립니다",
    dueDate: null,
    assignees: [{ userId: 1, name: "로그인 사용자", completedAt: null }],
    completedCount: 0,
    assigneeCount: 1,
    fullyCompleted: false,
    createdAt: "2026-08-01T00:00:00",
    ...overrides,
});

describe("ReceivedTaskList", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("로그인 사용자가 담당자로 포함되지 않은 카드는 노출하지 않는다", () => {
        const items: RoomTaskCard[] = [
            { roomId: 1, roomName: "1반", card: buildCard({ id: 1, assignees: [{ userId: 999, name: "다른 사람", completedAt: null }] }) },
        ];
        render(<ReceivedTaskList items={items} currentUserId={1} onChange={jest.fn()} />);

        expect(screen.queryByText("보강 교실 변경 안내 부탁드립니다")).not.toBeInTheDocument();
    });

    it("마감일이 지났고 미완료 상태면 마감초과를 표시한다", () => {
        const items: RoomTaskCard[] = [
            {
                roomId: 1,
                roomName: "1반",
                card: buildCard({ dueDate: "2020-01-01", assignees: [{ userId: 1, name: "로그인 사용자", completedAt: null }] }),
            },
        ];
        render(<ReceivedTaskList items={items} currentUserId={1} onChange={jest.fn()} />);

        expect(screen.getByText("마감초과 2020-01-01")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "완료했습니다" })).toBeInTheDocument();
    });

    it("본인 담당이 완료 상태면 완료함을 표시하고 완료 버튼을 숨긴다", () => {
        const items: RoomTaskCard[] = [
            {
                roomId: 1,
                roomName: "1반",
                card: buildCard({ assignees: [{ userId: 1, name: "로그인 사용자", completedAt: "2026-08-02T00:00:00" }] }),
            },
        ];
        render(<ReceivedTaskList items={items} currentUserId={1} onChange={jest.fn()} />);

        expect(screen.getByText("완료함")).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "완료했습니다" })).not.toBeInTheDocument();
    });

    it("완료했습니다 버튼을 클릭하면 완료 처리 액션을 호출하고 목록을 갱신한다", async () => {
        mockedCompleteTaskCardAction.mockResolvedValue({ success: true, message: "업무를 완료 처리했습니다." });
        const onChange = jest.fn();
        const items: RoomTaskCard[] = [{ roomId: 3, roomName: "1반", card: buildCard({ id: 9 }) }];
        render(<ReceivedTaskList items={items} currentUserId={1} onChange={onChange} />);

        fireEvent.click(screen.getByRole("button", { name: "완료했습니다" }));

        await waitFor(() => {
            expect(completeTaskCardAction).toHaveBeenCalledWith(3, 9);
        });
        expect(onChange).toHaveBeenCalled();
    });

    it("카드 본문을 클릭하면 업무지시 상세조회 모달이 열린다", () => {
        const items: RoomTaskCard[] = [{ roomId: 1, roomName: "1반", card: buildCard({}) }];
        render(<ReceivedTaskList items={items} currentUserId={1} onChange={jest.fn()} />);

        fireEvent.click(screen.getByText("보강 교실 변경 안내 부탁드립니다"));

        expect(screen.getByRole("button", { name: "업무지시 상세조회 닫기" })).toBeInTheDocument();
    });
});
