import { EllipsisVertical, FileSpreadsheet, FileText, Folder, Presentation } from "lucide-react";

import SharedFolderItemMenu from "./SharedFolderItemMenu";
import { formatSharedFolderModifiedAt, getSharedFolderFileType, getSharedFolderItemKind } from "../sharedFolderFormat";

type SharedFolderItemProps = {
  isMenuOpen: boolean;
  item: SharedFolderDriveItemData;
  onDelete: () => void;
  onDownload: () => void;
  onFolderOpen: () => void;
  onMenuSelect: () => void;
  onMenuToggle: () => void;
  onMove: () => void;
  onOpenPreview: () => void;
  onRename: () => void;
};

export const FILE_TYPE_LABEL: Record<SharedFolderFileType, string> = {
  GOOGLE_DOCS: "Google Docs",
  GOOGLE_SHEETS: "Google Sheets",
  GOOGLE_SLIDES: "Google Slides",
  UPLOADED: "파일",
};

function ItemIcon({ kind, fileType }: { kind: SharedFolderItemKind; fileType: SharedFolderFileType }) {
  if (kind === "FOLDER") {
    return (
      <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-[#FDF1D8] text-[#C9971C]">
        <Folder className="size-4" strokeWidth={1.8} />
      </span>
    );
  }

  switch (fileType) {
    case "GOOGLE_DOCS":
      return (
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-[#E3EDFF] text-[#3B6FE0]">
          <FileText className="size-4" strokeWidth={1.8} />
        </span>
      );
    case "GOOGLE_SHEETS":
      return (
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-[#E1F5EA] text-[#1E9E5A]">
          <FileSpreadsheet className="size-4" strokeWidth={1.8} />
        </span>
      );
    case "GOOGLE_SLIDES":
      return (
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-[#FDEBD8] text-[#E08A3B]">
          <Presentation className="size-4" strokeWidth={1.8} />
        </span>
      );
    default:
      return (
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-[#FCE8E8] text-[#D64545]">
          <FileText className="size-4" strokeWidth={1.8} />
        </span>
      );
  }
}

export default function SharedFolderItem({ isMenuOpen, item, onDelete, onDownload, onFolderOpen, onMenuSelect, onMenuToggle, onMove, onOpenPreview, onRename }: SharedFolderItemProps) {
  const kind = getSharedFolderItemKind(item);
  const fileType = getSharedFolderFileType(item);
  const typeLabel = kind === "FOLDER" ? "폴더" : FILE_TYPE_LABEL[fileType];

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_140px_110px_150px_90px_36px] items-center gap-3 border-b border-[#F1F5F1] px-4 py-2.5 last:border-b-0 hover:bg-[#F8FAFC]">
      <div className="flex min-w-0 items-center gap-2.5">
        <ItemIcon fileType={fileType} kind={kind} />
        {kind === "FOLDER" ? (
          <button className="min-w-0 truncate text-left text-[12px] font-medium text-[#0F172A]" type="button" onClick={onFolderOpen}>
            {item.name}
          </button>
        ) : (
          <span className="min-w-0 truncate text-[12px] font-medium text-[#0F172A]">{item.name}</span>
        )}
      </div>
      <span className="truncate text-[11px] text-[#64748B]">{typeLabel}</span>
      <span className="truncate text-[11px] text-[#64748B]">-</span>
      <span className="truncate text-[11px] text-[#64748B]">{formatSharedFolderModifiedAt(item.modifiedAt)}</span>
      <span className="truncate text-[11px] text-[#64748B]">-</span>
      <div data-shared-folder-item-menu-control className="relative flex justify-end">
        <button
          aria-expanded={isMenuOpen}
          aria-label={`${item.name} 더보기`}
          className="flex size-7 items-center justify-center rounded-md text-[#94A3B8]"
          type="button"
          onClick={onMenuToggle}
        >
          <EllipsisVertical className="size-3.5" strokeWidth={1.8} />
        </button>
        {isMenuOpen && (
          <SharedFolderItemMenu
            kind={kind}
            onDelete={onDelete}
            onDownload={onDownload}
            onMove={onMove}
            onOpenPreview={onOpenPreview}
            onRename={onRename}
            onViewDetail={onMenuSelect}
          />
        )}
      </div>
    </div>
  );
}
