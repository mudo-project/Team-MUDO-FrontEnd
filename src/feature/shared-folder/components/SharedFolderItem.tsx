import { EllipsisVertical, FileSpreadsheet, FileText, Folder, Presentation } from "lucide-react";

type SharedFolderItemProps = {
  item: SharedFolderItemData;
};

export const FILE_TYPE_LABEL: Record<SharedFolderFileType, string> = {
  GOOGLE_DOCS: "Google Docs",
  GOOGLE_SHEETS: "Google Sheets",
  GOOGLE_SLIDES: "Google Slides",
  UPLOADED: "파일",
};

function ItemIcon({ item }: { item: SharedFolderItemData }) {
  if (item.kind === "FOLDER") {
    return (
      <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-[#FDF1D8] text-[#C9971C]">
        <Folder className="size-4" strokeWidth={1.8} />
      </span>
    );
  }

  switch (item.fileType) {
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

export default function SharedFolderItem({ item }: SharedFolderItemProps) {
  const typeLabel = item.kind === "FOLDER" ? "폴더" : FILE_TYPE_LABEL[item.fileType ?? "UPLOADED"];

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_140px_110px_150px_90px_36px] items-center gap-3 border-b border-[#F1F5F1] px-4 py-2.5 last:border-b-0 hover:bg-[#F8FAFC]">
      <div className="flex min-w-0 items-center gap-2.5">
        <ItemIcon item={item} />
        <span className="min-w-0 truncate text-[12px] font-medium text-[#0F172A]">{item.name}</span>
      </div>
      <span className="truncate text-[11px] text-[#64748B]">{typeLabel}</span>
      <span className="truncate text-[11px] text-[#64748B]">{item.modifierName}</span>
      <span className="truncate text-[11px] text-[#64748B]">{item.modifiedAt}</span>
      <span className="truncate text-[11px] text-[#64748B]">{item.size}</span>
      <div className="flex justify-end">
        <span aria-label={`${item.name} 더보기`} className="flex size-7 items-center justify-center rounded-md text-[#94A3B8]">
          <EllipsisVertical className="size-3.5" strokeWidth={1.8} />
        </span>
      </div>
    </div>
  );
}
