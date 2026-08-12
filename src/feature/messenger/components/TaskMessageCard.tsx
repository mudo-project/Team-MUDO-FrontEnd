'use client'

import { useState } from "react";
import { CheckSquare } from "lucide-react";
import Avatar from "./Avatar";
import TaskDetailModal from "./TaskDetailModal";
import { formatChatTime, getInitials } from "../utils";

type TaskMessageCardProps = {
    card: MessengerTaskCardItemData;
    own: boolean;
    currentUserId: number | null;
    roomId: number;
    onTaskCardsChange: () => void;
};

export default function TaskMessageCard({ card, own, currentUserId, roomId, onTaskCardsChange }: TaskMessageCardProps) {
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const button = (
        <button
            className={`block w-full max-w-[320px] rounded-[10px] border border-[#2C8D50] bg-white p-3 text-left ${own ? "ml-auto" : ""}`}
            onClick={() => setIsDetailOpen(true)}
            type="button"
        >
            <div className="flex items-center justify-between text-[9px] text-[#64748B]">
                <span className="flex items-center gap-1 text-[#2C8D50]">
                    <CheckSquare className="size-3" />
                    업무지시
                </span>
                <span>{card.assignerName} · {formatChatTime(card.createdAt)}</span>
            </div>
            <p className="mt-2 text-[11px] leading-5">{card.content}</p>
            <div className="mt-2 flex justify-between text-[9px] text-[#64748B]">
                <span>확인 {card.completedCount}/{card.assigneeCount}</span>
                <span>담당자 {card.assigneeCount}명 ›</span>
            </div>
        </button>
    );

    return (
        <>
            {own
                ? (
                    <article className="mt-3 ml-auto flex max-w-[620px] flex-col items-end">
                        {button}
                    </article>
                )
                : (
                    <article className="flex max-w-[620px] items-end gap-2">
                        <Avatar initials={getInitials(card.assignerName)} />
                        <div className="w-full">
                            <p className="mb-1 text-[9px] text-[#64748B]">{card.assignerName}</p>
                            {button}
                        </div>
                    </article>
                )
            }

            {isDetailOpen && (
                <TaskDetailModal
                    card={card}
                    currentUserId={currentUserId}
                    roomId={roomId}
                    onClose={() => setIsDetailOpen(false)}
                    onTaskCardsChange={onTaskCardsChange}
                />
            )}
        </>
    );
}
