'use client'

import { useMemo, useState } from "react";
import ChatRoomHeader from "./ChatRoomHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { chats, DEFAULT_CHAT_ID, getMessageSearchText } from "../data";

export default function ChatRoom({ chatId = DEFAULT_CHAT_ID }: { chatId?: string }) {
    const chat = chats.find((item) => item.id === chatId) ?? chats[0];
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const trimmedQuery = searchQuery.trim().toLowerCase();

    const filteredMessages = useMemo(() => {
        if (!trimmedQuery) return chat.messages;
        return chat.messages.filter((message) => getMessageSearchText(message).toLowerCase().includes(trimmedQuery));
    }, [chat.messages, trimmedQuery]);

    const handleToggleSearch = () => {
        setIsSearchOpen((open) => {
            if (open) setSearchQuery("");
            return !open;
        });
    };

    return (
        <section className="relative flex min-h-0 min-w-0 flex-1 flex-col bg-[#FCFCFC]" aria-label={`${chat.name} 대화`}>
            <ChatRoomHeader
                chat={chat}
                isSearchOpen={isSearchOpen}
                onSearchQueryChange={setSearchQuery}
                onToggleSearch={handleToggleSearch}
                searchQuery={searchQuery}
            />

            {trimmedQuery && filteredMessages.length === 0
                ? (
                    <div className="flex min-h-0 flex-1 items-center justify-center text-[12px] text-[#94A3B8]">
                        검색 결과가 없습니다
                    </div>
                )
                : <MessageList messages={filteredMessages} />
            }

            <MessageInput />
        </section>
    );
}
