import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ScheduleCreateForm from "./ScheduleCreateForm";
import { MEMO_COLORS } from "@/feature/memo/components/MemoColorPicker";
import type { ScheduleEvent } from "../scheduleTypes";

describe("ScheduleCreateForm", () => {
  it("제목을 입력하지 않고 등록하면 에러 메시지를 노출한다", async () => {
    render(<ScheduleCreateForm initialDate={new Date(2026, 7, 1)} mode="create" onCancel={jest.fn()} onSubmit={jest.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "등록" }));

    expect(await screen.findByText("제목을 입력해주세요.")).toBeInTheDocument();
  });

  it("종일이 아닌데 시작/종료 시간을 선택하지 않으면 에러 메시지를 노출한다", async () => {
    render(<ScheduleCreateForm initialDate={new Date(2026, 7, 1)} mode="create" onCancel={jest.fn()} onSubmit={jest.fn()} />);

    fireEvent.change(screen.getByLabelText("제목"), { target: { value: "전체 회의" } });
    fireEvent.click(screen.getByRole("button", { name: "등록" }));

    expect(await screen.findByText("시작 시간을 선택해주세요.")).toBeInTheDocument();
    expect(screen.getByText("종료 시간을 선택해주세요.")).toBeInTheDocument();
  });

  it("종일 체크박스를 누르면 시간 선택 영역이 사라진다", () => {
    render(<ScheduleCreateForm initialDate={new Date(2026, 7, 1)} mode="create" onCancel={jest.fn()} onSubmit={jest.fn()} />);

    expect(screen.getByLabelText("시작 시간")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("checkbox", { name: "종일" }));

    expect(screen.queryByLabelText("시작 시간")).not.toBeInTheDocument();
  });

  it("필수 값을 모두 입력하고 등록하면 입력한 값으로 등록 콜백을 호출한다", async () => {
    const onSubmit = jest.fn();
    render(<ScheduleCreateForm initialDate={new Date(2026, 7, 1)} mode="create" onCancel={jest.fn()} onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText("제목"), { target: { value: "전체 회의" } });
    fireEvent.change(screen.getByLabelText("시작 시간"), { target: { value: "09:00" } });
    fireEvent.change(screen.getByLabelText("종료 시간"), { target: { value: "10:00" } });
    fireEvent.click(screen.getByRole("button", { name: "등록" }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0][0]).toMatchObject({
      title: "전체 회의",
      allDay: false,
      startTime: "09:00",
      endTime: "10:00",
    });
  });

  it("mode가 edit이면 기존 일정 값이 채워지고 버튼 문구가 수정으로 표시된다", () => {
    const schedule: ScheduleEvent = {
      id: 1,
      title: "기존 일정",
      date: new Date(2026, 7, 5),
      allDay: false,
      startTime: "09:00",
      endTime: "10:00",
      color: MEMO_COLORS[0],
      content: "기존 내용",
      createdAt: "2026.08.01",
    };

    render(<ScheduleCreateForm mode="edit" schedule={schedule} onCancel={jest.fn()} onSubmit={jest.fn()} />);

    expect(screen.getByLabelText("제목")).toHaveValue("기존 일정");
    expect(screen.getByRole("button", { name: "수정" })).toBeInTheDocument();
  });

  it("처리 중이면 버튼이 비활성화되고 문구가 바뀐다", () => {
    render(
      <ScheduleCreateForm isSubmitting initialDate={new Date(2026, 7, 1)} mode="create" onCancel={jest.fn()} onSubmit={jest.fn()} />
    );

    expect(screen.getByRole("button", { name: "처리 중..." })).toBeDisabled();
    expect(screen.getByRole("button", { name: "취소" })).toBeDisabled();
  });

  it("닫기 버튼을 클릭하면 취소 콜백을 호출한다", () => {
    const onCancel = jest.fn();
    render(<ScheduleCreateForm initialDate={new Date(2026, 7, 1)} mode="create" onCancel={onCancel} onSubmit={jest.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "닫기" }));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
