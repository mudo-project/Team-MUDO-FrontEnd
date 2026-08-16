import { render, screen } from "@testing-library/react";
import WorkList from "./WorkList";
import { WorkspaceTaskData } from "../type";

const buildTask = (overrides: Partial<WorkspaceTaskData> = {}): WorkspaceTaskData => ({
    taskId: 1,
    title: "업무 제목",
    status: "WAITING",
    creator: { userId: 1, name: "홍길동" },
    dueAt: null,
    ...overrides,
});

describe("WorkList", () => {
    it("업무 상태별 제목과 개수를 표시한다", () => {
        render(
            <WorkList
                setSelectedTask={jest.fn()}
                type="IN_PROGRESS"
                task={[buildTask({ taskId: 1 }), buildTask({ taskId: 2 })]}
                workspaceId="1"
            />,
        );

        expect(screen.getByRole("heading", { name: "진행중" })).toBeInTheDocument();
        expect(screen.getByText("2")).toBeInTheDocument();
    });

    it("업무가 없으면 개수를 0으로 표시하고 업무 추가 버튼만 노출한다", () => {
        render(
            <WorkList
                setSelectedTask={jest.fn()}
                type="WAITING"
                task={[]}
                workspaceId="1"
            />,
        );

        expect(screen.getByText("대기")).toBeInTheDocument();
        expect(screen.getByText("0")).toBeInTheDocument();
        expect(screen.getByText("업무 추가")).toBeInTheDocument();
    });

    it("각 업무 항목의 제목을 표시한다", () => {
        render(
            <WorkList
                setSelectedTask={jest.fn()}
                type="COMPLETED"
                task={[buildTask({ taskId: 1, title: "첫 번째 업무" })]}
                workspaceId="1"
            />,
        );

        expect(screen.getByText("첫 번째 업무")).toBeInTheDocument();
    });
});
