'use client'

import { useState } from "react";
import { CheckSquare } from "lucide-react";
import TaskDetailModal from "./TaskDetailModal";
import { RoomTaskCard } from "../utils";

type SentTaskListProps = {
    items: RoomTaskCard[];
    currentUserId: number | null;
    onChange: () => void;
};

export default function SentTaskList({ items, currentUserId, onChange }: SentTaskListProps) {
    const [openItem, setOpenItem] = useState<RoomTaskCard | null>(null);

    const sentItems = items.filter((item) => item.card.assignerId === currentUserId);

    return (
        <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto p-3">
            {sentItems.map((item) => {
                const percent = item.card.assigneeCount === 0 ? 0 : Math.round((item.card.completedCount / item.card.assigneeCount) * 100);
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
                                <span>{item.roomName}</span>
                            </div>
                            <p className="mt-2 text-[12px] leading-5 text-[#334155]">{item.card.content}</p>
                        </button>
                        <div className="mt-3 flex items-center gap-3">
                            <span className="shrink-0 text-[11px] text-[#64748B]">
                                완료 <strong className="text-[#0F172A]">{item.card.completedCount}/{item.card.assigneeCount}</strong>
                            </span>
                            <span className="h-[5px] w-24 shrink-0 rounded-full bg-[#E7ECE8]">
                                <span className="block h-full rounded-full bg-[#2C8D50]" style={{ width: `${percent}%` }} />
                            </span>
                        </div>
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
