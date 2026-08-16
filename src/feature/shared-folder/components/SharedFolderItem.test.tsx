import { fireEvent, render, screen } from "@testing-library/react";
import SharedFolderItem from "./SharedFolderItem";

const folderItem: SharedFolderDriveItemData = {
  id: "folder-1",
  name: "폴더 A",
  mimeType: "application/vnd.google-apps.folder",
  viewUrl: "https://drive.google.com/folder-1",
  downloadable: false,
  modifiedAt: "2026-08-01T09:30:00.000Z",
};

const docsItem: SharedFolderDriveItemData = {
  id: "docs-1",
  name: "회의록",
  mimeType: "application/vnd.google-apps.document",
  viewUrl: "https://drive.google.com/docs-1",
  downloadable: false,
  modifiedAt: "2026-08-01T09:30:00.000Z",
};

const uploadedItem: SharedFolderDriveItemData = {
  id: "file-1",
  name: "업로드 파일",
  mimeType: "application/pdf",
  viewUrl: "https://drive.google.com/file-1",
  downloadable: true,
  modifiedAt: "2026-08-01T09:30:00.000Z",
};

function renderItem(item: SharedFolderDriveItemData, overrides: Partial<Parameters<typeof SharedFolderItem>[0]> = {}) {
  return render(
    <SharedFolderItem
      isMenuOpen={false}
      item={item}
      onDelete={jest.fn()}
      onDownload={jest.fn()}
      onFolderOpen={jest.fn()}
      onMenuToggle={jest.fn()}
      onMove={jest.fn()}
      onOpenPreview={jest.fn()}
      onRename={jest.fn()}
      {...overrides}
    />
  );
}

describe("SharedFolderItem", () => {
  it("폴더는 종류를 '폴더'로 표시하고 이름을 클릭하면 폴더 열기 콜백을 호출한다", () => {
    const onFolderOpen = jest.fn();
    renderItem(folderItem, { onFolderOpen });

    expect(screen.getByText("폴더")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "폴더 A" }));

    expect(onFolderOpen).toHaveBeenCalledTimes(1);
  });

  it("Google Docs 파일은 종류를 'Google Docs'로 표시하고 이름을 클릭하면 미리보기 콜백을 호출한다", () => {
    const onOpenPreview = jest.fn();
    renderItem(docsItem, { onOpenPreview });

    expect(screen.getByText("Google Docs")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "회의록" }));

    expect(onOpenPreview).toHaveBeenCalledTimes(1);
  });

  it("업로드 파일은 종류를 '파일'로 표시한다", () => {
    renderItem(uploadedItem);

    expect(screen.getByText("파일")).toBeInTheDocument();
  });

  it("수정자와 크기는 항상 '-'로 표시한다", () => {
    renderItem(uploadedItem);

    expect(screen.getAllByText("-")).toHaveLength(2);
  });

  it("케밥 버튼을 클릭하면 메뉴 토글 콜백을 호출한다", () => {
    const onMenuToggle = jest.fn();
    renderItem(uploadedItem, { onMenuToggle });

    fireEvent.click(screen.getByRole("button", { name: "업로드 파일 더보기" }));

    expect(onMenuToggle).toHaveBeenCalledTimes(1);
  });

  it("isMenuOpen이 참이면 케밥 메뉴를 노출하고, downloadable이 참인 파일은 다운로드 항목도 보여준다", () => {
    renderItem(uploadedItem, { isMenuOpen: true });

    expect(screen.getByRole("button", { name: "다운로드" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "미리보기 열기" })).toBeInTheDocument();
  });

  it("isMenuOpen이 거짓이면 케밥 메뉴를 노출하지 않는다", () => {
    renderItem(uploadedItem, { isMenuOpen: false });

    expect(screen.queryByRole("button", { name: "다운로드" })).not.toBeInTheDocument();
  });

  it("downloadable이 거짓인 파일은 메뉴에 다운로드 항목이 없다", () => {
    renderItem(docsItem, { isMenuOpen: true });

    expect(screen.queryByRole("button", { name: "다운로드" })).not.toBeInTheDocument();
  });
});
