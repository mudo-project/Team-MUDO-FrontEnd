import { act, renderHook } from "@testing-library/react";
import { useNewTimetableWizard } from "./useNewTimetableWizard";
import type { FloorConfig } from "@/feature/timetable/viewModel";

const activeClassroomGroups: FloorConfig[] = [{ floor: "1층", rooms: ["101", "102"] }];

describe("useNewTimetableWizard", () => {
  it("open을 호출하면 1단계로 열리고 기본 5개 층이 채워진다", () => {
    const { result } = renderHook(() => useNewTimetableWizard({ activeClassroomGroups, onFinish: jest.fn() }));

    act(() => result.current.open());

    expect(result.current.step).toBe(1);
    expect(result.current.floors).toHaveLength(5);
    expect(result.current.floors[0]).toEqual({ floor: "1층", rooms: ["101"] });
  });

  it("startEdit을 호출하면 기존 템플릿 값으로 채워지고 이전 템플릿 옵션이 선택된다", () => {
    const { result } = renderHook(() => useNewTimetableWizard({ activeClassroomGroups, onFinish: jest.fn() }));

    const detail: TimetableSetDetailData = {
      timetableSetId: 5,
      name: "2026 여름특강",
      startDate: "2026-08-01",
      endDate: "2026-08-31",
      operatingStartTime: "09:00",
      operatingEndTime: "21:00",
      operatingDays: ["MONDAY"],
      slotUnitMinutes: 60,
      classrooms: [{ floor: "1층", codes: ["101"] }],
      status: "ACTIVE",
    };

    act(() => result.current.startEdit(detail));

    expect(result.current.step).toBe(1);
    expect(result.current.form).toEqual({ name: "2026 여름특강", startDate: "2026-08-01", endDate: "2026-08-31" });
    expect(result.current.slot).toBe(60);
    expect(result.current.selectedTemplateOption).toBe("previous");
  });

  it("goToNextStep/goToPrevStep으로 1↔2↔3단계를 이동한다", () => {
    const { result } = renderHook(() => useNewTimetableWizard({ activeClassroomGroups, onFinish: jest.fn() }));

    act(() => result.current.open());
    act(() => result.current.goToNextStep());
    expect(result.current.step).toBe(2);

    act(() => result.current.goToNextStep());
    expect(result.current.step).toBe(3);

    act(() => result.current.goToPrevStep());
    expect(result.current.step).toBe(2);
  });

  it("빈 시간표로 시작을 선택하면 기본 5개 층으로, 이전 템플릿 불러오기를 선택하면 현재 강의실 구성으로 채워진다", () => {
    const { result } = renderHook(() => useNewTimetableWizard({ activeClassroomGroups, onFinish: jest.fn() }));

    act(() => result.current.selectTemplateOption("previous"));
    expect(result.current.floors).toEqual([{ floor: "1층", rooms: ["101", "102"] }]);

    act(() => result.current.selectTemplateOption("empty"));
    expect(result.current.floors).toHaveLength(5);
  });

  it("층을 추가하면 다음 번호의 층이 뒤에 붙는다", () => {
    const { result } = renderHook(() => useNewTimetableWizard({ activeClassroomGroups, onFinish: jest.fn() }));

    act(() => result.current.selectTemplateOption("previous"));
    act(() => result.current.addFloor());

    expect(result.current.floors).toEqual([
      { floor: "1층", rooms: ["101", "102"] },
      { floor: "2층", rooms: ["201"] },
    ]);
  });

  it("중복된 호실명은 추가되지 않는다", () => {
    const { result } = renderHook(() => useNewTimetableWizard({ activeClassroomGroups, onFinish: jest.fn() }));

    act(() => result.current.selectTemplateOption("previous"));
    act(() => result.current.changeNewRoomName(0, "101"));
    act(() => result.current.addRoom(0));

    expect(result.current.floors[0].rooms).toEqual(["101", "102"]);
  });

  it("새 호실명을 추가하면 층에 반영되고 입력값은 초기화된다", () => {
    const { result } = renderHook(() => useNewTimetableWizard({ activeClassroomGroups, onFinish: jest.fn() }));

    act(() => result.current.selectTemplateOption("previous"));
    act(() => result.current.changeNewRoomName(0, "103"));
    act(() => result.current.addRoom(0));

    expect(result.current.floors[0].rooms).toEqual(["101", "102", "103"]);
    expect(result.current.newRoomNames[0]).toBe("");
  });

  it("호실을 제거하면 해당 층 목록에서 사라진다", () => {
    const { result } = renderHook(() => useNewTimetableWizard({ activeClassroomGroups, onFinish: jest.fn() }));

    act(() => result.current.selectTemplateOption("previous"));
    act(() => result.current.removeRoom(0, "101"));

    expect(result.current.floors[0].rooms).toEqual(["102"]);
  });

  it("finish를 호출하면 현재 폼·슬롯·강의실 구성으로 onFinish를 호출한다", () => {
    const onFinish = jest.fn();
    const { result } = renderHook(() => useNewTimetableWizard({ activeClassroomGroups, onFinish }));

    act(() => result.current.open());
    act(() => result.current.changeForm({ name: "2026 여름특강", startDate: "2026-08-01", endDate: "2026-08-31" }));
    act(() => result.current.changeSlot(10));
    act(() => result.current.finish());

    expect(onFinish).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "2026 여름특강",
        startDate: "2026-08-01",
        endDate: "2026-08-31",
        slotUnitMinutes: 10,
      }),
      null
    );
  });

  it("close를 호출하면 step이 null이 된다", () => {
    const { result } = renderHook(() => useNewTimetableWizard({ activeClassroomGroups, onFinish: jest.fn() }));

    act(() => result.current.open());
    act(() => result.current.close());

    expect(result.current.step).toBeNull();
  });
});
