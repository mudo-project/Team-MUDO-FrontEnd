import { fireEvent, render, screen } from "@testing-library/react";
import ScheduleList from "./ScheduleList";
import { MEMO_COLORS } from "@/feature/memo/components/MemoColorPicker";
import type { ScheduleEvent } from "../scheduleTypes";

function makeEvent(overrides: Partial<ScheduleEvent> = {}): ScheduleEvent {
  return {
    id: 1,
    title: "전체 회의",
    startDate: new Date(2026, 7, 10),
    endDate: new Date(2026, 7, 10),
    allDay: true,
    color: MEMO_COLORS[0],
    content: "",
    createdAt: "2026.08.01",
    ...overrides,
  };
}

describe("ScheduleList", () => {
  it("선택된 날짜가 없으면 해당 월 전체 일정과 총 건수를 표시한다", () => {
    const events = [
      makeEvent({ id: 1, title: "회의" }),
      makeEvent({ id: 2, title: "워크숍", startDate: new Date(2026, 7, 20), endDate: new Date(2026, 7, 20) }),
    ];

    render(
      <ScheduleList
        events={events}
        month={new Date(2026, 7, 1)}
        selectedDate={undefined}
        onClearSelectedDate={jest.fn()}
        onSelectEvent={jest.fn()}
      />
    );

    expect(screen.getByText("8월 일정")).toBeInTheDocument();
    expect(screen.getByText("총 2건")).toBeInTheDocument();
    expect(screen.getByText("회의")).toBeInTheDocument();
    expect(screen.getByText("워크숍")).toBeInTheDocument();
  });

  it("선택된 날짜가 있으면 그 날짜 일정만 표시하고 날짜 선택 해제 버튼을 노출한다", () => {
    const events = [
      makeEvent({ id: 1, title: "회의", startDate: new Date(2026, 7, 10), endDate: new Date(2026, 7, 10) }),
      makeEvent({ id: 2, title: "워크숍", startDate: new Date(2026, 7, 20), endDate: new Date(2026, 7, 20) }),
    ];

    render(
      <ScheduleList
        events={events}
        month={new Date(2026, 7, 1)}
        selectedDate={new Date(2026, 7, 10)}
        onClearSelectedDate={jest.fn()}
        onSelectEvent={jest.fn()}
      />
    );

    expect(screen.getByText("회의")).toBeInTheDocument();
    expect(screen.queryByText("워크숍")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "날짜 선택 해제" })).toBeInTheDocument();
  });

  it("날짜 선택 해제 버튼을 클릭하면 콜백을 호출한다", () => {
    const onClearSelectedDate = jest.fn();

    render(
      <ScheduleList
        events={[makeEvent({ startDate: new Date(2026, 7, 10), endDate: new Date(2026, 7, 10) })]}
        month={new Date(2026, 7, 1)}
        selectedDate={new Date(2026, 7, 10)}
        onClearSelectedDate={onClearSelectedDate}
        onSelectEvent={jest.fn()}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "날짜 선택 해제" }));

    expect(onClearSelectedDate).toHaveBeenCalledTimes(1);
  });

  it("해당 월에 일정이 없으면 안내 문구를 표시한다", () => {
    render(
      <ScheduleList
        events={[]}
        month={new Date(2026, 7, 1)}
        selectedDate={undefined}
        onClearSelectedDate={jest.fn()}
        onSelectEvent={jest.fn()}
      />
    );

    expect(screen.getByText("이 달에 등록된 일정이 없습니다.")).toBeInTheDocument();
  });

  it("선택된 날짜에 일정이 없으면 안내 문구를 표시한다", () => {
    render(
      <ScheduleList
        events={[makeEvent({ startDate: new Date(2026, 7, 20), endDate: new Date(2026, 7, 20) })]}
        month={new Date(2026, 7, 1)}
        selectedDate={new Date(2026, 7, 10)}
        onClearSelectedDate={jest.fn()}
        onSelectEvent={jest.fn()}
      />
    );

    expect(screen.getByText("이 날짜에 등록된 일정이 없습니다.")).toBeInTheDocument();
  });

  it("일정 항목을 클릭하면 해당 일정으로 상세조회 콜백을 호출한다", () => {
    const onSelectEvent = jest.fn();
    const event = makeEvent({ title: "회의" });

    render(
      <ScheduleList
        events={[event]}
        month={new Date(2026, 7, 1)}
        selectedDate={undefined}
        onClearSelectedDate={jest.fn()}
        onSelectEvent={onSelectEvent}
      />
    );

    fireEvent.click(screen.getByText("회의"));

    expect(onSelectEvent).toHaveBeenCalledWith(event);
  });

  it("여러 날에 걸친 일정은 범위 안의 어떤 날짜를 선택해도 조회된다", () => {
    const event = makeEvent({
      title: "워크숍",
      startDate: new Date(2026, 7, 9),
      endDate: new Date(2026, 7, 12),
      allDay: false,
    });

    render(
      <ScheduleList
        events={[event]}
        month={new Date(2026, 7, 1)}
        selectedDate={new Date(2026, 7, 11)}
        onClearSelectedDate={jest.fn()}
        onSelectEvent={jest.fn()}
      />
    );

    expect(screen.getByText("워크숍")).toBeInTheDocument();
  });

  it("이전 달에서 시작해 이번 달로 걸치는 일정은 이번 달 목록에 포함된다", () => {
    const event = makeEvent({
      title: "이월 워크숍",
      startDate: new Date(2026, 6, 30),
      endDate: new Date(2026, 7, 2),
    });

    render(
      <ScheduleList
        events={[event]}
        month={new Date(2026, 7, 1)}
        selectedDate={undefined}
        onClearSelectedDate={jest.fn()}
        onSelectEvent={jest.fn()}
      />
    );

    expect(screen.getByText("이월 워크숍")).toBeInTheDocument();
  });
});
