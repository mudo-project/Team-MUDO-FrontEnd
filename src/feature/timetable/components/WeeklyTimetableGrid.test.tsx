import { fireEvent, render, screen } from "@testing-library/react";
import WeeklyTimetableGrid from "./WeeklyTimetableGrid";
import type { ClassItem } from "@/feature/timetable/viewModel";

const days = [
  { name: "일", date: "08.02", dayOfWeek: 0, rooms: ["101"] },
  { name: "월", date: "08.03", dayOfWeek: 1, rooms: ["101"] },
];

const classItem: ClassItem = {
  slotId: 1,
  classType: "CLASS",
  day: 1,
  room: 0,
  start: 1,
  duration: 2,
  course: "공통미적",
  teacher: "최T",
  grade: "HIGH_3",
  color: "90A9C6",
};

const baseProps = {
  days,
  gridColumns: "68px repeat(2, 72px)",
  onSelectClass: jest.fn(),
  rowHeight: 26,
  slotCount: 10,
  times: ["08:00", "08:30"],
  visibleRooms: ["101"],
};

describe("WeeklyTimetableGrid", () => {
  it("필터를 통과한 수업 카드만 표시한다", () => {
    render(<WeeklyTimetableGrid {...baseProps} classes={[classItem]} isClassVisible={() => true} />);

    expect(screen.getByRole("button", { name: "공통미적 수업 상세" })).toBeInTheDocument();
  });

  it("필터를 통과하지 못한 수업은 표시하지 않는다", () => {
    render(<WeeklyTimetableGrid {...baseProps} classes={[classItem]} isClassVisible={() => false} />);

    expect(screen.queryByRole("button", { name: "공통미적 수업 상세" })).not.toBeInTheDocument();
  });

  it("표시되는 강의실 목록에 없는 요일의 수업은 표시하지 않는다", () => {
    render(
      <WeeklyTimetableGrid
        {...baseProps}
        classes={[classItem]}
        isClassVisible={() => true}
        visibleRooms={["102"]}
      />
    );

    expect(screen.queryByRole("button", { name: "공통미적 수업 상세" })).not.toBeInTheDocument();
  });

  it("수업 카드를 클릭하면 onSelectClass를 호출한다", () => {
    const onSelectClass = jest.fn();

    render(
      <WeeklyTimetableGrid
        {...baseProps}
        classes={[classItem]}
        isClassVisible={() => true}
        onSelectClass={onSelectClass}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "공통미적 수업 상세" }));

    expect(onSelectClass).toHaveBeenCalledWith(classItem);
  });

  it("학년이 있으면 학년 라벨을 과목명 앞에 붙인다", () => {
    render(<WeeklyTimetableGrid {...baseProps} classes={[classItem]} isClassVisible={() => true} />);

    expect(screen.getByText("고3 공통미적")).toBeInTheDocument();
  });
});
