import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createScheduleAction, deleteScheduleAction, getScheduleListAction } from "../actions";
import { MEMO_COLORS } from "@/feature/memo/components/MemoColorPicker";
import ScheduleBoard from "./ScheduleBoard";

jest.mock("../actions", () => ({
  getScheduleListAction: jest.fn(),
  getScheduleDetailAction: jest.fn(),
  createScheduleAction: jest.fn(),
  updateScheduleAction: jest.fn(),
  deleteScheduleAction: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: { error: jest.fn(), success: jest.fn() },
}));

const mockedGetScheduleListAction = getScheduleListAction as jest.Mock;
const mockedCreateScheduleAction = createScheduleAction as jest.Mock;
const mockedDeleteScheduleAction = deleteScheduleAction as jest.Mock;

const scheduleEventData: ScheduleEventData = {
  eventId: 1,
  title: "전체 교직원 회의",
  content: "회의실 A",
  eventStartAt: "2026-08-10T09:00:00",
  eventEndAt: "2026-08-10T10:00:00",
  allDay: false,
  color: MEMO_COLORS[0].code,
  createdBy: 1,
  createdAt: "2026-08-01T00:00:00",
  updatedAt: "2026-08-01T00:00:00",
};

const renderBoard = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  render(
    <QueryClientProvider client={queryClient}>
      <ScheduleBoard />
    </QueryClientProvider>
  );
};

describe("ScheduleBoard", () => {
  afterEach(() => jest.clearAllMocks());

  it("일정 목록 조회에 실패하면 에러 메시지를 표시한다", async () => {
    mockedGetScheduleListAction.mockRejectedValue(new Error("실패"));

    renderBoard();

    expect(await screen.findByText("일정을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.")).toBeInTheDocument();
  });

  it("일정 목록을 조회해 우측 목록에 표시하고 클릭하면 상세 모달이 열린다", async () => {
    mockedGetScheduleListAction.mockResolvedValue([scheduleEventData]);

    renderBoard();

    fireEvent.click(await screen.findByText("전체 교직원 회의"));

    expect(await screen.findByRole("heading", { name: "전체 교직원 회의" })).toBeInTheDocument();
  });

  it("일정 추가 버튼을 클릭하고 등록하면 등록 액션을 호출하고 폼이 닫힌다", async () => {
    mockedGetScheduleListAction.mockResolvedValue([]);
    mockedCreateScheduleAction.mockResolvedValue({ success: true, message: "일정이 등록되었습니다.", eventId: 2 });

    renderBoard();

    await screen.findByText("이 달에 등록된 일정이 없습니다.");

    fireEvent.click(screen.getByRole("button", { name: "일정 추가" }));
    fireEvent.change(screen.getByLabelText("제목"), { target: { value: "신규 일정" } });
    fireEvent.click(screen.getByRole("checkbox", { name: "종일" }));
    fireEvent.click(screen.getByRole("button", { name: "등록" }));

    await waitFor(() => expect(mockedCreateScheduleAction).toHaveBeenCalled());
    await waitFor(() => expect(screen.queryByLabelText("제목")).not.toBeInTheDocument());
  });

  it("상세 모달에서 수정을 클릭하면 기존 값으로 등록 폼이 열린다", async () => {
    mockedGetScheduleListAction.mockResolvedValue([scheduleEventData]);

    renderBoard();

    fireEvent.click(await screen.findByText("전체 교직원 회의"));
    fireEvent.click(await screen.findByRole("button", { name: "수정" }));

    expect(await screen.findByLabelText("제목")).toHaveValue("전체 교직원 회의");
  });

  it("상세 모달에서 삭제를 클릭하고 확인하면 삭제 액션을 호출한다", async () => {
    mockedGetScheduleListAction.mockResolvedValue([scheduleEventData]);
    mockedDeleteScheduleAction.mockResolvedValue({ success: true, message: "일정이 삭제되었습니다." });

    renderBoard();

    fireEvent.click(await screen.findByText("전체 교직원 회의"));
    fireEvent.click(await screen.findByRole("button", { name: "삭제" }));
    fireEvent.click(await screen.findByRole("button", { name: "삭제" }));

    await waitFor(() => expect(mockedDeleteScheduleAction).toHaveBeenCalledWith(1));
  });
});
