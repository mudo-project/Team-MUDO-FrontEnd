import { Search, UserRoundPlus } from "lucide-react";

export default function ChatRoomHeader() {
    return (
        <header className="flex h-[51px] shrink-0 items-center border-b border-[#D7E8DB] bg-white px-6">
            <h1 className="text-[16px] font-bold tracking-[-0.02em]">전체 공지</h1>
            <span className="ml-2 text-[10px] text-[#64748B]">참여자 8명</span>
            <div className="ml-auto flex items-center gap-3 text-[#64748B]">
                <button
                    type="button"
                    aria-label="대화 검색"
                >
                    <Search className="size-4" strokeWidth={1.7} />
                </button>
                <button
                    type="button"
                    aria-label="참여자 목록 확인"
                >
                    <UserRoundPlus className="size-4" strokeWidth={1.7} />
                </button>
            </div>
        </header>
    );
}
