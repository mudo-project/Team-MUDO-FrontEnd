import { fireEvent, render, screen } from "@testing-library/react";
import SettingGoogleDisconnectModal from "./SettingGoogleDisconnectModal";

describe("SettingGoogleDisconnectModal", () => {
  it("확인 문구를 입력하지 않으면 연동 해제 버튼이 비활성화된다", () => {
    render(<SettingGoogleDisconnectModal email="academy@example.com" onClose={jest.fn()} onConfirm={jest.fn()} />);

    expect(screen.getByRole("button", { name: "연동 해제" })).toBeDisabled();
  });

  it("확인 문구를 정확히 입력하면 연동 해제 버튼이 활성화된다", () => {
    render(<SettingGoogleDisconnectModal email="academy@example.com" onClose={jest.fn()} onConfirm={jest.fn()} />);

    fireEvent.change(screen.getByLabelText(/해제를 입력하세요/), { target: { value: "해제" } });

    expect(screen.getByRole("button", { name: "연동 해제" })).toBeEnabled();
  });

  it("잘못된 문구를 입력하면 연동 해제 버튼이 비활성화 상태를 유지한다", () => {
    render(<SettingGoogleDisconnectModal email="academy@example.com" onClose={jest.fn()} onConfirm={jest.fn()} />);

    fireEvent.change(screen.getByLabelText(/해제를 입력하세요/), { target: { value: "취소" } });

    expect(screen.getByRole("button", { name: "연동 해제" })).toBeDisabled();
  });

  it("연동 해제 버튼을 클릭하면 onConfirm을 호출한다", () => {
    const onConfirm = jest.fn();
    render(<SettingGoogleDisconnectModal email="academy@example.com" onClose={jest.fn()} onConfirm={onConfirm} />);

    fireEvent.change(screen.getByLabelText(/해제를 입력하세요/), { target: { value: "해제" } });
    fireEvent.click(screen.getByRole("button", { name: "연동 해제" }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("취소를 클릭하면 onClose를 호출한다", () => {
    const onClose = jest.fn();
    render(<SettingGoogleDisconnectModal email="academy@example.com" onClose={onClose} onConfirm={jest.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "취소" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
