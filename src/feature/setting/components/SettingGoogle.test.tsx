import { render, screen } from "@testing-library/react";
import { useUserStore } from "@/store/useUserStore";
import { getGoogleConnectionAction } from "../actions";
import SettingGoogle from "./SettingGoogle";

jest.mock("../actions", () => ({
  getGoogleConnectionAction: jest.fn(),
}));

const mockedGetGoogleConnectionAction = getGoogleConnectionAction as jest.Mock;

describe("SettingGoogle", () => {
  beforeEach(() => {
    useUserStore.setState({ permissions: ["SHAREDFILE:MANAGE"] });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("SHAREDFILE:MANAGE 권한이 없으면 카드를 노출하지 않는다", () => {
    useUserStore.setState({ permissions: [] });

    const { container } = render(<SettingGoogle />);

    expect(container).toBeEmptyDOMElement();
  });

  it("연동된 계정이 없으면 연결되지 않음 배지를 표시한다", async () => {
    mockedGetGoogleConnectionAction.mockResolvedValue(null);

    render(<SettingGoogle />);

    expect(await screen.findByText("연결되지 않음")).toBeInTheDocument();
  });

  it("연동 상태가 CONNECTED이면 연결됨 배지를 표시한다", async () => {
    mockedGetGoogleConnectionAction.mockResolvedValue({
      googleEmail: "academy@example.com",
      connectedByUserId: 1,
      connectedByUserName: "관리자",
      scope: "drive",
      connectedAt: "2026-08-01T00:00:00.000Z",
      refreshTokenExpiresAt: null,
      lastCheckedAt: "2026-08-01T00:00:00.000Z",
      status: "CONNECTED",
    });

    render(<SettingGoogle />);

    expect(await screen.findByText("연결됨")).toBeInTheDocument();
  });

  it("조회에 실패하면 연결되지 않음 배지를 표시한다", async () => {
    mockedGetGoogleConnectionAction.mockRejectedValue(new Error("network error"));

    render(<SettingGoogle />);

    expect(await screen.findByText("연결되지 않음")).toBeInTheDocument();
  });
});
