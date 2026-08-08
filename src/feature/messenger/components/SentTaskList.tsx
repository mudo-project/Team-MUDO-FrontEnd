'use client'

import { useState } from "react";
import { CheckSquare } from "lucide-react";
import TaskDetailModal from "./TaskDetailModal";

// 임시로 사용할 더미데이터 입니다. 추후 API 연동을 진행하면서 삭제할 예정입니다.
const tasks = [
    { id: 1, taskId: "friday-classroom-notice", chatName: "전체 공지", content: "금요일 보강 교실 변경 안내 메시지를 원생 전체에 발송해주세요.", completed: 1, total: 2 },
    { id: 2, taskId: "notice-prep-confirm", chatName: "전체 공지", content: "설 연휴 전 수업 준비 완료 확인.", completed: 3, total: 3 },
    { id: 3, taskId: "notice-greeting", chatName: "전체 공지", content: "안녕하세요", completed: 0, total: 1 },
    { id: 4, taskId: "math-printer-paper", chatName: "수학팀", content: "프린터에 종이가 없습니다. 종이 복사해주세요.", completed: 0, total: 2 },
];

export default function SentTaskList() {
    const [openTaskId, setOpenTaskId] = useState<string | null>(null);

    return (
        <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto p-3">
            {tasks.map((task) => {
                const percent = task.total === 0 ? 0 : Math.round((task.completed / task.total) * 100);
                return (
                    <article
                        className="rounded-[10px] border border-[#D7E8DB] bg-white p-3.5"
                        key={task.id}
                    >
                        <button
                            className="block w-full text-left"
                            onClick={() => setOpenTaskId(task.taskId)}
                            type="button"
                        >
                            <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#0F172A]">
                                <CheckSquare className="size-3.5 text-[#64748B]" strokeWidth={1.8} />
                                <span>{task.chatName}</span>
                            </div>
                            <p className="mt-2 text-[12px] leading-5 text-[#334155]">{task.content}</p>
                        </button>
                        <div className="mt-3 flex items-center gap-3">
                            <span className="shrink-0 text-[11px] text-[#64748B]">
                                완료 <strong className="text-[#0F172A]">{task.completed}/{task.total}</strong>
                            </span>
                            <span className="h-[5px] w-24 shrink-0 rounded-full bg-[#E7ECE8]">
                                <span className="block h-full rounded-full bg-[#2C8D50]" style={{ width: `${percent}%` }} />
                            </span>
                        </div>
                    </article>
                );
            })}

            {openTaskId && (
                <TaskDetailModal onClose={() => setOpenTaskId(null)} taskId={openTaskId} />
            )}
        </div>
    );
}
