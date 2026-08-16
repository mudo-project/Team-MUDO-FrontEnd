import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import {
  deleteNotificationAction,
  deleteReadNotificationsAction,
  getNotificationListAction,
  readNotificationAction,
} from "../actions";
import AlarmContainer from "./AlarmContainer";
import { useAlarmStore } from "@/store/useAlarmStore";

jest.mock("../actions", () => ({
  deleteNotificationAction: jest.fn(),
  deleteReadNotificationsAction: jest.fn(),
  getNotificationListAction: jest.fn(),
  readNotificationAction: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
  },
}));

class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = [];
  callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    MockIntersectionObserver.instances.push(this);
  }

  observe = jest.fn();
  disconnect = jest.fn();
}

const unreadAlarm: NotificationItemData = {
  notificationId: 1,
  type: "TASK_COMMENT_MENTIONED",
  targetId: 10,
  message: "멘션 알림",
  read: false,
  createdAt: "2026-08-10T00:00:00.000Z",
};

const readAlarm: NotificationItemData = {
  notificationId: 2,
  type: "APPROVAL_LINE_ACTIVATED",
  targetId: 20,
  message: "결재 알림",
  read: true,
  createdAt: "2026-08-01T00:00:00.000Z",
};

const mockedReadNotificationAction = readNotificationAction as jest.Mock;
const mockedDeleteNotificationAction = deleteNotificationAction as jest.Mock;
const mockedDeleteReadNotificationsAction = deleteReadNotificationsAction as jest.Mock;
const mockedGetNotificationListAction = getNotificationListAction as jest.Mock;

describe("AlarmContainer", () => {
  beforeEach(() => {
    MockIntersectionObserver.instances = [];
    (global as unknown as { IntersectionObserver: typeof IntersectionObserver }).IntersectionObserver =
      MockIntersectionObserver as unknown as typeof IntersectionObserver;
    act(() => {
      useAlarmStore.setState({ unreadCount: 3 });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("조회 실패 상태면 에러 문구를 표시한다", () => {
    render(<AlarmContainer initialAlarms={[]} initialHasNext={false} loadError={true} />);

    expect(screen.getByText("알림을 불러오지 못했습니다.")).toBeInTheDocument();
  });

  it("안읽은 알림을 클릭하면 읽음 처리하고 안읽은 개수를 감소시킨다", async () => {
    mockedReadNotificationAction.mockResolvedValue({ success: true, message: "알림을 읽음 처리하였습니다." });

    render(<AlarmContainer initialAlarms={[unreadAlarm]} initialHasNext={false} loadError={false} />);

    fireEvent.click(screen.getByText("멘션 알림"));

    await waitFor(() => {
      expect(screen.queryByLabelText("안읽음")).not.toBeInTheDocument();
    });
    expect(useAlarmStore.getState().unreadCount).toBe(2);
  });

  it("읽음 처리에 실패하면 에러 토스트를 표시한다", async () => {
    mockedReadNotificationAction.mockResolvedValue({ success: false, message: "알림 읽음 처리에 실패하였습니다." });

    render(<AlarmContainer initialAlarms={[unreadAlarm]} initialHasNext={false} loadError={false} />);

    fireEvent.click(screen.getByText("멘션 알림"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("알림 읽음 처리에 실패하였습니다.");
    });
    expect(useAlarmStore.getState().unreadCount).toBe(3);
  });

  it("안읽은 알림을 삭제하면 목록에서 제거하고 안읽은 개수를 감소시킨다", async () => {
    mockedDeleteNotificationAction.mockResolvedValue({ success: true, message: "알림이 삭제되었습니다." });

    render(<AlarmContainer initialAlarms={[unreadAlarm]} initialHasNext={false} loadError={false} />);

    fireEvent.click(screen.getByRole("button", { name: "알림 삭제" }));

    await waitFor(() => {
      expect(screen.queryByText("멘션 알림")).not.toBeInTheDocument();
    });
    expect(useAlarmStore.getState().unreadCount).toBe(2);
  });

  it("읽은 알림 삭제를 클릭하면 읽은 알림만 모두 제거한다", async () => {
    mockedDeleteReadNotificationsAction.mockResolvedValue({ success: true, message: "읽은 알림이 모두 삭제되었습니다." });

    render(<AlarmContainer initialAlarms={[unreadAlarm, readAlarm]} initialHasNext={false} loadError={false} />);

    fireEvent.click(screen.getByRole("button", { name: "읽은 알림 삭제" }));

    await waitFor(() => {
      expect(screen.queryByText("결재 알림")).not.toBeInTheDocument();
    });
    expect(screen.getByText("멘션 알림")).toBeInTheDocument();
  });

  it("무한 스크롤로 다음 페이지를 불러오면 목록에 이어붙인다", async () => {
    mockedGetNotificationListAction.mockResolvedValue({
      content: [readAlarm],
      page: 1,
      size: 20,
      hasNext: false,
    });

    render(<AlarmContainer initialAlarms={[unreadAlarm]} initialHasNext={true} loadError={false} />);

    const [observerInstance] = MockIntersectionObserver.instances;
    await act(async () => {
      observerInstance.callback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        observerInstance as unknown as IntersectionObserver
      );
    });

    expect(mockedGetNotificationListAction).toHaveBeenCalledWith({ page: 1 });
    await waitFor(() => {
      expect(screen.getByText("결재 알림")).toBeInTheDocument();
    });
  });
});
