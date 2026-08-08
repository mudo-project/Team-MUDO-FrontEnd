import { Check, CheckSquare, Circle, X } from "lucide-react";
import { getTaskDetail } from "../data";

export default function TaskDetailModal({ taskId, onClose }: { taskId: string; onClose: () => void }) {
    const task = getTaskDetail(taskId);

    if (!task) return null;

    const completed = task.assignees.filter((assignee) => assignee.done).length;
    const total = task.assignees.length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    return (
        <div className="fixed top-0 left-0 z-999 h-screen w-screen bg-[#162236]/45">
            <div className="fixed top-1/2 left-1/2 z-1000 w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-[12px] bg-white p-6 shadow-[0_8px_12px_rgba(22,34,54,0.12)]">
                <div className="flex items-center gap-1.5">
                    <span className="flex items-center gap-1 text-[14px] font-bold text-[#0F172A]">
                        <CheckSquare className="size-4 text-[#2C8D50]" strokeWidth={1.8} />
                        업무지시
                    </span>
                    <span className="text-[13px] text-[#94A3B8]">· {task.chatName} · {task.instructor}</span>
                    <button
                        aria-label="업무지시 상세조회 닫기"
                        className="ml-auto flex size-[18px] items-center justify-center text-[#64748B]"
                        onClick={onClose}
                        type="button"
                    >
                        <X className="size-[18px]" strokeWidth={1.5} />
                    </button>
                </div>

                <p className="mt-5 text-[14px] leading-6 text-[#0F172A]">{task.content}</p>

                <div className="mt-5 flex items-start gap-2">
                    <span className="w-16 shrink-0 pt-1 text-[12px] text-[#64748B]">담당자</span>
                    <div className="flex flex-wrap gap-2">
                        {task.assignees.map((assignee) => (
                            <span
                                className="rounded-full bg-[#F1F3F5] px-3 py-1 text-[12px] font-medium text-[#0F172A]"
                                key={assignee.name}
                            >
                                {assignee.name}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="mt-3 flex items-center gap-2">
                    <span className="w-16 shrink-0 text-[12px] text-[#64748B]">마감일</span>
                    <span className="text-[13px] text-[#0F172A]">{task.dueDate}</span>
                </div>

                <div className="mt-3 flex items-center gap-2">
                    <span className="w-16 shrink-0 text-[12px] text-[#64748B]">등록일시</span>
                    <span className="text-[13px] text-[#0F172A]">{task.createdAt}</span>
                </div>

                <div className="mt-5 flex items-center justify-between">
                    <strong className="text-[13px] font-bold text-[#0F172A]">완료 현황</strong>
                    <span className="text-[12px] text-[#64748B]">{completed}/{total}명 완료</span>
                </div>
                <div className="mt-2 h-[6px] w-full rounded-full bg-[#E7ECE8]">
                    <div className="h-full rounded-full bg-[#2C8D50]" style={{ width: `${percent}%` }} />
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                    {task.assignees.map((assignee) => (
                        <span
                            className="inline-flex items-center gap-1.5 rounded-full border border-[#D7E8DB] bg-white px-2.5 py-1.5 text-[12px] text-[#0F172A]"
                            key={assignee.name}
                        >
                            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#E2ECE4] text-[8px] font-semibold text-[#285D3B]">
                                {assignee.initials}
                            </span>
                            {assignee.name}
                            {assignee.done
                                ? <Check className="size-3.5 text-[#2C8D50]" strokeWidth={2.5} />
                                : <Circle className="size-3.5 text-[#D7E8DB]" strokeWidth={2} />
                            }
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
