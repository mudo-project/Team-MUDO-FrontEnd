import {
  createSharedFolderFolder,
  createSharedFolderGoogleFile,
  deleteSharedFolderContent,
  downloadSharedFolderContent,
  recreateSharedFolderRoot,
  searchSharedFolderContent,
  updateSharedFolderContent,
  uploadSharedFolderFile,
} from "@/service/sharedFolder.service";
import {
  createSharedFolderFolderAction,
  createSharedFolderGoogleFileAction,
  deleteSharedFolderContentAction,
  downloadSharedFolderContentAction,
  recreateSharedFolderRootAction,
  searchSharedFolderContentAction,
  updateSharedFolderContentAction,
  uploadSharedFolderFileAction,
} from "./actions";

jest.mock("../../service/sharedFolder.service");

const driveItem: SharedFolderDriveItemData = {
  id: "item-1",
  name: "회의록",
  mimeType: "application/vnd.google-apps.document",
  viewUrl: "https://drive.google.com/item-1",
  downloadable: false,
  modifiedAt: "2026-08-01T00:00:00.000Z",
};

describe("recreateSharedFolderRootAction", () => {
  afterEach(() => jest.clearAllMocks());

  it("service 호출이 성공하면 성공 결과와 데이터를 반환한다", async () => {
    const data = { ready: true, rootId: "root-1" };
    (recreateSharedFolderRoot as jest.Mock).mockResolvedValue(data);

    const result = await recreateSharedFolderRootAction();

    expect(result).toEqual({ success: true, message: "공유폴더 시스템 루트가 재생성되었습니다.", data });
  });

  it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
    (recreateSharedFolderRoot as jest.Mock).mockRejectedValue(new Error("재생성할 수 없습니다."));

    const result = await recreateSharedFolderRootAction();

    expect(result).toEqual({ success: false, message: "재생성할 수 없습니다." });
  });
});

describe("searchSharedFolderContentAction", () => {
  afterEach(() => jest.clearAllMocks());

  it("검색어가 비어있으면 service를 호출하지 않고 예외를 던진다", async () => {
    await expect(searchSharedFolderContentAction({ keyword: "   " })).rejects.toThrow("검색어를 입력해주세요.");
    expect(searchSharedFolderContent).not.toHaveBeenCalled();
  });

  it("검색어가 있으면 service 호출 결과를 그대로 반환한다", async () => {
    const data = { items: [driveItem], hasNext: false, nextCursor: null };
    (searchSharedFolderContent as jest.Mock).mockResolvedValue(data);

    const result = await searchSharedFolderContentAction({ keyword: "회의록" });

    expect(searchSharedFolderContent).toHaveBeenCalledWith({ keyword: "회의록" });
    expect(result).toEqual(data);
  });
});

describe("createSharedFolderFolderAction", () => {
  afterEach(() => jest.clearAllMocks());

  it("폴더 이름이 비어있으면 service를 호출하지 않고 실패 결과를 반환한다", async () => {
    const result = await createSharedFolderFolderAction({ name: "   " });

    expect(result).toEqual({ success: false, message: "폴더 이름을 입력해주세요." });
    expect(createSharedFolderFolder).not.toHaveBeenCalled();
  });

  it("service 호출이 성공하면 성공 결과와 데이터를 반환한다", async () => {
    (createSharedFolderFolder as jest.Mock).mockResolvedValue(driveItem);

    const result = await createSharedFolderFolderAction({ name: "새 폴더" });

    expect(result).toEqual({ success: true, message: "폴더가 생성되었습니다.", data: driveItem });
  });

  it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
    (createSharedFolderFolder as jest.Mock).mockRejectedValue(new Error("이미 같은 이름의 폴더가 있습니다."));

    const result = await createSharedFolderFolderAction({ name: "새 폴더" });

    expect(result).toEqual({ success: false, message: "이미 같은 이름의 폴더가 있습니다." });
  });
});

describe("uploadSharedFolderFileAction", () => {
  afterEach(() => jest.clearAllMocks());

  it("파일 용량이 100MB를 초과하면 service를 호출하지 않고 실패 결과를 반환한다", async () => {
    const file = { size: 100 * 1024 * 1024 + 1 } as File;

    const result = await uploadSharedFolderFileAction("folder-1", file);

    expect(result).toEqual({ success: false, message: "파일은 최대 100MB까지 업로드할 수 있습니다." });
    expect(uploadSharedFolderFile).not.toHaveBeenCalled();
  });

  it("service 호출이 성공하면 성공 결과와 데이터를 반환한다", async () => {
    const file = { size: 1024 } as File;
    (uploadSharedFolderFile as jest.Mock).mockResolvedValue(driveItem);

    const result = await uploadSharedFolderFileAction("folder-1", file);

    expect(result).toEqual({ success: true, message: "파일이 업로드되었습니다.", data: driveItem });
  });

  it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
    const file = { size: 1024 } as File;
    (uploadSharedFolderFile as jest.Mock).mockRejectedValue(new Error("업로드에 실패했습니다."));

    const result = await uploadSharedFolderFileAction("folder-1", file);

    expect(result).toEqual({ success: false, message: "업로드에 실패했습니다." });
  });
});

