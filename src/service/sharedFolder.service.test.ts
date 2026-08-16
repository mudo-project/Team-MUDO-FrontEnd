import { fetchWithAuth } from "@/lib/fetch";
import {
  createSharedFolderFolder,
  createSharedFolderGoogleFile,
  deleteSharedFolderContent,
  downloadSharedFolderContent,
  getSharedFolderContentDetail,
  getSharedFolderContentList,
  getSharedFolderRootStatus,
  recreateSharedFolderRoot,
  searchSharedFolderContent,
  updateSharedFolderContent,
  uploadSharedFolderFile,
} from "./sharedFolder.service";

jest.mock("../lib/fetch");

const mockedFetch = fetchWithAuth as jest.Mock;

const okJsonResponse = (data: unknown) => ({
  ok: true,
  json: () => Promise.resolve(data),
});

const failJsonResponse = (message: string) => ({
  ok: false,
  headers: { get: () => "application/json" },
  json: () => Promise.resolve({ message }),
});

const driveItem: SharedFolderDriveItemData = {
  id: "item-1",
  name: "회의록",
  mimeType: "application/vnd.google-apps.document",
  viewUrl: "https://drive.google.com/item-1",
  downloadable: false,
  modifiedAt: "2026-08-01T00:00:00.000Z",
};

describe("getSharedFolderRootStatus", () => {
  afterEach(() => jest.clearAllMocks());

  it("응답이 정상이면 루트 상태 데이터를 반환한다", async () => {
    const data = { ready: true, rootId: "root-1" };
    mockedFetch.mockResolvedValue(okJsonResponse({ data }));

    const result = await getSharedFolderRootStatus();

    expect(mockedFetch).toHaveBeenCalledWith("/api/shared-files/root");
    expect(result).toEqual(data);
  });

  it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
    mockedFetch.mockResolvedValue(failJsonResponse("공유폴더 시스템 루트 상태 조회에 실패하였습니다."));

    await expect(getSharedFolderRootStatus()).rejects.toThrow("공유폴더 시스템 루트 상태 조회에 실패하였습니다.");
  });
});

describe("recreateSharedFolderRoot", () => {
  afterEach(() => jest.clearAllMocks());

  it("응답이 정상이면 재생성된 루트 상태 데이터를 반환한다", async () => {
    const data = { ready: true, rootId: "root-1" };
    mockedFetch.mockResolvedValue(okJsonResponse({ data }));

    const result = await recreateSharedFolderRoot();

    expect(mockedFetch).toHaveBeenCalledWith("/api/shared-files/root/recreation", { method: "POST" });
    expect(result).toEqual(data);
  });

  it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
    mockedFetch.mockResolvedValue(failJsonResponse("공유폴더 시스템 루트 재생성에 실패하였습니다."));

    await expect(recreateSharedFolderRoot()).rejects.toThrow("공유폴더 시스템 루트 재생성에 실패하였습니다.");
  });
});

describe("getSharedFolderContentList", () => {
  afterEach(() => jest.clearAllMocks());

  it("파라미터가 없으면 쿼리스트링 없이 요청한다", async () => {
    const data = { items: [], hasNext: false, nextCursor: null };
    mockedFetch.mockResolvedValue(okJsonResponse({ data }));

    const result = await getSharedFolderContentList();

    expect(mockedFetch).toHaveBeenCalledWith("/api/shared-files/items");
    expect(result).toEqual(data);
  });

  it("파라미터가 있으면 쿼리스트링을 포함해 요청한다", async () => {
    const data = { items: [driveItem], hasNext: true, nextCursor: "cursor-2" };
    mockedFetch.mockResolvedValue(okJsonResponse({ data }));

    const result = await getSharedFolderContentList({ parentId: "folder-1", cursor: "cursor-1", size: 100 });

    expect(mockedFetch).toHaveBeenCalledWith("/api/shared-files/items?parentId=folder-1&cursor=cursor-1&size=100");
    expect(result).toEqual(data);
  });

  it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
    mockedFetch.mockResolvedValue(failJsonResponse("공유폴더 목록 조회에 실패하였습니다."));

    await expect(getSharedFolderContentList()).rejects.toThrow("공유폴더 목록 조회에 실패하였습니다.");
  });
});

