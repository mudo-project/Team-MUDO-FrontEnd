'use client'

import { Dispatch, SetStateAction } from "react";
import { WorkspaceTaskData } from "../type";

const workTag = {
    WAITING: {
        dot: 'bg-[#BCC3CF]',
        color: 'bg-[#F3F5F8] text-[#AAB2C0]',
        title: '대기'
    },
    IN_PROGRESS: {
        dot: 'bg-[#E0B72B]',
        color: 'bg-[#FFF8D9] text-[#C69D13]',
        title: "진행중"
    },
    COMPLETED: {
        dot: "bg-[#5FAF83]",
        color: "bg-[#EAF7EF] text-[#438763]",
        title: "완료",
    },
    DELAYED: {
        dot: 'bg-[#DF6C82]',
        color: 'bg-[#FFF0F3]  text-[#D45D76]',
        title: '지연'
    },
}


export default function WorkItem({ setSelectedTask, task, type }: { setSelectedTask: Dispatch<SetStateAction<number | undefined>>, task: WorkspaceTaskData, type: 'WAITING' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED' }) {
    return (
        <>
            <button
                onClick={() => setSelectedTask(task.taskId)}
                className="text-start min-h-24 w-full rounded-[7px] border border-[#DEE2E8] bg-white px-2 py-3 sm:px-2.5 md:min-h-25 md:px-3 lg:min-h-26.5 lg:rounded-[9px] lg:px-4 lg:py-[14px]"
            >
                <span className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] leading-[15px] sm:px-2 lg:text-[11px] lg:leading-[16.5px] ${workTag[type].color}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${workTag[type].dot}`} />
                    {workTag[type].title}
                </span>
                <h3 className="mt-1.5 text-[10px] leading-[15px] font-medium wrap-break-word md:mt-2 md:text-[12px] md:leading-[17px] lg:text-[13px] lg:leading-[18px]">{task.title}</h3>
                <div className="mt-2 flex items-center text-[10px] leading-[15px] text-[#AEB6C3] lg:mt-2.5 lg:text-[11px] lg:leading-[16.5px]">
                    <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#EEF1F4] text-[7px] font-semibold text-[#515B6C]">
                        {task.creator.name.slice(0, 2)}
                    </span>
                    {task.dueAt &&
                        <span className="ml-2">{task.dueAt}</span>
                    }
                    <span className="ml-auto">◌ {task.completedCommentCount ?? 0}/{task.commentCount ?? 0}</span>
                </div>
            </button>
        </>
    )
}