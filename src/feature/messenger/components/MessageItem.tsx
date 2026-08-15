'use client'

import { useEffect, useRef, useState } from "react";
import Avatar from "./Avatar";
import MessageMenu from "./MessageMenu";
import TaskMessageCard from "./TaskMessageCard";
import { FeedItem, formatTimeOnly, getInitials } from "../utils";
import { deleteMessageAction, updateMessageAction } from "../actions";

type MessageItemProps = {
    item: FeedItem;
    currentUserId: number | null;
    roomId: number;
    onMessagesChange: () => void;
    onTaskCardsChange: () => void;
};

export default function MessageItem({ item, currentUserId, roomId, onMessagesChange, onTaskCardsChange }: MessageItemProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState("");
    const articleRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (!isMenuOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (articleRef.current && !articleRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [isMenuOpen]);

    if (item.kind === "task") {
        return (
            <TaskMessageCard
                card={item.card}
                own={item.own}
                currentUserId={currentUserId}
                roomId={roomId}
                onTaskCardsChange={onTaskCardsChange}
            />
        );
    }

    if (item.deleted) {
        return (
            <p className="py-1 text-center text-[10px] text-[#94A3B8]">삭제된 채팅입니다</p>
        );
    }

    const handleEdit = () => {
        setEditValue(item.content ?? "");
        setIsEditing(true);
    };

    const handleDelete = async () => {
        await deleteMessageAction(roomId, item.id);
        onMessagesChange();
    };

    const handleSaveEdit = async () => {
        if (!editValue.trim()) return;
        await updateMessageAction(roomId, item.id, editValue);
        setIsEditing(false);
        onMessagesChange();
    };

    if (item.own) {
        return (
            <article
                className="relative ml-auto flex max-w-[620px] flex-col items-end gap-1"
                onContextMenu={(event) => {
                    event.preventDefault();
                    setIsMenuOpen(true);
                }}
                ref={articleRef}
            >
                {isEditing ? (
                    <div className="flex w-full max-w-[420px] flex-col items-end gap-1.5">
                        <textarea
                            autoFocus
                            className="w-full resize-none rounded-[11px] border border-[#D7E8DB] px-3 py-2 text-[11px] leading-[1.5] outline-none"
                            onChange={(event) => setEditValue(event.target.value)}
                            value={editValue}
                        />
                        <div className="flex gap-1.5">
                            <button
                                className="rounded-[6px] border border-[#D7E8DB] px-2.5 py-1 text-[10px]"
                                onClick={() => setIsEditing(false)}
                                type="button"
                            >
                                취소
                            </button>
                            <button
                                className="rounded-[6px] bg-[#2C8D50] px-2.5 py-1 text-[10px] text-white"
                                onClick={handleSaveEdit}
                                type="button"
                            >
                                저장
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="rounded-[11px] bg-[#2C8D50] px-3 py-2 text-[11px] leading-[1.5] text-white">
                        {item.content}
                        {item.editedAt && <span className="ml-1 text-[9px] text-white/70">(수정됨)</span>}
                    </div>
                )}
                <p className="text-[9px] text-[#64748B]">{formatTimeOnly(item.createdAt)}</p>
                {isMenuOpen && <MessageMenu onClose={() => setIsMenuOpen(false)} onEdit={handleEdit} onDelete={handleDelete} />}
            </article>
        );
    }

    return (
        <article className="flex max-w-[620px] items-end gap-2">
            <Avatar initials={getInitials(item.senderName)} />
            <div>
                <p className="mb-1 text-[9px] text-[#64748B]">{item.senderName}</p>
                <div className="rounded-[11px] bg-[#E9EDF1] px-3 py-2 text-[11px] leading-[1.5] text-[#1E293B]">
                    {item.content}
                </div>
                <p className="mt-1 flex items-center gap-1 text-[9px] text-[#64748B]">
                    <span>{formatTimeOnly(item.createdAt)}</span>
                    {item.unreadCount > 0 && <span>· 안읽음 {item.unreadCount}</span>}
                </p>
            </div>
        </article>
    );
}
