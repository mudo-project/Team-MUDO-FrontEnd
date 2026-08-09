import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { deleteMemoAction } from "../actions";
import MemoCard from "./MemoCard";

jest.mock("../actions", () => ({
  changeMemoColorAction: jest.fn(),
  deleteMemoAction: jest.fn(),
  updateMemoAction: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

const memo: MemoData = {
  id: 1,
  title: "프로젝트 회의",
  content: "논의할 안건",
  color: "ROSE",
  positionX: null,
  positionY: null,
  width: null,
  height: null,
  createdAt: "2026-08-09T00:00:00.000Z",
  updatedAt: "2026-08-09T00:00:00.000Z",
};

const mockedDeleteMemoAction = deleteMemoAction as jest.Mock;

describe("MemoCard", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("더보기를 클릭하면 수정, 색상 변경, 삭제 메뉴를 노출한다", () => {
    render(<MemoCard createForm={null} isLoading={false} memos={[memo]} onRefresh={jest.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "프로젝트 회의 더보기" }));

    expect(screen.getByRole("button", { name: "수정" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "색상 변경" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "삭제" })).toBeInTheDocument();
  });

  it("수정을 클릭하면 해당 메모의 편집 폼을 노출한다", () => {
    render(<MemoCard createForm={null} isLoading={false} memos={[memo]} onRefresh={jest.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "프로젝트 회의 더보기" }));
    fireEvent.click(screen.getByRole("button", { name: "수정" }));

    expect(screen.getByLabelText("메모 제목")).toHaveValue("프로젝트 회의");
    expect(screen.getByLabelText("메모 내용")).toHaveValue("논의할 안건");
  });

  it("색상 변경을 클릭하면 색상 선택 UI를 노출한다", () => {
    render(<MemoCard createForm={null} isLoading={false} memos={[memo]} onRefresh={jest.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "프로젝트 회의 더보기" }));
    fireEvent.click(screen.getByRole("button", { name: "색상 변경" }));

    expect(screen.getByLabelText("메모 색상 선택")).toBeInTheDocument();
  });

  it("삭제 확인 화면에서 취소를 클릭하면 삭제 확인 화면을 닫는다", () => {
    render(<MemoCard createForm={null} isLoading={false} memos={[memo]} onRefresh={jest.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "프로젝트 회의 더보기" }));
    fireEvent.click(screen.getByRole("button", { name: "삭제" }));
    fireEvent.click(screen.getByRole("button", { name: "취소" }));

    expect(screen.queryByText("삭제할까요?")).not.toBeInTheDocument();
  });

  it("삭제가 성공하면 목록 새로고침 콜백을 호출하고 삭제 확인 화면을 닫는다", async () => {
    const onRefresh = jest.fn();
    mockedDeleteMemoAction.mockResolvedValue({ success: true, message: "메모가 삭제되었습니다." });

    render(<MemoCard createForm={null} isLoading={false} memos={[memo]} onRefresh={onRefresh} />);

    fireEvent.click(screen.getByRole("button", { name: "프로젝트 회의 더보기" }));
    fireEvent.click(screen.getByRole("button", { name: "삭제" }));
    fireEvent.click(screen.getByRole("button", { name: "삭제" }));

    await waitFor(() => {
      expect(onRefresh).toHaveBeenCalledTimes(1);
    });
    expect(screen.queryByText("삭제할까요?")).not.toBeInTheDocument();
  });
});
