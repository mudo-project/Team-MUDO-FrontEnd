'use client'

import { useState } from "react";
import { CheckSquare } from "lucide-react";
import Avatar from "./Avatar";
import TaskDetailModal from "./TaskDetailModal";
import { TaskInstructionMessage } from "../data";

export default function TaskMessageCard({ message }: { message: TaskInstructionMessage }) {
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const card = (
        <button
            className={`block w-full max-w-[320px] rounded-[10px] border border-[#2C8D50] bg-white p-3 text-left ${message.own ? "ml-auto" : ""}`}
            onClick={() => setIsDetailOpen(true)}
            type="button"
        >
            <div className="flex items-center justify-between text-[9px] text-[#64748B]">
                <span className="flex items-center gap-1 text-[#2C8D50]">
                    <CheckSquare className="size-3" />
                    업무지시
                </span>
                <span>{message.instructor} · {message.time}</span>
            </div>
            <p className="mt-2 text-[11px] leading-5">{message.content}</p>
            <div className="mt-2 flex justify-between text-[9px] text-[#64748B]">
                <span>확인 {message.confirmed}/{message.assigneeCount}</span>
                <span>담당자 {message.assigneeCount}명 ›</span>
            </div>
        </button>
    );

    return (
        <>
            {message.own
                ? (
                    <article className="mt-3 flex max-w-[620px] flex-col items-end">
                        {card}
                    </article>
                )
                : (
                    <article className="flex max-w-[620px] items-end gap-2">
                        <Avatar initials={message.instructorInitials} />
                        <div className="w-full">
                            <p className="mb-1 text-[9px] text-[#64748B]">{message.instructor}</p>
                            {card}
                        </div>
                    </article>
                )
            }

            {isDetailOpen && (
                <TaskDetailModal onClose={() => setIsDetailOpen(false)} taskId={message.taskId} />
            )}
        </>
    );
}
