// 공유폴더 항목 종류
type SharedFolderItemKind = "FOLDER" | "FILE";

// 공유폴더 파일 종류
type SharedFolderFileType = "GOOGLE_DOCS" | "GOOGLE_SHEETS" | "GOOGLE_SLIDES" | "UPLOADED";

// 공유폴더 목록 항목(폴더/파일 공통)
interface SharedFolderItemData {
    id: number;
    parentId: number | null;
    kind: SharedFolderItemKind;
    name: string;
    fileType?: SharedFolderFileType;
    modifierName: string;
    modifiedAt: string;
    size: string;
}
