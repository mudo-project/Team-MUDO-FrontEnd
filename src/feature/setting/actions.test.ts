import {
  checkGoogleConnection,
  createWifiIp,
  deleteWifiIp,
  disconnectGoogle,
  getGoogleAuthorizationUrl,
  saveWorkingHours,
} from "@/service/setting.service";
import {
  checkGoogleConnectionAction,
  createWifiIpAction,
  deleteWifiIpAction,
  disconnectGoogleAction,
  getGoogleAuthorizationUrlAction,
  saveWorkingHoursPolicyAction,
} from "./actions";

jest.mock("../../service/setting.service");

afterEach(() => jest.clearAllMocks());

describe("createWifiIpAction", () => {
  it("등록할 IP 주소가 비어있으면 검증 실패 결과를 반환한다", async () => {
    const result = await createWifiIpAction("   ", "");

    expect(result).toEqual({ success: false, message: "등록할 IP 주소를 입력해주세요." });
    expect(createWifiIp).not.toHaveBeenCalled();
  });

  it("service 호출이 성공하면 등록된 id와 함께 성공 결과를 반환한다", async () => {
    (createWifiIp as jest.Mock).mockResolvedValue({ wifiIpId: 1, ipAddress: "123.45.67.89", note: "" });

    const result = await createWifiIpAction("123.45.67.89", "");

    expect(createWifiIp).toHaveBeenCalledWith({ confirmedIpAddress: "123.45.67.89", note: "" });
    expect(result).toEqual({ success: true, message: "와이파이 IP가 등록되었습니다.", wifiIpId: 1 });
  });

  it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
    (createWifiIp as jest.Mock).mockRejectedValue(new Error("이미 등록된 IP입니다."));

    const result = await createWifiIpAction("123.45.67.89", "");

    expect(result).toEqual({ success: false, message: "이미 등록된 IP입니다." });
  });
});

describe("deleteWifiIpAction", () => {
  it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
    (deleteWifiIp as jest.Mock).mockResolvedValue(undefined);

    const result = await deleteWifiIpAction(1);

    expect(deleteWifiIp).toHaveBeenCalledWith(1);
    expect(result).toEqual({ success: true, message: "와이파이 IP가 삭제되었습니다." });
  });

  it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
    (deleteWifiIp as jest.Mock).mockRejectedValue(new Error("삭제 실패"));

    const result = await deleteWifiIpAction(1);

    expect(result).toEqual({ success: false, message: "삭제 실패" });
  });
});

describe("getGoogleAuthorizationUrlAction", () => {
  it("service 호출이 성공하면 인가 URL과 함께 성공 결과를 반환한다", async () => {
    (getGoogleAuthorizationUrl as jest.Mock).mockResolvedValue("https://accounts.google.com/authorize");

    const result = await getGoogleAuthorizationUrlAction(false);

    expect(getGoogleAuthorizationUrl).toHaveBeenCalledWith(false);
    expect(result).toEqual({
      success: true,
      message: "구글 인증 URL이 발급되었습니다.",
      authorizationUrl: "https://accounts.google.com/authorize",
    });
  });

  it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
    (getGoogleAuthorizationUrl as jest.Mock).mockRejectedValue(new Error("인가 URL 발급 실패"));

    const result = await getGoogleAuthorizationUrlAction(true);

    expect(result).toEqual({ success: false, message: "인가 URL 발급 실패" });
  });
});

describe("checkGoogleConnectionAction", () => {
  it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
    (checkGoogleConnection as jest.Mock).mockResolvedValue(undefined);

    const result = await checkGoogleConnectionAction();

    expect(result).toEqual({ success: true, message: "구글 연동 상태를 확인했습니다." });
  });

  it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
    (checkGoogleConnection as jest.Mock).mockRejectedValue(new Error("확인 실패"));

    const result = await checkGoogleConnectionAction();

    expect(result).toEqual({ success: false, message: "확인 실패" });
  });
});

describe("disconnectGoogleAction", () => {
  it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
    (disconnectGoogle as jest.Mock).mockResolvedValue(undefined);

    const result = await disconnectGoogleAction();

    expect(result).toEqual({ success: true, message: "구글 연동이 해제되었습니다." });
  });

  it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
    (disconnectGoogle as jest.Mock).mockRejectedValue(new Error("해제 실패"));

    const result = await disconnectGoogleAction();

    expect(result).toEqual({ success: false, message: "해제 실패" });
  });
});

describe("saveWorkingHoursPolicyAction", () => {
  const validPayload: WorkingHoursPolicySaveRequest = {
    defaultStartTime: "09:00",
    defaultEndTime: "18:00",
    lateGraceMinutes: 10,
    weekdayExceptionEnabled: false,
    weekdays: [],
  };

  it("출근 시각이 비어있으면 검증 실패 결과를 반환한다", async () => {
    const result = await saveWorkingHoursPolicyAction({ ...validPayload, defaultStartTime: "" });

    expect(result).toEqual({ success: false, message: "출근·퇴근 시각을 선택해주세요." });
    expect(saveWorkingHours).not.toHaveBeenCalled();
  });

  it("퇴근 시각이 비어있으면 검증 실패 결과를 반환한다", async () => {
    const result = await saveWorkingHoursPolicyAction({ ...validPayload, defaultEndTime: "" });

    expect(result).toEqual({ success: false, message: "출근·퇴근 시각을 선택해주세요." });
  });

  it("지각 유예가 0분 미만이면 검증 실패 결과를 반환한다", async () => {
    const result = await saveWorkingHoursPolicyAction({ ...validPayload, lateGraceMinutes: -10 });

    expect(result).toEqual({ success: false, message: "지각 유예는 0분에서 60분 사이로 설정해주세요." });
    expect(saveWorkingHours).not.toHaveBeenCalled();
  });

  it("지각 유예가 60분을 초과하면 검증 실패 결과를 반환한다", async () => {
    const result = await saveWorkingHoursPolicyAction({ ...validPayload, lateGraceMinutes: 70 });

    expect(result).toEqual({ success: false, message: "지각 유예는 0분에서 60분 사이로 설정해주세요." });
  });

  it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
    (saveWorkingHours as jest.Mock).mockResolvedValue({ policyId: 1, ...validPayload });

    const result = await saveWorkingHoursPolicyAction(validPayload);

    expect(saveWorkingHours).toHaveBeenCalledWith(validPayload);
    expect(result).toEqual({ success: true, message: "근무시간 정책이 저장되었습니다." });
  });

  it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
    (saveWorkingHours as jest.Mock).mockRejectedValue(new Error("저장 실패"));

    const result = await saveWorkingHoursPolicyAction(validPayload);

    expect(result).toEqual({ success: false, message: "저장 실패" });
  });
});