describe("getSharedFolderContentDetail", () => {
  afterEach(() => jest.clearAllMocks());

  it("응답이 정상이면 상세 데이터를 반환한다", async () => {
    mockedFetch.mockResolvedValue(okJsonResponse({ data: driveItem }));

    const result = await getSharedFolderContentDetail("item-1");

    expect(mockedFetch).toHaveBeenCalledWith("/api/shared-files/items/item-1");
    expect(result).toEqual(driveItem);
  });

  it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
    mockedFetch.mockResolvedValue(failJsonResponse("파일·폴더 상세 조회에 실패하였습니다."));

    await expect(getSharedFolderContentDetail("item-1")).rejects.toThrow("파일·폴더 상세 조회에 실패하였습니다.");
  });
});

describe("searchSharedFolderContent", () => {
  afterEach(() => jest.clearAllMocks());

  it("응답이 정상이면 검색 결과를 반환한다", async () => {
    const data = { items: [driveItem], hasNext: false, nextCursor: null };
    mockedFetch.mockResolvedValue(okJsonResponse({ data }));

    const result = await searchSharedFolderContent({ keyword: "회의록", type: "FILE" });

    expect(mockedFetch).toHaveBeenCalledWith("/api/shared-files/items/search?keyword=%ED%9A%8C%EC%9D%98%EB%A1%9D&type=FILE");
    expect(result).toEqual(data);
  });

  it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
    mockedFetch.mockResolvedValue(failJsonResponse("공유폴더 검색에 실패하였습니다."));

    await expect(searchSharedFolderContent({ keyword: "회의록" })).rejects.toThrow("공유폴더 검색에 실패하였습니다.");
  });
});

describe("createSharedFolderFolder", () => {
  afterEach(() => jest.clearAllMocks());

  it("응답이 정상이면 생성된 폴더 데이터를 반환한다", async () => {
    mockedFetch.mockResolvedValue(okJsonResponse({ data: driveItem }));

    const payload = { parentId: "root-1", name: "새 폴더" };
    const result = await createSharedFolderFolder(payload);

    expect(mockedFetch).toHaveBeenCalledWith("/api/shared-files/folders", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    expect(result).toEqual(driveItem);
  });

  it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
    mockedFetch.mockResolvedValue(failJsonResponse("폴더 생성에 실패하였습니다."));

    await expect(createSharedFolderFolder({ name: "새 폴더" })).rejects.toThrow("폴더 생성에 실패하였습니다.");
  });
});

describe("uploadSharedFolderFile", () => {
  afterEach(() => jest.clearAllMocks());

  it("parentId가 있으면 쿼리스트링에 포함해 업로드한다", async () => {
    mockedFetch.mockResolvedValue(okJsonResponse({ data: driveItem }));
    const file = new File(["content"], "문서.pdf");

    const result = await uploadSharedFolderFile("folder-1", file);

    expect(mockedFetch).toHaveBeenCalledWith(
      "/api/shared-files/items/upload?parentId=folder-1",
      expect.objectContaining({ method: "POST" })
    );
    expect(result).toEqual(driveItem);
  });

  it("parentId가 없으면 쿼리스트링 없이 업로드한다", async () => {
    mockedFetch.mockResolvedValue(okJsonResponse({ data: driveItem }));
    const file = new File(["content"], "문서.pdf");

    await uploadSharedFolderFile(undefined, file);

    expect(mockedFetch).toHaveBeenCalledWith(
      "/api/shared-files/items/upload",
      expect.objectContaining({ method: "POST" })
    );
  });

  it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
    mockedFetch.mockResolvedValue(failJsonResponse("파일 업로드에 실패하였습니다."));

    await expect(uploadSharedFolderFile(undefined, new File(["content"], "문서.pdf"))).rejects.toThrow(
      "파일 업로드에 실패하였습니다."
    );
  });
});

describe("createSharedFolderGoogleFile", () => {
  afterEach(() => jest.clearAllMocks());

  it("응답이 정상이면 생성된 Google 파일 데이터를 반환한다", async () => {
    mockedFetch.mockResolvedValue(okJsonResponse({ data: driveItem }));

    const payload = { parentId: "root-1", name: "회의록", type: "DOCS" as const };
    const result = await createSharedFolderGoogleFile(payload);

    expect(mockedFetch).toHaveBeenCalledWith("/api/shared-files/google-files", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    expect(result).toEqual(driveItem);
  });

  it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
    mockedFetch.mockResolvedValue(failJsonResponse("Google 파일 생성에 실패하였습니다."));

    await expect(createSharedFolderGoogleFile({ name: "회의록", type: "DOCS" })).rejects.toThrow(
      "Google 파일 생성에 실패하였습니다."
    );
  });
});

