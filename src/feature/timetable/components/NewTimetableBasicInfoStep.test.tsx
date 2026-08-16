import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import NewTimetableBasicInfoStep from "./NewTimetableBasicInfoStep";
import type { NewTimetableBasicInfoFormValues } from "@/lib/newTimetableBasicInfoSchema";

const emptyForm: NewTimetableBasicInfoFormValues = { name: "", startDate: "", endDate: "" };

describe("NewTimetableBasicInfoStep", () => {
  it("이름을 입력하면 onChangeForm으로 값을 올려준다", () => {
    const onChangeForm = jest.fn();

    render(
      <NewTimetableBasicInfoStep
        form={emptyForm}
        onChangeForm={onChangeForm}
        onChangeSlot={jest.fn()}
        onValidityChange={jest.fn()}
        slot={30}
      />
    );

    fireEvent.change(screen.getByLabelText("시간표 이름"), { target: { value: "2026 여름특강" } });

    expect(onChangeForm).toHaveBeenCalledWith({ name: "2026 여름특강" });
  });

  it("필수 값이 모두 채워지면 onValidityChange(true)를 호출한다", async () => {
    const onValidityChange = jest.fn();

    render(
      <NewTimetableBasicInfoStep
        form={{ name: "2026 여름특강", startDate: "2026-08-01", endDate: "2026-08-31" }}
        onChangeForm={jest.fn()}
        onChangeSlot={jest.fn()}
        onValidityChange={onValidityChange}
        slot={30}
      />
    );

    await waitFor(() => expect(onValidityChange).toHaveBeenCalledWith(true));
  });

  it("이름이 비어있으면 onValidityChange(false)를 호출한다", async () => {
    const onValidityChange = jest.fn();

    render(
      <NewTimetableBasicInfoStep
        form={emptyForm}
        onChangeForm={jest.fn()}
        onChangeSlot={jest.fn()}
        onValidityChange={onValidityChange}
        slot={30}
      />
    );

    await waitFor(() => expect(onValidityChange).toHaveBeenCalledWith(false));
  });

  it("종료일이 시작일보다 빠르면 에러 메시지를 노출한다", async () => {
    render(
      <NewTimetableBasicInfoStep
        form={{ name: "2026 여름특강", startDate: "2026-08-31", endDate: "2026-08-01" }}
        onChangeForm={jest.fn()}
        onChangeSlot={jest.fn()}
        onValidityChange={jest.fn()}
        slot={30}
      />
    );

    fireEvent.change(screen.getByLabelText("종료일"), { target: { value: "2026-07-01" } });

    expect(await screen.findByText("종료일은 시작일보다 빠를 수 없어요.")).toBeInTheDocument();
  });

  it("슬롯 단위를 선택하면 onChangeSlot을 호출한다", () => {
    const onChangeSlot = jest.fn();

    render(
      <NewTimetableBasicInfoStep
        form={emptyForm}
        onChangeForm={jest.fn()}
        onChangeSlot={onChangeSlot}
        onValidityChange={jest.fn()}
        slot={30}
      />
    );

    fireEvent.click(screen.getByRole("radio", { name: "10분" }));

    expect(onChangeSlot).toHaveBeenCalledWith(10);
  });
});
