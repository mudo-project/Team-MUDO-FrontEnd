import { fireEvent, render, screen } from "@testing-library/react";
import NewTimetableStepModal from "./NewTimetableStepModal";
import type { FloorConfig } from "@/feature/timetable/viewModel";
import type { NewTimetableBasicInfoFormValues } from "@/lib/newTimetableBasicInfoSchema";

const form: NewTimetableBasicInfoFormValues = { name: "", startDate: "", endDate: "" };
const floors: FloorConfig[] = [{ floor: "1층", rooms: ["101"] }];

const baseProps = {
  floors,
  form,
  newRoomNames: {},
  onAddFloor: jest.fn(),
  onAddRoom: jest.fn(),
  onBasicInfoValidityChange: jest.fn(),
  onChangeForm: jest.fn(),
  onChangeNewRoomName: jest.fn(),
  onChangeSlot: jest.fn(),
  onClose: jest.fn(),
  onComplete: jest.fn(),
  onNext: jest.fn(),
  onPrev: jest.fn(),
  onRemoveRoom: jest.fn(),
  onRenameFloor: jest.fn(),
  onSelectTemplateOption: jest.fn(),
  selectedTemplateOption: null,
  slot: 30 as const,
};

describe("NewTimetableStepModal", () => {
  it("1단계에서는 기본 정보 폼을 보여주고 이전 버튼이 없다", () => {
    render(<NewTimetableStepModal {...baseProps} isBasicInfoComplete={false} step={1} />);

    expect(screen.getByLabelText("시간표 이름")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "이전" })).not.toBeInTheDocument();
  });

  it("1단계에서 기본 정보가 완료되지 않으면 다음 버튼이 비활성화된다", () => {
    render(<NewTimetableStepModal {...baseProps} isBasicInfoComplete={false} step={1} />);

    expect(screen.getByRole("button", { name: "다음" })).toBeDisabled();
  });

  it("1단계에서 기본 정보가 완료되면 다음 버튼이 활성화된다", () => {
    render(<NewTimetableStepModal {...baseProps} isBasicInfoComplete step={1} />);

    expect(screen.getByRole("button", { name: "다음" })).toBeEnabled();
  });

  it("2단계에서는 템플릿 선택 단계를 보여주고, 옵션을 고르지 않으면 다음 버튼이 비활성화된다", () => {
    render(<NewTimetableStepModal {...baseProps} isBasicInfoComplete step={2} />);

    expect(screen.getByRole("button", { name: "빈 시간표로 시작" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "다음" })).toBeDisabled();
  });

  it("3단계에서는 강의실 설정 단계를 보여주고 완료 버튼을 노출한다", () => {
    render(<NewTimetableStepModal {...baseProps} isBasicInfoComplete selectedTemplateOption="empty" step={3} />);

    expect(screen.getByText("+ 층 추가")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "완료" })).toBeInTheDocument();
  });

  it("이전을 클릭하면 onPrev를 호출한다", () => {
    const onPrev = jest.fn();

    render(<NewTimetableStepModal {...baseProps} isBasicInfoComplete onPrev={onPrev} step={2} />);

    fireEvent.click(screen.getByRole("button", { name: "이전" }));

    expect(onPrev).toHaveBeenCalled();
  });

  it("완료가 저장 중이면 버튼이 비활성화되고 저장 중 문구를 표시한다", () => {
    render(
      <NewTimetableStepModal
        {...baseProps}
        isBasicInfoComplete
        isSubmitting
        selectedTemplateOption="empty"
        step={3}
      />
    );

    expect(screen.getByRole("button", { name: "저장 중..." })).toBeDisabled();
  });

  it("닫기 아이콘을 클릭하면 onClose를 호출한다", () => {
    const onClose = jest.fn();

    render(<NewTimetableStepModal {...baseProps} isBasicInfoComplete onClose={onClose} step={1} />);

    fireEvent.click(screen.getByRole("button", { name: "새 시간표 만들기 닫기" }));

    expect(onClose).toHaveBeenCalled();
  });
});
