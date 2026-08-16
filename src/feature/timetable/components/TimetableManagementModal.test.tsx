import { fireEvent, render, screen } from "@testing-library/react";
import TimetableManagementModal from "./TimetableManagementModal";
import type { TemplateStatus } from "@/feature/timetable/viewModel";

const templates: TimetableSetListData[] = [
  { timetableSetId: 1, name: "2026 여름특강", startDate: "2026-08-01", endDate: "2026-08-31", status: "ACTIVE" },
  { timetableSetId: 2, name: "2026 겨울특강", startDate: "2026-12-01", endDate: "2026-12-31", status: "PLANNED" },
];

const getStatus = (status: TimetableSetStatus): TemplateStatus =>
  status === "ACTIVE" ? { label: "진행 중", tone: "" } : { label: "예정", tone: "" };

describe("TimetableManagementModal", () => {
  it("템플릿 목록과 등록된 수업 수·상태를 표시한다", () => {
    render(
      <TimetableManagementModal
        classCounts={{ 1: 3 }}
        getStatus={getStatus}
        onClose={jest.fn()}
        onCreate={jest.fn()}
        onDeleteTemplate={jest.fn()}
        onEditTemplate={jest.fn()}
        onToggleOption={jest.fn()}
        openOptionId={null}
        templates={templates}
      />
    );

    expect(screen.getByText("2026 여름특강")).toBeInTheDocument();
    expect(screen.getByText(/3개 수업/)).toBeInTheDocument();
    expect(screen.getByText("진행 중")).toBeInTheDocument();
    expect(screen.getByText("예정")).toBeInTheDocument();
  });

  it("등록된 수업이 없으면 0개로 표시한다", () => {
    render(
      <TimetableManagementModal
        classCounts={{}}
        getStatus={getStatus}
        onClose={jest.fn()}
        onCreate={jest.fn()}
        onDeleteTemplate={jest.fn()}
        onEditTemplate={jest.fn()}
        onToggleOption={jest.fn()}
        openOptionId={null}
        templates={templates}
      />
    );

    expect(screen.getAllByText(/0개 수업/).length).toBeGreaterThan(0);
  });

  it("옵션 메뉴가 닫혀있으면 수정·삭제 버튼이 보이지 않는다", () => {
    render(
      <TimetableManagementModal
        classCounts={{}}
        getStatus={getStatus}
        onClose={jest.fn()}
        onCreate={jest.fn()}
        onDeleteTemplate={jest.fn()}
        onEditTemplate={jest.fn()}
        onToggleOption={jest.fn()}
        openOptionId={null}
        templates={templates}
      />
    );

    expect(screen.queryByRole("button", { name: "수정" })).not.toBeInTheDocument();
  });

  it("옵션 버튼을 클릭하면 onToggleOption을 호출한다", () => {
    const onToggleOption = jest.fn();

    render(
      <TimetableManagementModal
        classCounts={{}}
        getStatus={getStatus}
        onClose={jest.fn()}
        onCreate={jest.fn()}
        onDeleteTemplate={jest.fn()}
        onEditTemplate={jest.fn()}
        onToggleOption={onToggleOption}
        openOptionId={null}
        templates={templates}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "2026 여름특강 옵션" }));

    expect(onToggleOption).toHaveBeenCalledWith(1);
  });

  it("옵션 메뉴가 열려있는 항목의 수정·삭제를 클릭하면 각각의 콜백을 호출한다", () => {
    const onEditTemplate = jest.fn();
    const onDeleteTemplate = jest.fn();

    render(
      <TimetableManagementModal
        classCounts={{}}
        getStatus={getStatus}
        onClose={jest.fn()}
        onCreate={jest.fn()}
        onDeleteTemplate={onDeleteTemplate}
        onEditTemplate={onEditTemplate}
        onToggleOption={jest.fn()}
        openOptionId={1}
        templates={templates}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "수정" }));
    expect(onEditTemplate).toHaveBeenCalledWith(templates[0]);

    fireEvent.click(screen.getByRole("button", { name: "삭제" }));
    expect(onDeleteTemplate).toHaveBeenCalledWith(1);
  });

  it("새 시간표를 클릭하면 onCreate를 호출한다", () => {
    const onCreate = jest.fn();

    render(
      <TimetableManagementModal
        classCounts={{}}
        getStatus={getStatus}
        onClose={jest.fn()}
        onCreate={onCreate}
        onDeleteTemplate={jest.fn()}
        onEditTemplate={jest.fn()}
        onToggleOption={jest.fn()}
        openOptionId={null}
        templates={templates}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "새 시간표" }));

    expect(onCreate).toHaveBeenCalled();
  });

  it("닫기를 클릭하면 onClose를 호출한다", () => {
    const onClose = jest.fn();

    render(
      <TimetableManagementModal
        classCounts={{}}
        getStatus={getStatus}
        onClose={onClose}
        onCreate={jest.fn()}
        onDeleteTemplate={jest.fn()}
        onEditTemplate={jest.fn()}
        onToggleOption={jest.fn()}
        openOptionId={null}
        templates={templates}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "시간표 관리 닫기" }));

    expect(onClose).toHaveBeenCalled();
  });
});
