import { act, render } from "@testing-library/react";
import { toast } from "sonner";
import { getCurrentUserIdAction } from "../../messenger/actions";
import { useAlarmStore } from "@/store/useAlarmStore";
import AlarmRealtimeProvider from "./AlarmRealtimeProvider";

type StompCallback = (message: { body: string }) => void;

const mockSubscriptions = new Map<string, StompCallback>();

jest.mock("@stomp/stompjs", () => ({
  Client: jest.fn().mockImplementation(({ onConnect }: { onConnect: () => void }) => ({
    activate: jest.fn(() => onConnect()),
    deactivate: jest.fn(),
    subscribe: jest.fn((topic: string, callback: StompCallback) => {
      mockSubscriptions.set(topic, callback);
    }),
  })),
}));

jest.mock("sockjs-client", () => jest.fn());

jest.mock("../../messenger/actions", () => ({
  getCurrentUserIdAction: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: jest.fn(),
}));

const mockedGetCurrentUserIdAction = getCurrentUserIdAction as jest.Mock;

describe("AlarmRealtimeProvider", () => {
  beforeEach(() => {
    mockSubscriptions.clear();
    act(() => {
      useAlarmStore.setState({ unreadCount: 0 });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("로그인 사용자 id가 없으면 구독하지 않는다", async () => {
    mockedGetCurrentUserIdAction.mockResolvedValue(null);

    await act(async () => {
      render(<AlarmRealtimeProvider apiBaseUrl="http://localhost" />);
    });

    expect(mockSubscriptions.size).toBe(0);
  });

  it("멘션 알림을 수신하면 토스트를 표시하고 안읽은 개수를 증가시킨다", async () => {
    mockedGetCurrentUserIdAction.mockResolvedValue(1);

    await act(async () => {
      render(<AlarmRealtimeProvider apiBaseUrl="http://localhost" />);
    });

    act(() => {
      mockSubscriptions.get("/topic/workspaces/users/1")?.({
        body: JSON.stringify({ eventType: "TASK_COMMENT_MENTIONED", taskTitle: "회의록 정리" }),
      });
    });

    expect(toast).toHaveBeenCalledWith("[회의록 정리] 업무에 회원님을 멘션했습니다");
    expect(useAlarmStore.getState().unreadCount).toBe(1);
  });
});
