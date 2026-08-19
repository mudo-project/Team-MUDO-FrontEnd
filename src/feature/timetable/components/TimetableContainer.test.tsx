import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { toPng } from "html-to-image";
import {
  deleteTimetableSlotAction,
  exportTimetableSetAction,
  getTimetableSetDetailAction,
  getTimetableSetListAction,
  getTimetableSlotListAction,
} from "../actions";
import { useUserStore } from "@/store/useUserStore";
import TimetableContainer from "./TimetableContainer";

jest.mock("../actions", () => ({
  createTimetableSetAction: jest.fn(),
  createTimetableSlotAction: jest.fn(),
  deleteTimetableSetAction: jest.fn(),
  deleteTimetableSlotAction: jest.fn(),
  exportTimetableSetAction: jest.fn(),
  getTimetableSetDetailAction: jest.fn(),
  getTimetableSetListAction: jest.fn(),
  getTimetableSlotListAction: jest.fn(),
  updateTimetableSetAction: jest.fn(),
  updateTimetableSlotAction: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: { error: jest.fn(), success: jest.fn() },
}));

jest.mock("html-to-image", () => ({
  toPng: jest.fn().mockResolvedValue("data:image/png;base64,xxx"),
}));

const template: TimetableSetListData = {
  timetableSetId: 1,
  name: "2026 여름특강",
  startDate: "2026-08-10",
  endDate: "2026-08-31",
  status: "ACTIVE",
};

const templateDetail: TimetableSetDetailData = {
  timetableSetId: 1,
  name: "2026 여름특강",
  startDate: "2026-08-10",
  endDate: "2026-08-31",
  operatingStartTime: "08:00",
  operatingEndTime: "22:00",
  operatingDays: ["MONDAY"],
  slotUnitMinutes: 30,
  classrooms: [{ floor: "1층", codes: ["101"] }],
  status: "ACTIVE",
};

const slot: TimetableSlotData = {
  timetableSlotId: 10,
  classType: "CLASS",
  dayOfWeek: "MONDAY",
  classroomCode: "101",
  startTime: "09:00",
  endTime: "10:00",
  grade: "HIGH_3",
  teacherName: "최T",
  subjectName: "공통미적",
  color: "90A9C6",
};

const mockedGetTimetableSetListAction = getTimetableSetListAction as jest.Mock;
const mockedGetTimetableSetDetailAction = getTimetableSetDetailAction as jest.Mock;
const mockedGetTimetableSlotListAction = getTimetableSlotListAction as jest.Mock;
const mockedDeleteTimetableSlotAction = deleteTimetableSlotAction as jest.Mock;
const mockedExportTimetableSetAction = exportTimetableSetAction as jest.Mock;
const mockedToPng = toPng as jest.Mock;

const renderContainer = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  render(
    <QueryClientProvider client={queryClient}>
      <TimetableContainer />
    </QueryClientProvider>
  );
};

