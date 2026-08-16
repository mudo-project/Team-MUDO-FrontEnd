import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ClassRegistrationModal from "./ClassRegistrationModal";
import type { ClassRegistrationFormValues } from "@/lib/classRegistrationSchema";

const defaultValues: ClassRegistrationFormValues = {
  day: "월",
  room: "101",
  startTime: "09:00",
  endTime: "11:00",
  grade: "HIGH_3",
  teacher: "최T",
  course: "공통미적",
  color: "90A9C6",
};

const getAvailableRooms = (day: string) => (day === "월" ? ["101", "102"] : ["201"]);

describe("ClassRegistrationModal", () => {
  it("취소를 클릭하면 onClose를 호출한다", () => {
    const onClose = jest.fn();

    render(
      <ClassRegistrationModal
        defaultValues={defaultValues}
        getAvailableRooms={getAvailableRooms}
        onClose={onClose}
        onSubmit={jest.fn()}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "취소" }));

    expect(onClose).toHaveBeenCalled();
  });

  it("닫기 아이콘을 클릭하면 onClose를 호출한다", () => {
    const onClose = jest.fn();

    render(
      <ClassRegistrationModal
        defaultValues={defaultValues}
        getAvailableRooms={getAvailableRooms}
        onClose={onClose}
        onSubmit={jest.fn()}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "수업 등록 닫기" }));

    expect(onClose).toHaveBeenCalled();
  });

  it("요일을 변경하면 해당 요일의 강의실 목록으로 바뀌고 강의실 선택은 초기화된다", () => {
    render(
      <ClassRegistrationModal
        defaultValues={defaultValues}
        getAvailableRooms={getAvailableRooms}
        onClose={jest.fn()}
        onSubmit={jest.fn()}
      />
    );

    fireEvent.change(screen.getByLabelText("수업 요일"), { target: { value: "화" } });

    expect(screen.getByRole("option", { name: "201" })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "101" })).not.toBeInTheDocument();
  });

  it("필수 값을 모두 채우고 등록을 클릭하면 onSubmit이 호출된다", async () => {
    const onSubmit = jest.fn();

    render(
      <ClassRegistrationModal
        defaultValues={defaultValues}
        getAvailableRooms={getAvailableRooms}
        onClose={jest.fn()}
        onSubmit={onSubmit}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "등록" }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0][0]).toEqual(defaultValues);
  });

  it("강의실을 선택하지 않고 등록하면 에러 메시지를 노출한다", async () => {
    const onSubmit = jest.fn();

    render(
      <ClassRegistrationModal
        defaultValues={{ ...defaultValues, room: "" }}
        getAvailableRooms={getAvailableRooms}
        onClose={jest.fn()}
        onSubmit={onSubmit}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "등록" }));

    expect(await screen.findByText("강의실을 선택해주세요.")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("등록 중일 때는 등록 버튼이 비활성화되고 등록 중 문구를 표시한다", () => {
    render(
      <ClassRegistrationModal
        defaultValues={defaultValues}
        getAvailableRooms={getAvailableRooms}
        isSubmitting
        onClose={jest.fn()}
        onSubmit={jest.fn()}
      />
    );

    expect(screen.getByRole("button", { name: "등록 중..." })).toBeDisabled();
  });
});
