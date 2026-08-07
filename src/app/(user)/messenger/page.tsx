import { MessageSquarePlus } from "lucide-react";
import ChatSidebar from "@/feature/messenger/components/ChatSidebar";
import ChatRoom from "@/feature/messenger/components/ChatRoom";

export default function MessengetPage() {
    return (
        <main className="flex h-[calc(100dvh-3.25rem)] min-h-0 min-w-0 overflow-hidden bg-[#FCFCFC] text-[#0F172A]">
            <section
                className="flex min-h-0 w-[282px] shrink-0 flex-col border-r border-[#D7E8DB] bg-white"
                aria-label="대화 목록"
            >
                <div className="flex h-11 shrink-0 border-b border-[#D7E8DB]">
                    <button
                        className="flex-1 border-b-2 border-[#2C8D50] text-[13px] font-semibold text-[#0F172A]"
                        type="button"
                    >
                        채팅
                    </button>
                    <button
                        className="flex-1 text-[13px] text-[#64748B]"
                        type="button"
                    >
                        업무
                    </button>
                    <button
                        className="flex w-11 items-center justify-center text-[#64748B]"
                        type="button"
                        aria-label="새 대화 만들기"
                    >
                        <MessageSquarePlus className="size-4" strokeWidth={1.7} />
                    </button>
                </div>
                <ChatSidebar />
            </section>

            <ChatRoom />
        </main>
    );
}
