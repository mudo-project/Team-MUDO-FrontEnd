import { Plus, Send } from "lucide-react";

export default function MessageInput() {
    return (
        <form className="flex h-[70px] shrink-0 items-center gap-3 border-t border-[#D7E8DB] bg-white px-6">
            <button
                type="button"
                className="text-[#64748B]"
                aria-label="첨부 추가"
            >
                <Plus className="size-4" strokeWidth={1.7} />
            </button>
            <label
                className="sr-only"
                htmlFor="message"
            >
                메시지 입력
            </label>
            <input
                id="message"
                className="h-11 min-w-0 flex-1 rounded-[7px] border border-[#D7E8DB] bg-white px-3 text-[11px] outline-none placeholder:text-[#94A3B8]"
                placeholder="메시지를 입력하세요"
            />
            <button
                type="submit"
                className="flex size-9 items-center justify-center text-[#64748B]"
                aria-label="메시지 전송"
            >
                <Send className="size-4" strokeWidth={1.7} />
            </button>
        </form>
    );
}
