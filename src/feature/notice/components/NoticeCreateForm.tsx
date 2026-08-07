import { Plus } from "lucide-react";

export default function NoticeCreateForm() {
    return (
        <button
            className="flex h-8 items-center gap-1.5 rounded-md bg-[#12182B] px-3.5 text-[11px] font-semibold text-white"
            type="button"
        >
            <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
            공지 작성
        </button>
    );
}
