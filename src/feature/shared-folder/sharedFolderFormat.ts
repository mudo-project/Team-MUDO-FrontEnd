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

export function formatSharedFolderModifiedAt(isoDate: string): string {
  const date = new Date(isoDate);
  const pad = (value: number) => String(value).padStart(2, "0");

  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
