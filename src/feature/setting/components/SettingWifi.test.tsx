import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import {
  createWifiIpAction,
  deleteWifiIpAction,
  getCurrentIpAction,
  getWifiIpListAction,
} from "../actions";
import SettingWifi from "./SettingWifi";

jest.mock("../actions", () => ({
  createWifiIpAction: jest.fn(),
  deleteWifiIpAction: jest.fn(),
  getCurrentIpAction: jest.fn(),
  getWifiIpListAction: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

const mockedGetWifiIpListAction = getWifiIpListAction as jest.Mock;
const mockedGetCurrentIpAction = getCurrentIpAction as jest.Mock;
const mockedCreateWifiIpAction = createWifiIpAction as jest.Mock;
const mockedDeleteWifiIpAction = deleteWifiIpAction as jest.Mock;

describe("SettingWifi", () => {
  beforeEach(() => {
    mockedGetWifiIpListAction.mockResolvedValue([]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("마운트 시 등록된 와이파이 IP 목록을 조회해 표시한다", async () => {
    mockedGetWifiIpListAction.mockResolvedValue([
      { wifiIpId: 1, ipAddress: "192.168.0.1", note: "", createdAt: "2026-08-01T00:00:00.000Z" },
    ]);

    render(<SettingWifi />);

    expect(await screen.findByText("192.168.0.1")).toBeInTheDocument();
  });

  it("내 IP 확인을 클릭하면 조회 결과와 이 IP로 등록 버튼을 노출한다", async () => {
    mockedGetCurrentIpAction.mockResolvedValue("123.45.67.89");

    render(<SettingWifi />);

    fireEvent.click(screen.getByRole("button", { name: "내 IP 확인" }));

    expect(await screen.findByText("123.45.67.89")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "이 IP로 등록" })).toBeInTheDocument();
  });

  it("이 IP로 등록을 클릭하면 입력창에 확인된 IP가 채워진다", async () => {
    mockedGetCurrentIpAction.mockResolvedValue("123.45.67.89");

    render(<SettingWifi />);

    fireEvent.click(screen.getByRole("button", { name: "내 IP 확인" }));
    await screen.findByText("123.45.67.89");
    fireEvent.click(screen.getByRole("button", { name: "이 IP로 등록" }));

    expect(screen.getByLabelText("와이파이 IP 주소")).toHaveValue("123.45.67.89");
  });

  it("이미 등록된 IP를 입력하면 저장 버튼이 등록됨으로 바뀌고 비활성화된다", async () => {
    mockedGetWifiIpListAction.mockResolvedValue([
      { wifiIpId: 1, ipAddress: "192.168.0.1", note: "", createdAt: "2026-08-01T00:00:00.000Z" },
    ]);

    render(<SettingWifi />);
    await screen.findByText("192.168.0.1");

    fireEvent.change(screen.getByLabelText("와이파이 IP 주소"), { target: { value: "192.168.0.1" } });

    const saveButton = screen.getByRole("button", { name: "등록됨" });
    expect(saveButton).toBeDisabled();
  });

  it("등록된 IP 항목의 삭제 아이콘을 클릭하면 삭제 액션을 호출한다", async () => {
    mockedGetWifiIpListAction.mockResolvedValue([
      { wifiIpId: 1, ipAddress: "192.168.0.1", note: "", createdAt: "2026-08-01T00:00:00.000Z" },
    ]);
    mockedDeleteWifiIpAction.mockResolvedValue({ success: true, message: "와이파이 IP가 삭제되었습니다." });

    render(<SettingWifi />);
    await screen.findByText("192.168.0.1");

    fireEvent.click(screen.getByRole("button", { name: "192.168.0.1 삭제" }));

    await waitFor(() => {
      expect(mockedDeleteWifiIpAction).toHaveBeenCalledWith(1);
    });
  });

  it("저장이 성공하면 목록을 다시 조회한다", async () => {
    mockedCreateWifiIpAction.mockResolvedValue({ success: true, message: "와이파이 IP가 등록되었습니다." });

    render(<SettingWifi />);
    await waitFor(() => expect(mockedGetWifiIpListAction).toHaveBeenCalledTimes(1));

    fireEvent.change(screen.getByLabelText("와이파이 IP 주소"), { target: { value: "10.0.0.1" } });
    fireEvent.click(screen.getByRole("button", { name: "저장" }));

    await waitFor(() => {
      expect(mockedGetWifiIpListAction).toHaveBeenCalledTimes(2);
    });
  });
});
