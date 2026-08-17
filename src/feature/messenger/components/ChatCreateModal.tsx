'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { toast } from "sonner";
import { createChatRoomAction, searchUsersAction } from "../actions";
import { getInitials } from "../utils";

export default function ChatCreateModal({ onClose }: { onClose: () => void }) {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [members, setMembers] = useState<MessengerUserSearchItemData[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [name, setName] = useState("");

    useEffect(() => {
        searchUsersAction(query.trim() || undefined).then(setMembers);
    }, [query]);

    const toggleMember = (userId: number) => {
        setSelectedIds((prev) =>
            prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
        );
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const result = await createChatRoomAction(selectedIds, name.trim() || undefined);
        if (result.success && result.chatRoomId) {
            toast.success(result.message);
            onClose();
            router.push(`/messenger/${result.chatRoomId}`);
        } else {
            toast.error(result.message);
        }
    };

    return (
        <div className="fixed top-0 left-0 z-999 h-screen w-screen bg-[#162236]/45">
            <form className="fixed top-1/2 left-1/2 z-1000 max-h-[85vh] w-[calc(100%-2rem)] max-w-[520px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[12px] bg-white p-6 shadow-[0_8px_12px_rgba(22,34,54,0.12)] scrollbar-hide" onSubmit={handleSubmit}>
                <div className="flex h-[27px] w-full items-center">
                    <h2 className="text-[18px] font-bold leading-[27px] text-[#0F172A]">새 채팅</h2>
                    <button
                        aria-label="새 채팅 모달 닫기"
                        className="ml-auto flex size-[18px] items-center justify-center text-[#64748B]"
                        onClick={onClose}
                        type="button"
                    >
                        <X className="size-[18px]" strokeWidth={1.5} />
                    </button>
                </div>

                <label className="mt-5 flex h-11 w-full items-center rounded-[8px] border border-[#D7E8DB] px-3">
                    <Search className="size-4 text-[#94A3B8]" strokeWidth={1.8} />
                    <input
                        aria-label="소속 인원 검색"
                        className="min-w-0 flex-1 border-0 bg-transparent pl-2 text-[13px] outline-none placeholder:text-[#94A3B8]"
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="이름으로 검색"
                        value={query}
                    />
                </label>

                <div className="mt-3 w-full">
                    <p className="px-1 pb-2 text-[11px] font-medium text-[#94A3B8]">소속 인원</p>
                    <div className="max-h-52 w-full overflow-y-auto rounded-[8px] border border-[#D7E8DB]">
                        {members.length === 0 ? (
                            <p className="px-3 py-6 text-center text-[12px] text-[#94A3B8]">일치하는 인원이 없습니다</p>
                        ) : (
                            members.map((member) => {
                                const isSelected = selectedIds.includes(member.userId);
                                return (
                                    <button
                                        className={`flex w-full items-center gap-3 px-3 py-2.5 text-left ${isSelected ? "bg-[#EEF3F0]" : "bg-white hover:bg-[#F7F9F7]"}`}
                                        key={member.userId}
                                        onClick={() => toggleMember(member.userId)}
                                        type="button"
                                    >
                                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#E2ECE4] text-[10px] font-semibold text-[#285D3B]">
                                            {getInitials(member.name)}
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <strong className="block truncate text-[13px] font-semibold text-[#0F172A]">{member.name}</strong>
                                            <span className="block truncate text-[11px] text-[#94A3B8]">{member.username}</span>
                                        </span>
                                        <span
                                            className={`flex size-4 shrink-0 items-center justify-center rounded border ${isSelected ? "border-[#2C8D50] bg-[#2C8D50]" : "border-[#D7E8DB] bg-white"}`}
                                        >
                                            {isSelected && <span className="size-1.5 rounded-sm bg-white" />}
                                        </span>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>

                <div className="mt-5 w-full">
                    <label
                        className="block pb-1.5 text-[13px] font-medium leading-[19.5px] text-[#0F172A]"
                        htmlFor="chat-room-title"
                    >
                        채팅방 제목 (선택)
                    </label>
                    <input
                        className="h-11 w-full rounded-[8px] border border-[#D7E8DB] px-3 text-[14px] font-normal text-[#0F172A] placeholder:text-[#0F172A]/50 focus:outline-none"
                        id="chat-room-title"
                        name="title"
                        onChange={(event) => setName(event.target.value)}
                        placeholder="채팅방 제목을 입력하세요"
                        value={name}
                    />
                </div>

                <div className="mt-5 flex w-full justify-end gap-2">
                    <button
                        className="h-11 rounded-[8px] border border-[#D7E8DB] bg-white px-5 text-[14px] font-normal leading-[21px] text-[#0F172A]"
                        onClick={onClose}
                        type="button"
                    >
                        취소
                    </button>
                    <button
                        className={`h-11 rounded-[8px] px-5 text-[14px] font-semibold leading-[21px] ${selectedIds.length > 0 ? "bg-[#172033] text-white" : "bg-[#D7E8DB] text-[#64748B]"}`}
                        disabled={selectedIds.length === 0}
                        type="submit"
                    >
                        만들기
                    </button>
                </div>
            </form>
        </div>
    );
}