describe("createSharedFolderGoogleFileAction", () => {
  afterEach(() => jest.clearAllMocks());

  it("파일 이름이 비어있으면 service를 호출하지 않고 실패 결과를 반환한다", async () => {
    const result = await createSharedFolderGoogleFileAction({ name: "  ", type: "DOCS" });

    expect(result).toEqual({ success: false, message: "파일 이름을 입력해주세요." });
    expect(createSharedFolderGoogleFile).not.toHaveBeenCalled();
  });

  it("service 호출이 성공하면 성공 결과와 데이터를 반환한다", async () => {
    (createSharedFolderGoogleFile as jest.Mock).mockResolvedValue(driveItem);

    const result = await createSharedFolderGoogleFileAction({ name: "회의록", type: "DOCS" });

    expect(result).toEqual({ success: true, message: "Google 파일이 생성되었습니다.", data: driveItem });
  });

  it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
    (createSharedFolderGoogleFile as jest.Mock).mockRejectedValue(new Error("생성에 실패했습니다."));

    const result = await createSharedFolderGoogleFileAction({ name: "회의록", type: "DOCS" });

    expect(result).toEqual({ success: false, message: "생성에 실패했습니다." });
  });
});

describe("updateSharedFolderContentAction", () => {
  afterEach(() => jest.clearAllMocks());

  it("이름과 이동 위치가 모두 없으면 service를 호출하지 않고 실패 결과를 반환한다", async () => {
    const result = await updateSharedFolderContentAction("item-1", {});

    expect(result).toEqual({ success: false, message: "변경할 이름 또는 이동할 위치를 입력해주세요." });
    expect(updateSharedFolderContent).not.toHaveBeenCalled();
  });

  it("이름이 있으면 트리밍한 이름으로 service를 호출하고 성공 결과를 반환한다", async () => {
    (updateSharedFolderContent as jest.Mock).mockResolvedValue(driveItem);

    const result = await updateSharedFolderContentAction("item-1", { name: "  새 이름  " });

    expect(updateSharedFolderContent).toHaveBeenCalledWith("item-1", { name: "새 이름" });
    expect(result).toEqual({ success: true, message: "이름 변경·이동이 완료되었습니다.", data: driveItem });
  });

  it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
    (updateSharedFolderContent as jest.Mock).mockRejectedValue(new Error("이동에 실패했습니다."));

    const result = await updateSharedFolderContentAction("item-1", { parentId: "folder-2" });

    expect(result).toEqual({ success: false, message: "이동에 실패했습니다." });
  });
});

describe("deleteSharedFolderContentAction", () => {
  afterEach(() => jest.clearAllMocks());

  it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
    (deleteSharedFolderContent as jest.Mock).mockResolvedValue(undefined);

    const result = await deleteSharedFolderContentAction("item-1");

    expect(result).toEqual({ success: true, message: "휴지통으로 이동되었습니다." });
  });

  it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
    (deleteSharedFolderContent as jest.Mock).mockRejectedValue(new Error("삭제할 수 없습니다."));

    const result = await deleteSharedFolderContentAction("item-1");

    expect(result).toEqual({ success: false, message: "삭제할 수 없습니다." });
  });
});

describe("downloadSharedFolderContentAction", () => {
  afterEach(() => jest.clearAllMocks());

  it("service 호출이 성공하면 base64로 인코딩한 파일과 메타데이터를 반환한다", async () => {
    const blob = { arrayBuffer: () => Promise.resolve(Buffer.from("file-content")) };
    (downloadSharedFolderContent as jest.Mock).mockResolvedValue({
      blob,
      mimeType: "application/pdf",
      fileName: "report.pdf",
    });

    const result = await downloadSharedFolderContentAction("item-1", { format: "PDF" });

    expect(result).toEqual({
      success: true,
      message: "다운로드에 성공했습니다.",
      file: Buffer.from("file-content").toString("base64"),
      mimeType: "application/pdf",
      fileName: "report.pdf",
    });
  });

  it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
    (downloadSharedFolderContent as jest.Mock).mockRejectedValue(new Error("다운로드할 수 없습니다."));

    const result = await downloadSharedFolderContentAction("item-1");

    expect(result).toEqual({ success: false, message: "다운로드할 수 없습니다." });
  });
});
