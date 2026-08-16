import { fireEvent, render, screen } from "@testing-library/react";
import AlarmList from "./AlarmList";

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
  message: "업무에 회원님을 멘션했습니다",
  read: false,
  createdAt: "2026-08-10T00:00:00.000Z",
};

const readAlarm: NotificationItemData = {
  notificationId: 2,
  type: "APPROVAL_LINE_ACTIVATED",
  targetId: 20,
  message: "결재 차례가 되었습니다",
  read: true,
  createdAt: "2026-08-01T00:00:00.000Z",
};

describe("AlarmList", () => {
  beforeEach(() => {
    MockIntersectionObserver.instances = [];
    (global as unknown as { IntersectionObserver: typeof IntersectionObserver }).IntersectionObserver =
      MockIntersectionObserver as unknown as typeof IntersectionObserver;
  });

  it("알림이 없으면 안내 문구를 표시한다", () => {
    render(
      <AlarmList alarms={[]} hasNext={false} onDelete={jest.fn()} onItemClick={jest.fn()} onLoadMore={jest.fn()} />
    );

    expect(screen.getByText("알림이 없습니다")).toBeInTheDocument();
  });

  it("알림 항목을 클릭하면 onItemClick을 호출한다", () => {
    const onItemClick = jest.fn();
    render(
      <AlarmList
        alarms={[unreadAlarm]}
        hasNext={false}
        onDelete={jest.fn()}
        onItemClick={onItemClick}
        onLoadMore={jest.fn()}
      />
    );

    fireEvent.click(screen.getByText("업무에 회원님을 멘션했습니다"));

    expect(onItemClick).toHaveBeenCalledWith(1);
  });

  it("삭제 아이콘을 클릭하면 onDelete를 호출한다", () => {
    const onDelete = jest.fn();
    render(
      <AlarmList
        alarms={[readAlarm]}
        hasNext={false}
        onDelete={onDelete}
        onItemClick={jest.fn()}
        onLoadMore={jest.fn()}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "알림 삭제" }));

    expect(onDelete).toHaveBeenCalledWith(2);
  });

  it("hasNext가 true이고 목록 끝이 뷰포트에 들어오면 onLoadMore를 호출한다", () => {
    const onLoadMore = jest.fn();
    render(
      <AlarmList
        alarms={[unreadAlarm]}
        hasNext={true}
        onDelete={jest.fn()}
        onItemClick={jest.fn()}
        onLoadMore={onLoadMore}
      />
    );

    const [observerInstance] = MockIntersectionObserver.instances;
    observerInstance.callback(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      observerInstance as unknown as IntersectionObserver
    );

    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });
});
