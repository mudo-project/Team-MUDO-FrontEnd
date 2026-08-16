import { fireEvent, render, screen } from "@testing-library/react";
import NewTimetableRoomSetupStep from "./NewTimetableRoomSetupStep";
import type { FloorConfig } from "@/feature/timetable/viewModel";

const floors: FloorConfig[] = [{ floor: "1층", rooms: ["101"] }];

describe("NewTimetableRoomSetupStep", () => {
  it("층·강의실 구성과 미리보기를 표시한다", () => {
    render(
      <NewTimetableRoomSetupStep
        floors={floors}
        newRoomNames={{}}
        onAddFloor={jest.fn()}
        onAddRoom={jest.fn()}
        onChangeNewRoomName={jest.fn()}
        onRemoveRoom={jest.fn()}
      />
    );

    expect(screen.getAllByText("1층").length).toBeGreaterThan(0);
    expect(screen.getAllByText("101").length).toBeGreaterThan(0);
    expect(screen.getByText("총 1개 강의실")).toBeInTheDocument();
  });

  it("호실 이름을 입력하면 onChangeNewRoomName을 호출한다", () => {
    const onChangeNewRoomName = jest.fn();

    render(
      <NewTimetableRoomSetupStep
        floors={floors}
        newRoomNames={{}}
        onAddFloor={jest.fn()}
        onAddRoom={jest.fn()}
        onChangeNewRoomName={onChangeNewRoomName}
        onRemoveRoom={jest.fn()}
      />
    );

    fireEvent.change(screen.getByLabelText("1층 호실 이름"), { target: { value: "102" } });

    expect(onChangeNewRoomName).toHaveBeenCalledWith(0, "102");
  });

  it("입력값이 비어있으면 호수 추가 버튼이 비활성화된다", () => {
    render(
      <NewTimetableRoomSetupStep
        floors={floors}
        newRoomNames={{}}
        onAddFloor={jest.fn()}
        onAddRoom={jest.fn()}
        onChangeNewRoomName={jest.fn()}
        onRemoveRoom={jest.fn()}
      />
    );

    expect(screen.getByRole("button", { name: "+ 호수 추가" })).toBeDisabled();
  });

  it("이미 추가된 호실명을 입력하면 중복 안내와 함께 추가 버튼이 비활성화된다", () => {
    render(
      <NewTimetableRoomSetupStep
        floors={floors}
        newRoomNames={{ 0: "101" }}
        onAddFloor={jest.fn()}
        onAddRoom={jest.fn()}
        onChangeNewRoomName={jest.fn()}
        onRemoveRoom={jest.fn()}
      />
    );

    expect(screen.getByText("이미 추가된 호실입니다.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "+ 호수 추가" })).toBeDisabled();
  });

  it("새 호실명을 입력하고 추가 버튼을 클릭하면 onAddRoom을 호출한다", () => {
    const onAddRoom = jest.fn();

    render(
      <NewTimetableRoomSetupStep
        floors={floors}
        newRoomNames={{ 0: "102" }}
        onAddFloor={jest.fn()}
        onAddRoom={onAddRoom}
        onChangeNewRoomName={jest.fn()}
        onRemoveRoom={jest.fn()}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "+ 호수 추가" }));

    expect(onAddRoom).toHaveBeenCalledWith(0);
  });

  it("호실 제거 버튼을 클릭하면 onRemoveRoom을 호출한다", () => {
    const onRemoveRoom = jest.fn();

    render(
      <NewTimetableRoomSetupStep
        floors={floors}
        newRoomNames={{}}
        onAddFloor={jest.fn()}
        onAddRoom={jest.fn()}
        onChangeNewRoomName={jest.fn()}
        onRemoveRoom={onRemoveRoom}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "101 제거" }));

    expect(onRemoveRoom).toHaveBeenCalledWith(0, "101");
  });

  it("층 추가 버튼을 클릭하면 onAddFloor를 호출한다", () => {
    const onAddFloor = jest.fn();

    render(
      <NewTimetableRoomSetupStep
        floors={floors}
        newRoomNames={{}}
        onAddFloor={onAddFloor}
        onAddRoom={jest.fn()}
        onChangeNewRoomName={jest.fn()}
        onRemoveRoom={jest.fn()}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "+ 층 추가" }));

    expect(onAddFloor).toHaveBeenCalled();
  });
});
