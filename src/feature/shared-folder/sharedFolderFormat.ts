const FOLDER_MIME_TYPE = "application/vnd.google-apps.folder";

const GOOGLE_MIME_TYPE_TO_FILE_TYPE: Record<string, SharedFolderFileType> = {
  "application/vnd.google-apps.document": "GOOGLE_DOCS",
  "application/vnd.google-apps.spreadsheet": "GOOGLE_SHEETS",
  "application/vnd.google-apps.presentation": "GOOGLE_SLIDES",
};

export function getSharedFolderItemKind(item: SharedFolderDriveItemData): SharedFolderItemKind {
  return item.mimeType === FOLDER_MIME_TYPE ? "FOLDER" : "FILE";
}

export function getSharedFolderFileType(item: SharedFolderDriveItemData): SharedFolderFileType {
  return GOOGLE_MIME_TYPE_TO_FILE_TYPE[item.mimeType] ?? "UPLOADED";
}

const FILE_TYPE_TO_DOWNLOAD_FORMATS: Record<Exclude<SharedFolderFileType, "UPLOADED">, SharedFolderDownloadFormat[]> = {
  GOOGLE_DOCS: ["PDF", "DOCX"],
  GOOGLE_SHEETS: ["PDF", "XLSX"],
  GOOGLE_SLIDES: ["PDF", "PPTX"],
};

// Google Workspace 파일만 변환 형식을 선택할 수 있다. 일반 업로드 파일은 원본 다운로드만 가능해 빈 배열을 반환한다.
export function getSharedFolderDownloadFormats(item: SharedFolderDriveItemData): SharedFolderDownloadFormat[] {
  const fileType = getSharedFolderFileType(item);
  return fileType === "UPLOADED" ? [] : FILE_TYPE_TO_DOWNLOAD_FORMATS[fileType];
}

export function formatSharedFolderModifiedAt(isoDate: string): string {
  const date = new Date(isoDate);
  const pad = (value: number) => String(value).padStart(2, "0");

  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
