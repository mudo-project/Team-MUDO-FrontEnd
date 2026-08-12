import { CheckCircle2 } from "lucide-react";
import { TaskCompletionMessage } from "../utils";

export default function TaskCompletionCard({ message }: { message: TaskCompletionMessage }) {
    const percent = Math.round((message.completed / message.total) * 100);
    const isAllDone = message.completed === message.total;

    return (
        <article className="mx-auto w-full max-w-[378px] rounded-[9px] border border-[#528466] bg-white p-3">
            <div className="flex items-center gap-1.5 text-[10px] text-[#64748B]">
                <CheckCircle2 className="size-4 fill-[#528466] text-white" />
                <strong className="text-[#0F172A]">{message.assigneeName}</strong>님이 업무를 완료했습니다
                <span className="ml-auto text-[9px]">{message.time}</span>
            </div>
            <p className="mt-2 rounded bg-[#F7F9F7] px-2 py-1.5 text-[9px] text-[#64748B]">{message.content}</p>
            <div className="mt-2 flex items-center gap-2">
                <span className="h-[3px] flex-1 rounded bg-[#E7ECE8]">
                    <span className="block h-full rounded bg-[#2C8D50]" style={{ width: `${percent}%` }} />
                </span>
                <span className="text-[9px] text-[#2C8D50]">
                    {isAllDone ? `${message.completed}/${message.total} 완료 · 전원 완료!` : `${message.completed}/${message.total} 완료`}
                </span>
            </div>
        </article>
    );
}
