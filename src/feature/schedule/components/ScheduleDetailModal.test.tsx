import { fireEvent, render, screen } from "@testing-library/react";
import ScheduleDetailModal from "./ScheduleDetailModal";
import { MEMO_COLORS } from "@/feature/memo/components/MemoColorPicker";
import type { ScheduleEvent } from "../scheduleTypes";

const baseEvent: ScheduleEvent = {
  id: 1,
  title: "전체 교직원 회의",
  startDate: new Date(2026, 7, 10),
  endDate: new Date(2026, 7, 10),
  allDay: false,
  startTime: "09:00",
  endTime: "10:00",
  color: MEMO_COLORS[0],
  content: "",
  createdAt: "2026.08.01",
};

describe("ScheduleDetailModal", () => {
  it("일정 제목과 작성일을 표시한다", () => {
    render(<ScheduleDetailModal event={baseEvent} onClose={jest.fn()} onDelete={jest.fn()} onEdit={jest.fn()} />);

    expect(screen.getByRole("heading", { name: "전체 교직원 회의" })).toBeInTheDocument();
    expect(screen.getByText("작성일 2026.08.01")).toBeInTheDocument();
  });

  it("내용이 있으면 내용을 표시한다", () => {
    render(
      <ScheduleDetailModal
        event={{ ...baseEvent, content: "회의실 A에서 진행" }}
        onClose={jest.fn()}
        onDelete={jest.fn()}
        onEdit={jest.fn()}
      />
    );

    expect(screen.getByText("회의실 A에서 진행")).toBeInTheDocument();
  });

  it("내용이 없으면 내용 영역을 렌더링하지 않는다", () => {
    render(<ScheduleDetailModal event={baseEvent} onClose={jest.fn()} onDelete={jest.fn()} onEdit={jest.fn()} />);

    expect(screen.queryByText("회의실 A에서 진행")).not.toBeInTheDocument();
  });

  it("닫기 버튼을 클릭하면 닫기 콜백을 호출한다", () => {
    const onClose = jest.fn();
    render(<ScheduleDetailModal event={baseEvent} onClose={onClose} onDelete={jest.fn()} onEdit={jest.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "닫기" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("수정 버튼을 클릭하면 수정 콜백을 호출한다", () => {
    const onEdit = jest.fn();
    render(<ScheduleDetailModal event={baseEvent} onClose={jest.fn()} onDelete={jest.fn()} onEdit={onEdit} />);

    fireEvent.click(screen.getByRole("button", { name: "수정" }));

    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  it("삭제 버튼을 클릭하면 삭제 콜백을 호출한다", () => {
    const onDelete = jest.fn();
    render(<ScheduleDetailModal event={baseEvent} onClose={jest.fn()} onDelete={onDelete} onEdit={jest.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "삭제" }));

    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it("여러 날에 걸친 일정은 시작일~종료일 범위를 표시한다", () => {
    render(
      <ScheduleDetailModal
        event={{ ...baseEvent, endDate: new Date(2026, 7, 12) }}
        onClose={jest.fn()}
        onDelete={jest.fn()}
        onEdit={jest.fn()}
      />
    );

    expect(screen.getByText("2026년 8월 10일 (월) ~ 2026년 8월 12일 (수)")).toBeInTheDocument();
  });
});
