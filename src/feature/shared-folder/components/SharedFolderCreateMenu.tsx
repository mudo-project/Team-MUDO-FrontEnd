import { FileSpreadsheet, FileText, FolderPlus, Presentation, Upload } from "lucide-react";

export type SharedFolderCreateOption = "FOLDER" | "GOOGLE_DOCS" | "GOOGLE_SHEETS" | "GOOGLE_SLIDES" | "UPLOAD";

type SharedFolderCreateMenuProps = {
  onSelect: (option: SharedFolderCreateOption) => void;
};

export default function SharedFolderCreateMenu({ onSelect }: SharedFolderCreateMenuProps) {
  return (
    <div
      data-shared-folder-create-menu
      className="absolute right-0 top-full z-20 mt-1 w-[180px] rounded-xl border border-[#E6EBE7] bg-white py-1 text-[12px] text-[#0F172A] shadow-[0_10px_24px_rgba(15,23,42,0.14)]"
    >
      <button 
        className="flex h-9 w-full items-center gap-2 border-b border-[#E6EBE7] px-3 text-left hover:bg-[#F8FAFC]" 
        type="button" 
        onClick={() => onSelect("FOLDER")}
      >
        <FolderPlus className="size-3.5 text-[#C9971C]" strokeWidth={1.8} />
        새 폴더
      </button>
      <button 
        className="flex h-9 w-full items-center gap-2 px-3 text-left hover:bg-[#F8FAFC]" 
        type="button" 
        onClick={() => onSelect("GOOGLE_DOCS")}
      >
        <FileText className="size-3.5 text-[#3B6FE0]" strokeWidth={1.8} />
        Google Docs
      </button>
      <button 
        className="flex h-9 w-full items-center gap-2 px-3 text-left hover:bg-[#F8FAFC]" 
        type="button" 
        onClick={() => onSelect("GOOGLE_SHEETS")}
      >
        <FileSpreadsheet className="size-3.5 text-[#1E9E5A]" strokeWidth={1.8} />
        Google Sheets
      </button>
      <button 
        className="flex h-9 w-full items-center gap-2 border-b border-[#E6EBE7] px-3 text-left hover:bg-[#F8FAFC]" 
        type="button" 
        onClick={() => onSelect("GOOGLE_SLIDES")}
      >
        <Presentation className="size-3.5 text-[#E08A3B]" strokeWidth={1.8} />
        Google Slides
      </button>
      <button 
        className="flex h-9 w-full items-center gap-2 px-3 text-left hover:bg-[#F8FAFC]" 
        type="button" 
        onClick={() => onSelect("UPLOAD")}
      >
        <Upload className="size-3.5 text-[#64748B]" strokeWidth={1.8} />
        파일 업로드
      </button>
    </div>
  );
}
