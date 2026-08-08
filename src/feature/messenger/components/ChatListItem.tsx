'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import Avatar from "./Avatar";
import { Chat, DEFAULT_CHAT_ID } from "../data";

export default function ChatListItem({ chat }: { chat: Chat }) {
    const pathname = usePathname();
    const isActive = pathname === `/messenger/${chat.id}` || (pathname === "/messenger" && chat.id === DEFAULT_CHAT_ID);

    return (
        <Link
            className={
                `flex w-full items-center gap-2.5 px-3 py-3 text-left
                ${isActive
                    ? "bg-[#EEF3F0]"
                    : "bg-white hover:bg-[#F7F9F7]"
                }
                `
            }
            href={`/messenger/${chat.id}`}
        >
            <Avatar initials={chat.initials} />
            <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                    <strong className="truncate text-[12px] font-semibold text-[#0F172A]">{chat.name}</strong>
                    <span className="shrink-0 text-[9px] text-[#64748B]">{chat.time}</span>
                </span>
                <span className="mt-1 flex items-center gap-2">
                    <span className="truncate text-[10px] text-[#64748B]">{chat.preview}</span>
                    {chat.unread
                        ?
                        <span className="ml-auto flex size-4 shrink-0 items-center justify-center rounded-full bg-[#2C8D50] text-[8px] font-semibold text-white">
                            {chat.unread}
                        </span>
                        :
                        null
                    }
                </span>
            </span>
        </Link>
    );
}
