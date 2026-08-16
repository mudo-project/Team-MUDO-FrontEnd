import {
  deleteNotification,
  deleteReadNotifications,
  readNotification,
} from "../../service/alarm.service";
import { deleteNotificationAction, deleteReadNotificationsAction, readNotificationAction } from "./actions";

jest.mock("../../service/alarm.service");

describe("readNotificationAction", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
    (readNotification as jest.Mock).mockResolvedValue(undefined);

    const result = await readNotificationAction(1);

    expect(result).toEqual({ success: true, message: "알림을 읽음 처리하였습니다." });
  });

  it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
    (readNotification as jest.Mock).mockRejectedValue(new Error("알림을 찾을 수 없습니다."));

    const result = await readNotificationAction(1);

    expect(result).toEqual({ success: false, message: "알림을 찾을 수 없습니다." });
  });
});

describe("deleteNotificationAction", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
    (deleteNotification as jest.Mock).mockResolvedValue(undefined);

    const result = await deleteNotificationAction(1);

    expect(result).toEqual({ success: true, message: "알림이 삭제되었습니다." });
  });

  it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
    (deleteNotification as jest.Mock).mockRejectedValue(new Error("알림 삭제 권한이 없습니다."));

    const result = await deleteNotificationAction(1);

    expect(result).toEqual({ success: false, message: "알림 삭제 권한이 없습니다." });
  });
});

describe("deleteReadNotificationsAction", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
    (deleteReadNotifications as jest.Mock).mockResolvedValue(undefined);

    const result = await deleteReadNotificationsAction();

    expect(result).toEqual({ success: true, message: "읽은 알림이 모두 삭제되었습니다." });
  });

  it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
    (deleteReadNotifications as jest.Mock).mockRejectedValue(new Error("읽은 알림이 없습니다."));

    const result = await deleteReadNotificationsAction();

    expect(result).toEqual({ success: false, message: "읽은 알림이 없습니다." });
  });
});
