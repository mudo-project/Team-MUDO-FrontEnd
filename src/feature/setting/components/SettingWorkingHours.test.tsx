import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useUserStore } from "@/store/useUserStore";
import { saveWorkingHoursPolicyAction } from "../actions";
import SettingWorkingHours from "./SettingWorkingHours";

jest.mock("../actions", () => ({
  saveWorkingHoursPolicyAction: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

const mockedSaveWorkingHoursPolicyAction = saveWorkingHoursPolicyAction as jest.Mock;

describe("SettingWorkingHours", () => {
  beforeEach(() => {
    useUserStore.setState({ permissions: ["ATTENDANCE:POLICY_MANAGE"] });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("ATTENDANCE:POLICY_MANAGE 권한이 없으면 카드를 노출하지 않는다", () => {
    useUserStore.setState({ permissions: [] });

    const { container } = render(<SettingWorkingHours />);

    expect(container).toBeEmptyDOMElement();
  });

  it("지각 유예는 0분 미만, 60분 초과로 내려가거나 올라가지 않는다", () => {
    render(<SettingWorkingHours />);

    const decreaseButton = screen.getByRole("button", { name: "지각 유예 시간 감소" });
    const increaseButton = screen.getByRole("button", { name: "지각 유예 시간 증가" });

    fireEvent.click(decreaseButton);
    expect(screen.getByText("0")).toBeInTheDocument();
    expect(decreaseButton).toBeDisabled();

    for (let i = 0; i < 6; i++) {
      fireEvent.click(increaseButton);
    }

    expect(screen.getByText("60")).toBeInTheDocument();
    expect(increaseButton).toBeDisabled();
  });

  it("요일별 예외 토글을 켜면 요일 목록이 노출된다", () => {
    render(<SettingWorkingHours />);

    expect(screen.queryByText("휴무")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("checkbox", { name: "요일별 예외 사용" }));

    expect(screen.getAllByText("휴무").length).toBeGreaterThan(0);
  });

  it("요일별 예외에서 휴무 요일을 근무로 전환하면 휴무 표시가 하나 줄어든다", () => {
    render(<SettingWorkingHours />);

    fireEvent.click(screen.getByRole("checkbox", { name: "요일별 예외 사용" }));
    expect(screen.getAllByText("휴무")).toHaveLength(2);

    fireEvent.click(screen.getByRole("checkbox", { name: "일요일 근무 여부" }));

    expect(screen.getAllByText("휴무")).toHaveLength(1);
  });

  it("저장이 성공하면 성공 토스트를 노출한다", async () => {
    mockedSaveWorkingHoursPolicyAction.mockResolvedValue({
      success: true,
      message: "근무시간 정책이 저장되었습니다.",
    });
    const { toast } = jest.requireMock("sonner");

    render(<SettingWorkingHours />);

    fireEvent.click(screen.getByRole("button", { name: "저장" }));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("근무시간 정책이 저장되었습니다.");
    });
  });

  it("저장이 실패하면 실패 토스트를 노출한다", async () => {
    mockedSaveWorkingHoursPolicyAction.mockResolvedValue({
      success: false,
      message: "근무시간 정책 저장에 실패하였습니다.",
    });
    const { toast } = jest.requireMock("sonner");

    render(<SettingWorkingHours />);

    fireEvent.click(screen.getByRole("button", { name: "저장" }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("근무시간 정책 저장에 실패하였습니다.");
    });
  });
});
