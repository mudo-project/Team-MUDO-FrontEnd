import { Download, FolderInput, PencilLine, ScanEye, Trash2 } from "lucide-react";

type SharedFolderItemMenuProps = {
  downloadable?: boolean;
  kind: SharedFolderItemKind;
  onRename: () => void;
  onMove: () => void;
  onDelete: () => void;
  onOpenPreview?: () => void;
  onDownload?: () => void;
};

export default function SharedFolderItemMenu({
  downloadable,
  kind,
  onRename,
  onMove,
  onDelete,
  onOpenPreview,
  onDownload,
}: SharedFolderItemMenuProps) {
  return (
    <div
      data-shared-folder-item-menu
      className="absolute right-0 top-7 z-20 w-[168px] rounded-xl border border-[#E6EBE7] bg-white py-1 text-[12px] text-[#425466] shadow-[0_10px_24px_rgba(15,23,42,0.14)]"
    >
      {kind === "FILE" && (
        <>
          <button
            className={`flex h-9 w-full items-center gap-2 px-3 text-left hover:bg-[#F8FAFC] ${downloadable ? "" : "border-b border-[#E6EBE7]"}`}
            type="button"
            onClick={onOpenPreview}
          >
            <ScanEye className="size-3.5" strokeWidth={1.8} />
            미리보기 열기
          </button>
          {downloadable && (
            <button
              className="flex h-9 w-full items-center gap-2 border-b border-[#E6EBE7] px-3 text-left hover:bg-[#F8FAFC]"
              type="button"
              onClick={onDownload}
            >
              <Download className="size-3.5" strokeWidth={1.8} />
              다운로드
            </button>
          )}
        </>
      )}
      <button 
        className="flex h-9 w-full items-center gap-2 px-3 text-left hover:bg-[#F8FAFC]" 
        type="button" 
        onClick={onRename}
      >
        <PencilLine className="size-3.5" strokeWidth={1.8} />
        이름 변경
      </button>
      <button 
        className="flex h-9 w-full items-center gap-2 border-b border-[#E6EBE7] px-3 text-left hover:bg-[#F8FAFC]" 
        type="button" 
        onClick={onMove}
      >
        <FolderInput className="size-3.5" strokeWidth={1.8} />
        이동
      </button>
      <button 
        className="flex h-9 w-full items-center gap-2 px-3 text-left text-[#C65A50] hover:bg-[#FEF2F2]" 
        type="button" 
        onClick={onDelete}
      >
        <Trash2 className="size-3.5" strokeWidth={1.8} />
        삭제
      </button>
    </div>
  );
}
