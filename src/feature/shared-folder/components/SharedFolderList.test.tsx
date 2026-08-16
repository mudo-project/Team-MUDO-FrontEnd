import { fireEvent, render, screen } from "@testing-library/react";
import SharedFolderList from "./SharedFolderList";

const folderItem: SharedFolderDriveItemData = {
  id: "folder-1",
  name: "폴더 A",
  mimeType: "application/vnd.google-apps.folder",
  viewUrl: "https://drive.google.com/folder-1",
  downloadable: false,
  modifiedAt: "2026-08-01T00:00:00.000Z",
};

const fileItem: SharedFolderDriveItemData = {
  id: "file-1",
  name: "업로드 파일",
  mimeType: "application/pdf",
  viewUrl: "https://drive.google.com/file-1",
  downloadable: true,
  modifiedAt: "2026-08-02T00:00:00.000Z",
};

function renderList(overrides: Partial<Parameters<typeof SharedFolderList>[0]> = {}) {
  return render(
    <SharedFolderList
      hasNext={false}
      isFolderEmpty={false}
      isLoadingMore={false}
      items={[]}
      openItemMenuId={null}
      onDelete={jest.fn()}
      onDownload={jest.fn()}
      onFileUploadRequest={jest.fn()}
      onFolderCreateRequest={jest.fn()}
      onFolderOpen={jest.fn()}
      onItemMenuToggle={jest.fn()}
      onItemMove={jest.fn()}
      onItemRename={jest.fn()}
      onLoadMore={jest.fn()}
      onPreviewOpen={jest.fn()}
      {...overrides}
    />
  );
}

describe("SharedFolderList", () => {
  it("폴더가 실제로 비어 있으면 안내 문구와 업로드/폴더 만들기 버튼을 보여준다", () => {
    renderList({ items: [], isFolderEmpty: true });

    expect(screen.getByText("이 폴더에 파일이 없습니다.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "파일 업로드" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "폴더 만들기" })).toBeInTheDocument();
  });

  it("필터·검색으로 결과가 없으면 버튼 없이 안내 문구만 보여준다", () => {
    renderList({ items: [], isFolderEmpty: false });

    expect(screen.getByText("파일이 없습니다.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "파일 업로드" })).not.toBeInTheDocument();
  });

  it("항목이 있으면 목록으로 렌더링한다", () => {
    renderList({ items: [folderItem, fileItem] });

    expect(screen.getByText("폴더 A")).toBeInTheDocument();
    expect(screen.getByText("업로드 파일")).toBeInTheDocument();
  });

  it("hasNext가 참이면 더 보기 버튼을 보여주고 클릭하면 콜백을 호출한다", () => {
    const onLoadMore = jest.fn();
    renderList({ items: [folderItem], hasNext: true, onLoadMore });

    fireEvent.click(screen.getByRole("button", { name: "더 보기" }));

    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });

  it("hasNext가 거짓이면 더 보기 버튼을 보여주지 않는다", () => {
    renderList({ items: [folderItem], hasNext: false });

    expect(screen.queryByRole("button", { name: "더 보기" })).not.toBeInTheDocument();
  });

  it("더 보기 로딩 중이면 버튼이 비활성화되고 문구가 바뀐다", () => {
    renderList({ items: [folderItem], hasNext: true, isLoadingMore: true });

    expect(screen.getByRole("button", { name: "불러오는 중..." })).toBeDisabled();
  });
});
