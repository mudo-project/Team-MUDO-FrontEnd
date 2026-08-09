import { WorkspaceTaskData } from "../type";
import WorkItem from "./WorkItem";

const workTag = {
    WAITING: {
        color: 'bg-[#BCC3CF]',
        title: '대기'
    },
    IN_PROGRESS: {
        color: 'bg-[#E0B72B]',
        title: "진행중"
    },
    COMPLETED: {
        color: 'bg-[#9CA9BD]',
        title: '완료'
    },
}


export default function WorkList({ type, task }: { type: 'WAITING' | 'IN_PROGRESS' | 'COMPLETED', task: WorkspaceTaskData[] }) {
    return (
        <section className="w-full" >
            <div className="mb-2 flex items-center gap-1 sm:gap-1.5 lg:mb-2.5 lg:gap-2">
                <span className={`h-2 w-2 rounded-full ${workTag[type].color}`} />
                <h2 className="text-[10px] leading-[16px] font-semibold sm:text-[11px] lg:text-[12px] lg:leading-[18px]">{workTag[type].title}</h2>
                <span className="rounded-full bg-[#F0F2F5] px-[7px] py-px text-[10px] leading-[15px] text-[#A5ADBA]">
                    {task.length}
                </span>
            </div>

            <div className="space-y-2">
                {task.map((t) => (
                    <WorkItem key={t.taskId} task={t} type={type} />
                ))}

                <button className="flex h-8 w-full items-center rounded-[7px] border border-dashed border-[#E1E5EA] px-2 text-[10px] leading-[16px] text-[#C2C8D1] sm:text-[11px] md:px-3 lg:h-9 lg:rounded-[8px] lg:px-3.5 lg:text-[12px] lg:leading-[18px]">
                    <span className="mr-1 text-[12px] font-light sm:text-[13px] lg:mr-1.5 lg:text-[14px]">＋</span> 업무 추가
                </button>
            </div>
        </section>
    )
}