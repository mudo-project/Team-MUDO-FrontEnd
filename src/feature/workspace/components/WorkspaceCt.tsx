'use client'

import { useQuery } from "@tanstack/react-query";
import WorkList from "./WorkList";
import WorkspaceDailyHeader from "./WorkspaceDailyHeader";
import { getWorkspaceDetailAction } from "../actions";
import { useMemo, useState } from "react";
import { WorkspaceTaskData, WorkspaceTaskStatus } from "../type";
import ViewTask from "./ViewTask";
import WorkItem from "./WorkItem";

export default function WorkspaceCt({ workspaceId, date }: { workspaceId: string, date: string }) {

    const [selectedTask, setSelectedTask] = useState<number>();
    const {
        data: workspaceData,
        isPending: workspacePending,
        isError: workspaceError
    } = useQuery({
        queryKey: ['workspace', workspaceId, date],
        queryFn: () => getWorkspaceDetailAction(Number(workspaceId), date)
    })

    const groupedTasksMemo = useMemo(() => {
        return (workspaceData?.data?.tasks ?? []).reduce(
            (groups, task) => {
                groups[task.status].push(task);
                return groups;
            },
            {
                WAITING: [],
                IN_PROGRESS: [],
                COMPLETED: [],
                DELAYED: [],
            } as Record<WorkspaceTaskStatus, WorkspaceTaskData[]>,
        )
    }, [workspaceData])


    return (
        <>
            <WorkspaceDailyHeader workspaceId={workspaceId} taskCount={workspaceData?.data?.taskCount} />
            {!workspacePending && (!workspaceData?.success || workspaceError) && <div>{workspaceData?.message || workspaceError}다시 시도해주세요.</div>}
            <section className="px-2 py-4 sm:px-3 md:px-4 md:py-5 lg:px-6 h-[calc(100dvh-250px)] overflow-auto">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-3 lg:gap-4">
                    <WorkList setSelectedTask={setSelectedTask} type='WAITING' task={groupedTasksMemo['WAITING']} workspaceId={workspaceId} />
                    <WorkList setSelectedTask={setSelectedTask} type='IN_PROGRESS' task={groupedTasksMemo['IN_PROGRESS']} workspaceId={workspaceId} />
                    <WorkList setSelectedTask={setSelectedTask} type='COMPLETED' task={groupedTasksMemo['COMPLETED']} workspaceId={workspaceId} />
                </div>

                <section className="mt-4 border-t border-dashed border-[#E5E8ED] pt-4 md:mt-5 md:pt-5">
                    <div className="flex items-center gap-1 text-[10px] leading-[16px] sm:gap-1.5 sm:text-[11px] lg:gap-2 lg:text-[12px] lg:leading-[18px]">
                        <span className={`h-2 w-2 rounded-full bg-[#DF6C82]`} />
                        <h2 className="text-[10px] leading-[16px] font-semibold sm:text-[11px] lg:text-[12px] lg:leading-[18px]">지연</h2>
                        <span className="rounded-full bg-[#F0F2F5] px-[7px] py-px text-[10px] leading-[15px] text-[#A5ADBA]">{groupedTasksMemo['DELAYED'].length}</span>
                    </div>
                    <p className="w-full pl-0.5 text-[10px] leading-[15px] text-[#C1C7D0] md:pl-1 lg:text-[11px] lg:leading-[16.5px]">기한이 지난 업무입니다. 상태를 업데이트하거나 완료 처리해주세요.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-3 lg:gap-4 mt-3">
                        {groupedTasksMemo['DELAYED'].map((task) => {
                            return <WorkItem key={task.taskId} setSelectedTask={setSelectedTask} task={task} type='DELAYED' />
                        })}
                    </div>

                </section>
            </section>
            {selectedTask &&
                <ViewTask selectedTask={selectedTask} setSelectedTask={setSelectedTask} workspaceId={workspaceId} workspaceMembers={workspaceData?.data?.members ?? []} />}
        </>
    )
}
