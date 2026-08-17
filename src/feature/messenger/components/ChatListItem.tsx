'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import Avatar from "./Avatar";
import { useMessengerMobileNav } from "./MessengerMobileNavContext";
import { formatChatTime, getInitials } from "../utils";

export default function ChatListItem({ room }: { room: MessengerRoomListItemData }) {
    const pathname = usePathname();
    const isActive = pathname === `/messenger/${room.id}`;
    const { closeSidebar } = useMessengerMobileNav();

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
            href={`/messenger/${room.id}`}
            onClick={closeSidebar}
        >
            <Avatar initials={getInitials(room.name)} />
            <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                    <strong className="truncate text-[12px] font-semibold text-[#0F172A]">{room.name}</strong>
                    <span className="shrink-0 text-[9px] text-[#64748B]">{formatChatTime(room.lastMessageAt)}</span>
                </span>
                <span className="mt-1 flex items-center gap-2">
                    <span className="truncate text-[10px] text-[#64748B]">{room.lastMessagePreview}</span>
                    {room.unreadCount > 0
                        ?
                        <span className="ml-auto flex size-4 shrink-0 items-center justify-center rounded-full bg-[#2C8D50] text-[8px] font-semibold text-white">
                            {room.unreadCount}
                        </span>
                        :
                        null
                    }
                </span>
            </span>
        </Link>
    );
}
