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
  // 실행 환경(로컬/CI)마다 시스템 타임존이 달라 UTC 시각을 하드코딩하면 결과가 달라진다.
  // 로컬 타임존 기준으로 Date를 생성해 toISOString()으로 왕복시키면 환경에 관계없이 같은 지역 시각으로 복원된다.
  it("시각을 'YYYY.MM.DD HH:mm' 형태로 변환한다", () => {
    const localDate = new Date(2026, 7, 1, 18, 5);

    expect(formatSharedFolderModifiedAt(localDate.toISOString())).toBe("2026.08.01 18:05");
  });

  it("한 자리 월·일·시·분은 0으로 채운다", () => {
    const localDate = new Date(2026, 0, 2, 3, 4);

    expect(formatSharedFolderModifiedAt(localDate.toISOString())).toBe("2026.01.02 03:04");
  });
});
