import { render, screen } from "@testing-library/react";
import { useUserStore } from "@/store/useUserStore";
import SettingPayday from "./SettingPayday";

describe("SettingPayday", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("PAYROLL:MANAGE 권한이 없으면 카드를 노출하지 않는다", () => {
    useUserStore.setState({ permissions: [] });

    const { container } = render(<SettingPayday />);

    expect(container).toBeEmptyDOMElement();
  });

  it("PAYROLL:MANAGE 권한이 있으면 카드를 노출한다", () => {
    useUserStore.setState({ permissions: ["PAYROLL:MANAGE"] });

    render(<SettingPayday />);

    expect(screen.getByText("급여 지급일 설정")).toBeInTheDocument();
  });
});
