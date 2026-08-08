'use client'

import { useState } from "react";
import { CheckCircle2, CheckSquare } from "lucide-react";
import TaskDetailModal from "./TaskDetailModal";

// 임시로 사용할 더미데이터 입니다. 추후 API 연동을 진행하면서 삭제할 예정입니다.
const tasks = [
    { id: 1, taskId: "friday-classroom-notice", chatName: "전체 공지", assigner: "김지수", content: "금요일 보강 교실 변경 안내 메시지를 원생 전체에 발송해주세요.", date: "01.17", status: "done" as const },
    { id: 2, taskId: "math-timetable-review", chatName: "수학팀", assigner: "김지수", content: "2월 시간표 초안 작성 후 공유 부탁드립니다.", date: "01.20", status: "pending" as const },
    { id: 3, taskId: "math-classlog-submit", chatName: "수학팀", assigner: "김지수", content: "1월 2주차 수업 일지 제출해주세요.", date: "01.14", status: "overdue" as const },
];

export default function ReceivedTaskList() {
    const [openTaskId, setOpenTaskId] = useState<string | null>(null);

    return (
        <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto p-3">
            {tasks.map((task) => (
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
                            <span>{task.chatName} · {task.assigner}</span>
                        </div>
                        <p className="mt-2 text-[12px] leading-5 text-[#334155]">{task.content}</p>
                    </button>
                    <div className="mt-3 flex items-center justify-between">
                        {task.status === "overdue"
                            ? <span className="text-[11px] font-semibold text-[#C0483F]">마감초과 {task.date}</span>
                            : <span className="text-[11px] text-[#94A3B8]">{task.date}</span>
                        }
                        {task.status === "done" && (
                            <span className="flex items-center gap-1 text-[11px] font-semibold text-[#2C8D50]">
                                <CheckCircle2 className="size-3.5" strokeWidth={2} />
                                완료함
                            </span>
                        )}
                        {(task.status === "pending" || task.status === "overdue") && (
                            <button
                                className="rounded-[6px] bg-[#172033] px-3 py-1.5 text-[11px] font-medium text-white"
                                type="button"
                            >
                                완료했습니다
                            </button>
                        )}
                    </div>
                </article>
            ))}

            {openTaskId && (
                <TaskDetailModal onClose={() => setOpenTaskId(null)} taskId={openTaskId} />
            )}
        </div>
    );
}