describe("updateSharedFolderContent", () => {
  afterEach(() => jest.clearAllMocks());

  it("응답이 정상이면 수정된 데이터를 반환한다", async () => {
    mockedFetch.mockResolvedValue(okJsonResponse({ data: driveItem }));

    const payload = { name: "새 이름" };
    const result = await updateSharedFolderContent("item-1", payload);

    expect(mockedFetch).toHaveBeenCalledWith("/api/shared-files/items/item-1", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    expect(result).toEqual(driveItem);
  });

  it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
    mockedFetch.mockResolvedValue(failJsonResponse("이름 변경·이동에 실패하였습니다."));

    await expect(updateSharedFolderContent("item-1", { name: "새 이름" })).rejects.toThrow(
      "이름 변경·이동에 실패하였습니다."
    );
  });
});

describe("deleteSharedFolderContent", () => {
  afterEach(() => jest.clearAllMocks());

  it("응답이 정상이면 예외 없이 완료된다", async () => {
    mockedFetch.mockResolvedValue({ ok: true });

    await expect(deleteSharedFolderContent("item-1")).resolves.toBeUndefined();
    expect(mockedFetch).toHaveBeenCalledWith("/api/shared-files/items/item-1", { method: "DELETE" });
  });

  it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
    mockedFetch.mockResolvedValue(failJsonResponse("삭제에 실패하였습니다."));

    await expect(deleteSharedFolderContent("item-1")).rejects.toThrow("삭제에 실패하였습니다.");
  });
});

describe("downloadSharedFolderContent", () => {
  afterEach(() => jest.clearAllMocks());

  it("format이 있으면 쿼리스트링에 포함해 요청하고 blob·mimeType·파일명을 반환한다", async () => {
    const blob = new Blob(["file"]);
    mockedFetch.mockResolvedValue({
      ok: true,
      headers: {
        get: (key: string) => {
          if (key === "content-disposition") return 'attachment; filename="report.pdf"';
          if (key === "content-type") return "application/pdf";
          return null;
        },
      },
      blob: () => Promise.resolve(blob),
    });

    const result = await downloadSharedFolderContent("item-1", { format: "PDF" });

    expect(mockedFetch).toHaveBeenCalledWith("/api/shared-files/items/item-1/download?format=PDF");
    expect(result).toEqual({ blob, mimeType: "application/pdf", fileName: "report.pdf" });
  });

  it("Content-Disposition이 RFC 5987 형식이면 파일명을 디코딩한다", async () => {
    const blob = new Blob(["file"]);
    mockedFetch.mockResolvedValue({
      ok: true,
      headers: {
        get: (key: string) => {
          if (key === "content-disposition") return "attachment; filename*=UTF-8''%ED%9A%8C%EC%9D%98%EB%A1%9D.pdf";
          if (key === "content-type") return "application/pdf";
          return null;
        },
      },
      blob: () => Promise.resolve(blob),
    });

    const result = await downloadSharedFolderContent("item-1");

    expect(result.fileName).toBe("회의록.pdf");
  });

  it("Content-Disposition이 encoded-word(Q) 형식이면 파일명을 디코딩한다", async () => {
    const blob = new Blob(["file"]);
    mockedFetch.mockResolvedValue({
      ok: true,
      headers: {
        get: (key: string) => {
          if (key === "content-disposition") return 'attachment; filename="=?UTF-8?Q?=ED=9A=8C=EC=9D=98=EB=A1=9D.pdf?="';
          if (key === "content-type") return "application/pdf";
          return null;
        },
      },
      blob: () => Promise.resolve(blob),
    });

    const result = await downloadSharedFolderContent("item-1");

    expect(result.fileName).toBe("회의록.pdf");
  });

  it("Content-Disposition이 없으면 파일명으로 null을 반환한다", async () => {
    const blob = new Blob(["file"]);
    mockedFetch.mockResolvedValue({
      ok: true,
      headers: { get: () => null },
      blob: () => Promise.resolve(blob),
    });

    const result = await downloadSharedFolderContent("item-1");

    expect(result.fileName).toBeNull();
    expect(result.mimeType).toBe("application/octet-stream");
  });

  it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
    mockedFetch.mockResolvedValue(failJsonResponse("다운로드에 실패하였습니다."));

    await expect(downloadSharedFolderContent("item-1")).rejects.toThrow("다운로드에 실패하였습니다.");
  });
});
