import { useMemoStore } from "@/store/useMemoStore";
import { NotebookPen } from "lucide-react";

export default function OpenMemo() {
    const toggleMemo = useMemoStore((state) => state.toggleMemo)

    return (
        <div className="px-2.5 py-1.5 rounded-[5px] text-[#CBD5E1] hover:bg-white/5">
            <button onClick={toggleMemo} className="flex h-[25px] gap-2.5 w-full items-center text-[10px]" type="button">
                <NotebookPen className="h-3.5 w-3.5" strokeWidth={1.7} />
                <p className="ml-2 pt-[4px] text-[13px]">메모</p>
            </button>
        </div>
    );
}
