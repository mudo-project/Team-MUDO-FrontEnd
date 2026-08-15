import { Dispatch, SetStateAction } from "react";
import { WorkspaceTaskData } from "../type";
import WorkItem from "./WorkItem";
import TaskAddButton from "./TaskAddButton";

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
        color: 'bg-[#5FAF83]',
        title: '완료'
    },
}


export default function WorkList({ setSelectedTask, type, task, workspaceId }: { setSelectedTask: Dispatch<SetStateAction<number | undefined>>, type: 'WAITING' | 'IN_PROGRESS' | 'COMPLETED', task: WorkspaceTaskData[], workspaceId: string }) {
    return (
        <section className="w-full" >
            <div className="mb-2 flex items-center gap-1 sm:gap-1.5 lg:mb-2.5 lg:gap-2">
                <span className={`h-2 w-2 rounded-full ${workTag[type].color}`} />
                <h2 className="text-[10px] leading-[16px] font-semibold sm:text-[11px] lg:text-[12px] lg:leading-[18px]">{workTag[type].title}</h2>
                <span className="rounded-full bg-[#F0F2F5] px-[7px] py-px text-[10px] leading-[15px] text-[#A5ADBA]">
                    {task.length}
                </span>
            </div>

            <div className="space-y-2  h-[calc(100dvh-400px)] overflow-auto scrollbar-hide">
                {task.map((t) => (
                    <WorkItem key={t.taskId} setSelectedTask={setSelectedTask} task={t} type={type} />
                ))}

                <TaskAddButton workspaceId={workspaceId} />
            </div>
        </section>
    )
}