describe("TimetableContainer", () => {
  beforeEach(() => {
    useUserStore.setState({ permissions: ["TIMETABLE:MANAGE"] });
  });

  afterEach(() => jest.clearAllMocks());

  it("TIMETABLE:MANAGE 권한이 없으면 수업 등록/시간표 관리 버튼을 노출하지 않는다", async () => {
    useUserStore.setState({ permissions: [] });
    mockedGetTimetableSetListAction.mockResolvedValue([template]);
    mockedGetTimetableSetDetailAction.mockResolvedValue(templateDetail);
    mockedGetTimetableSlotListAction.mockResolvedValue([slot]);

    renderContainer();

    await screen.findByRole("button", { name: "공통미적 수업 상세" });

    expect(screen.queryByRole("button", { name: "수업 등록" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "시간표 관리" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "공통미적 수업 상세" }));

    expect(await screen.findByRole("heading", { name: "공통미적" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "수정" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "삭제" })).not.toBeInTheDocument();
  });

  it("템플릿 목록 조회에 실패하면 에러 메시지를 표시한다", async () => {
    mockedGetTimetableSetListAction.mockRejectedValue(new Error("실패"));

    renderContainer();

    expect(await screen.findByText("시간표 목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.")).toBeInTheDocument();
  });

  it("등록된 시간표가 없으면 안내 문구와 새 시간표 만들기 버튼을 표시한다", async () => {
    mockedGetTimetableSetListAction.mockResolvedValue([]);

    renderContainer();

    expect(await screen.findByText("등록된 시간표가 없습니다.")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "새 시간표 만들기" }));

    expect(await screen.findByLabelText("시간표 이름")).toBeInTheDocument();
  });

  it("시간표가 있으면 필터·그리드를 표시하고 수업 카드를 클릭하면 상세 모달이 열린다", async () => {
    mockedGetTimetableSetListAction.mockResolvedValue([template]);
    mockedGetTimetableSetDetailAction.mockResolvedValue(templateDetail);
    mockedGetTimetableSlotListAction.mockResolvedValue([slot]);

    renderContainer();

    expect(await screen.findByRole("button", { name: "공통미적 수업 상세" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "공통미적 수업 상세" }));

    expect(await screen.findByRole("heading", { name: "공통미적" })).toBeInTheDocument();
  });

  it("수업 상세에서 삭제를 클릭하면 삭제 액션을 호출한다", async () => {
    mockedGetTimetableSetListAction.mockResolvedValue([template]);
    mockedGetTimetableSetDetailAction.mockResolvedValue(templateDetail);
    mockedGetTimetableSlotListAction.mockResolvedValue([slot]);
    mockedDeleteTimetableSlotAction.mockResolvedValue({ success: true, message: "삭제되었습니다." });

    renderContainer();

    fireEvent.click(await screen.findByRole("button", { name: "공통미적 수업 상세" }));
    fireEvent.click(await screen.findByRole("button", { name: "삭제" }));

    await waitFor(() => expect(mockedDeleteTimetableSlotAction).toHaveBeenCalledWith(1, 10, "ALL"));
  });

  it("수업 등록 버튼을 클릭하면 빈 값으로 등록 모달이 열린다", async () => {
    mockedGetTimetableSetListAction.mockResolvedValue([template]);
    mockedGetTimetableSetDetailAction.mockResolvedValue(templateDetail);
    mockedGetTimetableSlotListAction.mockResolvedValue([slot]);

    renderContainer();

    await screen.findByRole("button", { name: "공통미적 수업 상세" });

    fireEvent.click(screen.getByRole("button", { name: "수업 등록" }));

    expect(await screen.findByLabelText("강사")).toHaveValue("");
  });

  it("강의 검색어를 입력하면 검색어와 일치하지 않는 수업 카드는 숨겨진다", async () => {
    mockedGetTimetableSetListAction.mockResolvedValue([template]);
    mockedGetTimetableSetDetailAction.mockResolvedValue(templateDetail);
    mockedGetTimetableSlotListAction.mockResolvedValue([slot]);

    renderContainer();

    await screen.findByRole("button", { name: "공통미적 수업 상세" });

    fireEvent.change(screen.getByLabelText("강의 검색"), { target: { value: "영어" } });

    expect(screen.queryByRole("button", { name: "공통미적 수업 상세" })).not.toBeInTheDocument();
  });

  it("수업 상세에서 수정을 클릭하면 기존 값으로 등록 모달이 열린다", async () => {
    mockedGetTimetableSetListAction.mockResolvedValue([template]);
    mockedGetTimetableSetDetailAction.mockResolvedValue(templateDetail);
    mockedGetTimetableSlotListAction.mockResolvedValue([slot]);

    renderContainer();

    fireEvent.click(await screen.findByRole("button", { name: "공통미적 수업 상세" }));
    fireEvent.click(await screen.findByRole("button", { name: "수정" }));

    expect(await screen.findByLabelText("강사")).toHaveValue("최T");
  });

  it("템플릿 기간 안의 오늘 날짜가 속한 주를 표시한다", async () => {
    jest.useFakeTimers().setSystemTime(new Date("2026-08-20T00:00:00"));

    mockedGetTimetableSetListAction.mockResolvedValue([template]);
    mockedGetTimetableSetDetailAction.mockResolvedValue(templateDetail);
    mockedGetTimetableSlotListAction.mockResolvedValue([slot]);

    renderContainer();

    await screen.findByRole("button", { name: "공통미적 수업 상세" });

    const headerTexts = screen.getAllByRole("columnheader").map((header) => header.textContent ?? "");

    expect(headerTexts[0]).toContain("08.16");
    expect(headerTexts[6]).toContain("08.22");

    jest.useRealTimers();
  });

  it("요일 헤더는 시작일의 요일과 무관하게 항상 일~토 순서로 표시된다", async () => {
    mockedGetTimetableSetListAction.mockResolvedValue([template]);
    mockedGetTimetableSetDetailAction.mockResolvedValue(templateDetail);
    mockedGetTimetableSlotListAction.mockResolvedValue([slot]);

    renderContainer();

    await screen.findByRole("button", { name: "공통미적 수업 상세" });

    const headerTexts = screen.getAllByRole("columnheader").map((header) => header.textContent ?? "");

    ["일", "월", "화", "수", "목", "금", "토"].forEach((name, index) => {
      expect(headerTexts[index]).toContain(name);
    });
  });

  it("이미지(PNG)로 내보내기를 클릭하면 백엔드 호출 없이 그리드를 캡처해 다운로드한다", async () => {
    mockedGetTimetableSetListAction.mockResolvedValue([template]);
    mockedGetTimetableSetDetailAction.mockResolvedValue(templateDetail);
    mockedGetTimetableSlotListAction.mockResolvedValue([slot]);

    renderContainer();

    await screen.findByRole("button", { name: "공통미적 수업 상세" });

    fireEvent.click(screen.getByRole("button", { name: "내보내기" }));
    fireEvent.click(await screen.findByRole("button", { name: /이미지\(PNG\)/ }));

    await waitFor(() => expect(mockedToPng).toHaveBeenCalled());
    expect(mockedExportTimetableSetAction).not.toHaveBeenCalled();
    expect(mockedToPng).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ backgroundColor: "#ffffff" }));
  });
});
