'use client'

import { useEffect, useState } from "react";
import { Search, Users, X } from "lucide-react";
import ChatMemberList from "./ChatMemberList";
import { getChatRoomMembersAction } from "../actions";

type ChatRoomHeaderProps = {
    roomId: number;
    roomName: string;
    isSearchOpen: boolean;
    searchQuery: string;
    onToggleSearch: () => void;
    onSearchQueryChange: (value: string) => void;
};

export default function ChatRoomHeader({ roomId, roomName, isSearchOpen, searchQuery, onToggleSearch, onSearchQueryChange }: ChatRoomHeaderProps) {
    const [isMemberListOpen, setIsMemberListOpen] = useState(false);
    const [members, setMembers] = useState<MessengerRoomMemberData[]>([]);

    useEffect(() => {
        getChatRoomMembersAction(roomId).then(setMembers);
    }, [roomId]);

    return (
        <header className="flex h-[51px] shrink-0 items-center border-b border-[#D7E8DB] bg-white px-6">
            {isSearchOpen
                ? (
                    <>
                        <label className="flex h-9 min-w-0 flex-1 items-center rounded-md border border-[#DCE8DB] bg-white px-3">
                            <Search className="size-3.5 shrink-0 text-[#718096]" strokeWidth={1.8} />
                            <input
                                aria-label="채팅방 내 메시지 검색"
                                autoFocus
                                className="min-w-0 flex-1 border-0 bg-transparent pl-2 text-[12px] outline-none placeholder:text-[#94A3B8]"
                                onChange={(event) => onSearchQueryChange(event.target.value)}
                                placeholder="메시지 검색"
                                value={searchQuery}
                            />
                        </label>
                        <button
                            aria-label="검색 닫기"
                            className="ml-3 flex size-6 shrink-0 items-center justify-center text-[#64748B]"
                            onClick={onToggleSearch}
                            type="button"
                        >
                            <X className="size-4" strokeWidth={1.7} />
                        </button>
                    </>
                )
                : (
                    <>
                        <h1 className="text-[16px] font-bold tracking-[-0.02em]">{roomName}</h1>
                        <span className="ml-2 text-[10px] text-[#64748B]">참여자 {members.length}명</span>
                        <div className="ml-auto flex items-center gap-3 text-[#64748B]">
                            <button
                                aria-label="대화 검색"
                                onClick={onToggleSearch}
                                type="button"
                            >
                                <Search className="size-4" strokeWidth={1.7} />
                            </button>
                            <button
                                aria-label="참여자 목록 확인"
                                onClick={() => setIsMemberListOpen((open) => !open)}
                                type="button"
                            >
                                <Users className="size-4" strokeWidth={1.7} />
                            </button>
                        </div>
                    </>
                )
            }

            {isMemberListOpen && (
                <ChatMemberList members={members} onClose={() => setIsMemberListOpen(false)} />
            )}
        </header>
    );
}
