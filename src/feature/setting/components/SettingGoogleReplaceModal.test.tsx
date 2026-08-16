import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { getGoogleAuthorizationUrlAction, getGoogleConnectionAction } from "../actions";
import SettingGoogleReplaceModal from "./SettingGoogleReplaceModal";

jest.mock("../actions", () => ({
  getGoogleAuthorizationUrlAction: jest.fn(),
  getGoogleConnectionAction: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

const mockedGetGoogleAuthorizationUrlAction = getGoogleAuthorizationUrlAction as jest.Mock;
const mockedGetGoogleConnectionAction = getGoogleConnectionAction as jest.Mock;

describe("SettingGoogleReplaceModal", () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it("1단계에서 기존 계정 이메일과 요청 권한 안내를 표시한다", () => {
    render(<SettingGoogleReplaceModal email="academy@example.com" onClose={jest.fn()} />);

    expect(screen.getByText("academy@example.com")).toBeInTheDocument();
    expect(screen.getByText("드라이브 파일 관리")).toBeInTheDocument();
  });

  it("취소를 클릭하면 onClose를 호출한다", () => {
    const onClose = jest.fn();
    render(<SettingGoogleReplaceModal email="academy@example.com" onClose={onClose} />);

    fireEvent.click(screen.getByRole("button", { name: "취소" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("동의하고 계속하기가 실패하면 1단계에 머무르고 에러 토스트를 표시한다", async () => {
    mockedGetGoogleAuthorizationUrlAction.mockResolvedValue({
      success: false,
      message: "구글 인증 URL 발급에 실패하였습니다.",
    });
    const { toast } = jest.requireMock("sonner");

    render(<SettingGoogleReplaceModal email="academy@example.com" onClose={jest.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "동의하고 계속하기" }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("구글 인증 URL 발급에 실패하였습니다.");
    });
    expect(screen.getByRole("button", { name: "동의하고 계속하기" })).toBeInTheDocument();
  });

  it("동의하고 계속하기가 성공하면 팝업을 열고 2단계로 이동한다", async () => {
    mockedGetGoogleAuthorizationUrlAction.mockResolvedValue({
      success: true,
      message: "구글 인증 URL이 발급되었습니다.",
      authorizationUrl: "https://accounts.google.com/authorize",
    });
    const openSpy = jest.spyOn(window, "open").mockReturnValue({ closed: false } as Window);

    render(<SettingGoogleReplaceModal email="academy@example.com" onClose={jest.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "동의하고 계속하기" }));

    expect(await screen.findByText("구글 로그인 창에서 계속 진행해주세요")).toBeInTheDocument();
    expect(openSpy).toHaveBeenCalledWith("https://accounts.google.com/authorize", "google-oauth", "width=520,height=650");

    openSpy.mockRestore();
  });

  it("팝업이 닫히면 연동 결과를 조회해 3단계 성공 화면으로 이동한다", async () => {
    jest.useFakeTimers();
    mockedGetGoogleAuthorizationUrlAction.mockResolvedValue({
      success: true,
      message: "구글 인증 URL이 발급되었습니다.",
      authorizationUrl: "https://accounts.google.com/authorize",
    });
    mockedGetGoogleConnectionAction.mockResolvedValue({
      googleEmail: "new-account@example.com",
      connectedByUserId: 1,
      connectedByUserName: "관리자",
      scope: "drive",
      connectedAt: "2026-08-01T00:00:00.000Z",
      refreshTokenExpiresAt: null,
      lastCheckedAt: "2026-08-01T00:00:00.000Z",
      status: "CONNECTED",
    });

    const popup = { closed: false } as Window;
    jest.spyOn(window, "open").mockReturnValue(popup);

    render(<SettingGoogleReplaceModal email="academy@example.com" onClose={jest.fn()} />);

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "동의하고 계속하기" }));
    });

    (popup as { closed: boolean }).closed = true;

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    expect(await screen.findByText(/new-account@example.com/)).toBeInTheDocument();
    expect(screen.getByText(/계정이 연결되었습니다/)).toBeInTheDocument();
  });
});
