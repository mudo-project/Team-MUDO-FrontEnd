import { createSchedule, deleteSchedule, updateSchedule } from "@/service/schedule.service";
import { createScheduleAction, deleteScheduleAction, updateScheduleAction } from "./actions";

jest.mock("../../service/schedule.service");

afterEach(() => jest.clearAllMocks());

const validPayload: ScheduleCreateRequest = {
  title: "전체 교직원 회의",
  content: "회의실 A",
  eventStartAt: "2026-08-10T09:00:00",
  eventEndAt: "2026-08-10T10:00:00",
  allDay: false,
  color: "B9827F",
};

describe("createScheduleAction", () => {
  it("제목이 비어있으면 검증 실패 결과를 반환한다", async () => {
    const result = await createScheduleAction({ ...validPayload, title: "   " });

    expect(result).toEqual({ success: false, message: "일정 제목을 입력해주세요." });
    expect(createSchedule).not.toHaveBeenCalled();
  });

  it("시작 시간이 없으면 검증 실패 결과를 반환한다", async () => {
    const result = await createScheduleAction({ ...validPayload, eventStartAt: "" });

    expect(result).toEqual({ success: false, message: "일정 날짜와 시작 시간을 선택해주세요." });
    expect(createSchedule).not.toHaveBeenCalled();
  });

  it("종료 시간이 시작 시간보다 빠르면 검증 실패 결과를 반환한다", async () => {
    const result = await createScheduleAction({
      ...validPayload,
      eventStartAt: "2026-08-10T10:00:00",
      eventEndAt: "2026-08-10T09:00:00",
    });

    expect(result).toEqual({ success: false, message: "종료 시간은 시작 시간보다 늦어야 해요." });
    expect(createSchedule).not.toHaveBeenCalled();
  });

  it("service 호출이 성공하면 생성된 id와 함께 성공 결과를 반환한다", async () => {
    (createSchedule as jest.Mock).mockResolvedValue(1);

    const result = await createScheduleAction(validPayload);

    expect(result).toEqual({ success: true, message: "일정이 등록되었습니다.", eventId: 1 });
  });

  it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
    (createSchedule as jest.Mock).mockRejectedValue(new Error("일정 생성에 실패하였습니다."));

    const result = await createScheduleAction(validPayload);

    expect(result).toEqual({ success: false, message: "일정 생성에 실패하였습니다." });
  });
});

describe("updateScheduleAction", () => {
  it("제목이 비어있으면 검증 실패 결과를 반환한다", async () => {
    const result = await updateScheduleAction(1, { ...validPayload, title: "" });

    expect(result).toEqual({ success: false, message: "일정 제목을 입력해주세요." });
    expect(updateSchedule).not.toHaveBeenCalled();
  });

  it("종료 시간이 시작 시간보다 빠르면 검증 실패 결과를 반환한다", async () => {
    const result = await updateScheduleAction(1, {
      ...validPayload,
      eventStartAt: "2026-08-10T10:00:00",
      eventEndAt: "2026-08-10T09:00:00",
    });

    expect(result).toEqual({ success: false, message: "종료 시간은 시작 시간보다 늦어야 해요." });
    expect(updateSchedule).not.toHaveBeenCalled();
  });

  it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
    (updateSchedule as jest.Mock).mockResolvedValue(undefined);

    const result = await updateScheduleAction(1, validPayload);

    expect(result).toEqual({ success: true, message: "일정이 수정되었습니다." });
  });

  it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
    (updateSchedule as jest.Mock).mockRejectedValue(new Error("일정 수정에 실패하였습니다."));

    const result = await updateScheduleAction(1, validPayload);

    expect(result).toEqual({ success: false, message: "일정 수정에 실패하였습니다." });
  });
});

describe("deleteScheduleAction", () => {
  it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
    (deleteSchedule as jest.Mock).mockResolvedValue(undefined);

    const result = await deleteScheduleAction(1);

    expect(result).toEqual({ success: true, message: "일정이 삭제되었습니다." });
  });

  it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
    (deleteSchedule as jest.Mock).mockRejectedValue(new Error("일정 삭제에 실패하였습니다."));

    const result = await deleteScheduleAction(1);

    expect(result).toEqual({ success: false, message: "일정 삭제에 실패하였습니다." });
  });
});
