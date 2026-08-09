'use client'

import { useState } from "react";
import { CheckCircle2, CheckSquare } from "lucide-react";
import TaskDetailModal from "./TaskDetailModal";
import { RoomTaskCard, formatChatTime } from "../utils";
import { completeTaskCardAction } from "../actions";

type ReceivedTaskListProps = {
    items: RoomTaskCard[];
    currentUserId: number | null;
    onChange: () => void;
};

export default function ReceivedTaskList({ items, currentUserId, onChange }: ReceivedTaskListProps) {
    const [openItem, setOpenItem] = useState<RoomTaskCard | null>(null);

    const receivedItems = items.filter((item) => item.card.assignees.some((assignee) => assignee.userId === currentUserId));

    const handleComplete = async (item: RoomTaskCard) => {
        await completeTaskCardAction(item.roomId, item.card.id);
        onChange();
    };

    return (
        <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto p-3">
            {receivedItems.map((item) => {
                const myAssignment = item.card.assignees.find((assignee) => assignee.userId === currentUserId);
                const isDone = Boolean(myAssignment?.completedAt);
                const isOverdue = !isDone && Boolean(item.card.dueDate) && new Date(item.card.dueDate as string) < new Date();

                return (
                    <article
                        className="rounded-[10px] border border-[#D7E8DB] bg-white p-3.5"
                        key={item.card.id}
                    >
                        <button
                            className="block w-full text-left"
                            onClick={() => setOpenItem(item)}
                            type="button"
                        >
                            <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#0F172A]">
                                <CheckSquare className="size-3.5 text-[#64748B]" strokeWidth={1.8} />
                                <span>{item.roomName} · {item.card.assignerName}</span>
                            </div>
                            <p className="mt-2 text-[12px] leading-5 text-[#334155]">{item.card.content}</p>
                        </button>
                        <div className="mt-3 flex items-center justify-between">
                            {isOverdue
                                ? <span className="text-[11px] font-semibold text-[#C0483F]">마감초과 {item.card.dueDate}</span>
                                : <span className="text-[11px] text-[#94A3B8]">{item.card.dueDate ?? "-"}</span>
                            }
                            {isDone && (
                                <span className="flex items-center gap-1 text-[11px] font-semibold text-[#2C8D50]">
                                    <CheckCircle2 className="size-3.5" strokeWidth={2} />
                                    완료함
                                </span>
                            )}
                            {!isDone && (
                                <button
                                    className="rounded-[6px] bg-[#172033] px-3 py-1.5 text-[11px] font-medium text-white"
                                    onClick={() => handleComplete(item)}
                                    type="button"
                                >
                                    완료했습니다
                                </button>
                            )}
                        </div>
                        <p className="mt-2 text-[9px] text-[#94A3B8]">{formatChatTime(item.card.createdAt)}</p>
                    </article>
                );
            })}

            {openItem && (
                <TaskDetailModal
                    card={openItem.card}
                    currentUserId={currentUserId}
                    roomId={openItem.roomId}
                    roomName={openItem.roomName}
                    onClose={() => setOpenItem(null)}
                    onTaskCardsChange={onChange}
                />
            )}
        </div>
    );
}
