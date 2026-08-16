import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createMemoAction, getMemoListAction } from "../actions";
import MemoContainer from "./MemoContainer";
import { useMemoStore } from "@/store/useMemoStore";

jest.mock("../actions", () => ({
  createMemoAction: jest.fn(),
  getMemoListAction: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

const oldestMemo: MemoData = {
  id: 2,
  title: "오래된 메모",
  content: "오래된 내용",
  color: "779F8A",
  positionX: null,
  positionY: null,
  width: null,
  height: null,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

const mockedCreateMemoAction = createMemoAction as jest.Mock;
const mockedGetMemoListAction = getMemoListAction as jest.Mock;

describe("MemoContainer", () => {
  beforeEach(() => {
    act(() => {
      useMemoStore.setState({ isOpen: true });
    });
    mockedGetMemoListAction.mockResolvedValue([]);
  });

  afterEach(() => {
    act(() => {
      useMemoStore.setState({ isOpen: false });
    });
    jest.clearAllMocks();
  });

  it("새 메모를 클릭하면 생성 폼을 노출하고 취소하면 닫는다", async () => {
    render(<MemoContainer />);

    await screen.findByText("메모가 없습니다. 새 메모를 추가해보세요.");

    fireEvent.click(screen.getByRole("button", { name: "새 메모" }));

    expect(screen.getByPlaceholderText("제목을 입력하세요")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "취소" }));

    await waitFor(() => {
      expect(screen.queryByPlaceholderText("제목을 입력하세요")).not.toBeInTheDocument();
    });
  });

  it("생성 폼에서 저장하면 생성 액션을 호출하고 성공하면 폼을 닫고 목록을 갱신한다", async () => {
    mockedCreateMemoAction.mockResolvedValue({ success: true, message: "메모가 생성되었습니다.", id: 1 });

    render(<MemoContainer />);

    await screen.findByText("메모가 없습니다. 새 메모를 추가해보세요.");

    fireEvent.click(screen.getByRole("button", { name: "새 메모" }));
    fireEvent.change(screen.getByPlaceholderText("제목을 입력하세요"), { target: { value: "새 메모 제목" } });
    fireEvent.change(screen.getByPlaceholderText("내용을 입력하세요"), { target: { value: "새 메모 내용" } });
    fireEvent.click(screen.getByRole("button", { name: "저장" }));

    await waitFor(() => {
      expect(mockedCreateMemoAction).toHaveBeenCalled();
      expect(mockedGetMemoListAction).toHaveBeenCalledTimes(2);
    });
    expect(screen.queryByPlaceholderText("제목을 입력하세요")).not.toBeInTheDocument();
  });

  it("오래된순을 선택하면 오래된순 목록을 표시한다", async () => {
    mockedGetMemoListAction.mockImplementation(async (sortOrder: MemoSortOrder) => (
      sortOrder === "OLDEST" ? [oldestMemo] : []
    ));

    render(<MemoContainer />);

    await screen.findByText("메모가 없습니다. 새 메모를 추가해보세요.");

    fireEvent.click(screen.getByRole("button", { name: "오래된순" }));

    expect(await screen.findByRole("heading", { name: "오래된 메모" })).toBeInTheDocument();
  });

  it("패널 닫기를 클릭하면 메모 컨테이너를 숨긴다", async () => {
    render(<MemoContainer />);

    await screen.findByText("메모가 없습니다. 새 메모를 추가해보세요.");

    fireEvent.click(screen.getByRole("button", { name: "메모 패널 닫기" }));

    await waitFor(() => {
      expect(screen.queryByRole("heading", { name: /메모/ })).not.toBeInTheDocument();
    });
  });
});
