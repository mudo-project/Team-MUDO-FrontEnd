import { ChevronRight, CircleDot, PencilLine, Trash2 } from "lucide-react";

type MemoCardMenuProps = {
  onEdit: () => void;
  onChangeColor: () => void;
  onDelete: () => void;
};

export default function MemoCardMenu({ onEdit, onChangeColor, onDelete }: MemoCardMenuProps) {
  return (
    <div data-memo-menu className="absolute right-2 top-7 z-10 w-[150px] rounded-xl border border-[#E6EBE7] bg-white py-1 text-[11px] text-[#425466] shadow-[0_10px_24px_rgba(15,23,42,0.14)]">
      <button className="flex h-9 w-full items-center gap-2 px-3 text-left hover:bg-[#F8FAFC]" type="button" onClick={onEdit}>
        <PencilLine className="size-3.5" strokeWidth={1.8} />
        수정
      </button>
      <button className="flex h-9 w-full items-center gap-2 border-b border-[#E6EBE7] px-3 text-left hover:bg-[#F8FAFC]" type="button" onClick={onChangeColor}>
        <CircleDot className="size-3.5" strokeWidth={1.8} />
        색상 변경
        <ChevronRight className="ml-auto size-3.5" strokeWidth={1.8} />
      </button>
      <button className="flex h-9 w-full items-center gap-2 px-3 text-left text-[#C65A50] hover:bg-[#FEF2F2]" type="button" onClick={onDelete}>
        <Trash2 className="size-3.5" strokeWidth={1.8} />
        삭제
      </button>
    </div>
  );
}
