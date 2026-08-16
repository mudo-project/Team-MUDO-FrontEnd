import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { getSharedFolderContentListAction } from "../actions";
import SharedFolderMoveModal from "./SharedFolderMoveModal";

jest.mock("../actions", () => ({
  getSharedFolderContentListAction: jest.fn(),
}));

const targetItem: SharedFolderDriveItemData = {
  id: "file-1",
  name: "업로드 파일",
  mimeType: "application/pdf",
  viewUrl: "https://drive.google.com/file-1",
  downloadable: true,
  modifiedAt: "2026-08-01T00:00:00.000Z",
};

const subFolder: SharedFolderDriveItemData = {
  id: "folder-2",
  name: "하위 폴더",
  mimeType: "application/vnd.google-apps.folder",
  viewUrl: "https://drive.google.com/folder-2",
  downloadable: false,
  modifiedAt: "2026-08-01T00:00:00.000Z",
};

const mockedGetSharedFolderContentListAction = getSharedFolderContentListAction as jest.Mock;

describe("SharedFolderMoveModal", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("공유파일 루트에서는 이동 대상 자기 자신을 제외한 하위 폴더 목록을 보여주고, rootId가 있으면 이동 버튼이 활성화된다", async () => {
    mockedGetSharedFolderContentListAction.mockResolvedValue({ items: [subFolder, targetItem], hasNext: false, nextCursor: null });

    render(
      <SharedFolderMoveModal isSubmitting={false} item={targetItem} rootId="root-1" onClose={jest.fn()} onMove={jest.fn()} />
    );

    expect(await screen.findByText("하위 폴더")).toBeInTheDocument();
    expect(screen.queryByText("업로드 파일")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "이동" })).not.toBeDisabled();
  });

  it("rootId가 없으면 공유파일 루트에서 이동 버튼이 비활성화된다", async () => {
    mockedGetSharedFolderContentListAction.mockResolvedValue({ items: [], hasNext: false, nextCursor: null });

    render(
      <SharedFolderMoveModal isSubmitting={false} item={targetItem} rootId={null} onClose={jest.fn()} onMove={jest.fn()} />
    );

    await screen.findByText("하위 폴더가 없습니다.");

    expect(screen.getByRole("button", { name: "이동" })).toBeDisabled();
    expect(screen.getByText("이동할 하위 폴더로 들어간 뒤 이동할 수 있습니다.")).toBeInTheDocument();
  });

  it("하위 폴더로 들어가면 이동 버튼이 활성화되고 클릭하면 해당 폴더 id로 이동 콜백을 호출한다", async () => {
    mockedGetSharedFolderContentListAction.mockResolvedValue({ items: [subFolder], hasNext: false, nextCursor: null });
    const onMove = jest.fn();

    render(
      <SharedFolderMoveModal isSubmitting={false} item={targetItem} rootId="root-1" onClose={jest.fn()} onMove={onMove} />
    );

    fireEvent.click(await screen.findByRole("button", { name: /하위 폴더/ }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "이동" })).not.toBeDisabled();
    });

    fireEvent.click(screen.getByRole("button", { name: "이동" }));

    expect(onMove).toHaveBeenCalledWith("folder-2");
  });

  it("공유파일 루트 breadcrumb을 클릭하면 최상위 목록으로 돌아간다", async () => {
    mockedGetSharedFolderContentListAction.mockResolvedValue({ items: [subFolder], hasNext: false, nextCursor: null });

    render(
      <SharedFolderMoveModal isSubmitting={false} item={targetItem} rootId={null} onClose={jest.fn()} onMove={jest.fn()} />
    );

    fireEvent.click(await screen.findByRole("button", { name: /하위 폴더/ }));
    await waitFor(() => expect(screen.getByRole("button", { name: "이동" })).not.toBeDisabled());

    fireEvent.click(screen.getByRole("button", { name: "공유파일 루트" }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "이동" })).toBeDisabled();
    });
  });

  it("하위 폴더가 없으면 안내 문구를 보여준다", async () => {
    mockedGetSharedFolderContentListAction.mockResolvedValue({ items: [], hasNext: false, nextCursor: null });

    render(
      <SharedFolderMoveModal isSubmitting={false} item={targetItem} rootId="root-1" onClose={jest.fn()} onMove={jest.fn()} />
    );

    expect(await screen.findByText("하위 폴더가 없습니다.")).toBeInTheDocument();
  });

  it("폴더 목록 조회에 실패하면 오류 메시지를 보여준다", async () => {
    mockedGetSharedFolderContentListAction.mockRejectedValue(new Error("폴더 목록을 불러오지 못했습니다."));

    render(
      <SharedFolderMoveModal isSubmitting={false} item={targetItem} rootId="root-1" onClose={jest.fn()} onMove={jest.fn()} />
    );

    expect(await screen.findByText("폴더 목록을 불러오지 못했습니다.")).toBeInTheDocument();
  });

  it("요청 중이면 이동 버튼 문구가 바뀐다", async () => {
    mockedGetSharedFolderContentListAction.mockResolvedValue({ items: [], hasNext: false, nextCursor: null });

    render(
      <SharedFolderMoveModal isSubmitting item={targetItem} rootId="root-1" onClose={jest.fn()} onMove={jest.fn()} />
    );

    expect(await screen.findByRole("button", { name: "이동 중..." })).toBeDisabled();
  });

  it("취소를 클릭하면 닫기 콜백을 호출한다", async () => {
    mockedGetSharedFolderContentListAction.mockResolvedValue({ items: [], hasNext: false, nextCursor: null });
    const onClose = jest.fn();

    render(
      <SharedFolderMoveModal isSubmitting={false} item={targetItem} rootId="root-1" onClose={onClose} onMove={jest.fn()} />
    );

    await screen.findByText("하위 폴더가 없습니다.");
    fireEvent.click(screen.getByRole("button", { name: "취소" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
