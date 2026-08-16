import {
  formatSharedFolderModifiedAt,
  getSharedFolderDownloadFormats,
  getSharedFolderFileType,
  getSharedFolderItemKind,
} from "./sharedFolderFormat";

function makeItem(mimeType: string): SharedFolderDriveItemData {
  return {
    id: "item-1",
    name: "이름",
    mimeType,
    viewUrl: "https://drive.google.com/item-1",
    downloadable: true,
    modifiedAt: "2026-08-01T09:05:00.000Z",
  };
}

describe("getSharedFolderItemKind", () => {
  it("mimeType이 Google Drive 폴더 타입이면 FOLDER를 반환한다", () => {
    expect(getSharedFolderItemKind(makeItem("application/vnd.google-apps.folder"))).toBe("FOLDER");
  });

  it("mimeType이 폴더 타입이 아니면 FILE을 반환한다", () => {
    expect(getSharedFolderItemKind(makeItem("application/pdf"))).toBe("FILE");
  });
});

describe("getSharedFolderFileType", () => {
  it("Google Docs mimeType이면 GOOGLE_DOCS를 반환한다", () => {
    expect(getSharedFolderFileType(makeItem("application/vnd.google-apps.document"))).toBe("GOOGLE_DOCS");
  });

  it("Google Sheets mimeType이면 GOOGLE_SHEETS를 반환한다", () => {
    expect(getSharedFolderFileType(makeItem("application/vnd.google-apps.spreadsheet"))).toBe("GOOGLE_SHEETS");
  });

  it("Google Slides mimeType이면 GOOGLE_SLIDES를 반환한다", () => {
    expect(getSharedFolderFileType(makeItem("application/vnd.google-apps.presentation"))).toBe("GOOGLE_SLIDES");
  });

  it("그 외 mimeType이면 UPLOADED를 반환한다", () => {
    expect(getSharedFolderFileType(makeItem("application/pdf"))).toBe("UPLOADED");
  });
});

describe("getSharedFolderDownloadFormats", () => {
  it("Google Docs는 PDF/DOCX 형식을 반환한다", () => {
    expect(getSharedFolderDownloadFormats(makeItem("application/vnd.google-apps.document"))).toEqual(["PDF", "DOCX"]);
  });

  it("Google Sheets는 PDF/XLSX 형식을 반환한다", () => {
    expect(getSharedFolderDownloadFormats(makeItem("application/vnd.google-apps.spreadsheet"))).toEqual(["PDF", "XLSX"]);
  });

  it("Google Slides는 PDF/PPTX 형식을 반환한다", () => {
    expect(getSharedFolderDownloadFormats(makeItem("application/vnd.google-apps.presentation"))).toEqual(["PDF", "PPTX"]);
  });

  it("업로드 파일은 빈 배열을 반환한다", () => {
    expect(getSharedFolderDownloadFormats(makeItem("application/pdf"))).toEqual([]);
  });
});

describe("formatSharedFolderModifiedAt", () => {
  const originalTz = process.env.TZ;

  beforeAll(() => {
    process.env.TZ = "Asia/Seoul";
  });

  afterAll(() => {
    process.env.TZ = originalTz;
  });

  it("ISO 시각을 한국 표준시 'YYYY.MM.DD HH:mm' 형태로 변환한다", () => {
    expect(formatSharedFolderModifiedAt("2026-08-01T09:05:00.000Z")).toBe("2026.08.01 18:05");
  });

  it("한 자리 월·일·시·분은 0으로 채운다", () => {
    expect(formatSharedFolderModifiedAt("2026-01-01T20:04:00.000Z")).toBe("2026.01.02 05:04");
  });
});
