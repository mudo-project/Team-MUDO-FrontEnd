import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import {
  checkGoogleConnectionAction,
  getGoogleAuthorizationUrlAction,
  getGoogleConnectionAction,
} from "../actions";
import SettingGoogleConnection from "./SettingGoogleConnection";

jest.mock("../actions", () => ({
  checkGoogleConnectionAction: jest.fn(),
  disconnectGoogleAction: jest.fn(),
  getGoogleAuthorizationUrlAction: jest.fn(),
  getGoogleConnectionAction: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

jest.mock("./SettingGoogleReplaceModal", () => {
  return function MockReplaceModal({ email }: { email: string }) {
    return <div data-testid="replace-modal">{email}</div>;
  };
});

jest.mock("./SettingGoogleDisconnectModal", () => {
  return function MockDisconnectModal({ email }: { email: string }) {
    return <div data-testid="disconnect-modal">{email}</div>;
  };
});

const mockedGetGoogleConnectionAction = getGoogleConnectionAction as jest.Mock;
const mockedGetGoogleAuthorizationUrlAction = getGoogleAuthorizationUrlAction as jest.Mock;
const mockedCheckGoogleConnectionAction = checkGoogleConnectionAction as jest.Mock;

const connectedData: GoogleConnectionData = {
  googleEmail: "academy@example.com",
  connectedByUserId: 1,
  connectedByUserName: "관리자",
  scope: "drive",
  connectedAt: "2026-08-01T00:00:00.000Z",
  refreshTokenExpiresAt: null,
  lastCheckedAt: "2026-08-01T00:00:00.000Z",
  status: "CONNECTED",
};

describe("SettingGoogleConnection", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("조회가 끝나기 전에는 스피너만 표시한다", () => {
    mockedGetGoogleConnectionAction.mockReturnValue(new Promise(() => {}));

    render(<SettingGoogleConnection />);

    expect(screen.queryByText("구글 계정 연동")).not.toBeInTheDocument();
  });

  it("연동된 계정이 없으면 미연동 안내와 연결 버튼을 표시한다", async () => {
    mockedGetGoogleConnectionAction.mockResolvedValue(null);

    render(<SettingGoogleConnection />);

    expect(await screen.findByText("연결된 구글 계정이 없습니다")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "구글 계정 연결" })).toBeInTheDocument();
  });

  it("연동된 계정이 있으면 상세 정보를 표시한다", async () => {
    mockedGetGoogleConnectionAction.mockResolvedValue(connectedData);

    render(<SettingGoogleConnection />);

    expect(await screen.findByText("academy@example.com")).toBeInTheDocument();
    expect(screen.getByText("연결됨")).toBeInTheDocument();
    expect(screen.getByText("관리자")).toBeInTheDocument();
  });

  it("EXPIRING 상태이면 갱신 필요 배너를 표시한다", async () => {
    mockedGetGoogleConnectionAction.mockResolvedValue({
      ...connectedData,
      status: "EXPIRING",
      refreshTokenExpiresAt: "2026-08-20T00:00:00.000Z",
    });

    render(<SettingGoogleConnection />);

    expect(await screen.findByText("계정 재연결을 진행해주세요")).toBeInTheDocument();
  });

  it("FAILED 상태이면 재연결 버튼을 표시한다", async () => {
    mockedGetGoogleConnectionAction.mockResolvedValue({ ...connectedData, status: "FAILED" });

    render(<SettingGoogleConnection />);

    await screen.findByText("academy@example.com");

    expect(screen.getByRole("button", { name: "재연결" })).toBeInTheDocument();
  });

  it("구글 계정 연결을 클릭하면 인가 URL을 발급받아 팝업을 연다", async () => {
    mockedGetGoogleConnectionAction.mockResolvedValue(null);
    mockedGetGoogleAuthorizationUrlAction.mockResolvedValue({
      success: true,
      message: "구글 인증 URL이 발급되었습니다.",
      authorizationUrl: "https://accounts.google.com/authorize",
    });
    const openSpy = jest.spyOn(window, "open").mockReturnValue({ closed: false } as Window);

    render(<SettingGoogleConnection />);
    await screen.findByRole("button", { name: "구글 계정 연결" });

    fireEvent.click(screen.getByRole("button", { name: "구글 계정 연결" }));

    await waitFor(() => {
      expect(openSpy).toHaveBeenCalledWith("https://accounts.google.com/authorize", "google-oauth", "width=520,height=650");
    });

    openSpy.mockRestore();
  });

  it("인가 URL 발급에 실패하면 에러 토스트를 표시한다", async () => {
    mockedGetGoogleConnectionAction.mockResolvedValue(null);
    mockedGetGoogleAuthorizationUrlAction.mockResolvedValue({
      success: false,
      message: "구글 인증 URL 발급에 실패하였습니다.",
    });
    const { toast } = jest.requireMock("sonner");

    render(<SettingGoogleConnection />);
    await screen.findByRole("button", { name: "구글 계정 연결" });

    fireEvent.click(screen.getByRole("button", { name: "구글 계정 연결" }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("구글 인증 URL 발급에 실패하였습니다.");
    });
  });

  it("연결 상태 확인을 클릭하면 확인 중 문구를 표시한다", async () => {
    mockedGetGoogleConnectionAction.mockResolvedValue(connectedData);
    mockedCheckGoogleConnectionAction.mockReturnValue(new Promise(() => {}));

    render(<SettingGoogleConnection />);
    await screen.findByText("academy@example.com");

    fireEvent.click(screen.getByRole("button", { name: "연결 상태 확인" }));

    expect(await screen.findByText("확인 중")).toBeInTheDocument();
  });

  it("계정 교체를 클릭하면 계정 교체 모달을 노출한다", async () => {
    mockedGetGoogleConnectionAction.mockResolvedValue(connectedData);

    render(<SettingGoogleConnection />);
    await screen.findByText("academy@example.com");

    fireEvent.click(screen.getByRole("button", { name: "계정 교체" }));

    expect(screen.getByTestId("replace-modal")).toBeInTheDocument();
  });

  it("연동 해제를 클릭하면 연동 해제 모달을 노출한다", async () => {
    mockedGetGoogleConnectionAction.mockResolvedValue(connectedData);

    render(<SettingGoogleConnection />);
    await screen.findByText("academy@example.com");

    fireEvent.click(screen.getByRole("button", { name: "연동 해제" }));

    expect(screen.getByTestId("disconnect-modal")).toBeInTheDocument();
  });
});
