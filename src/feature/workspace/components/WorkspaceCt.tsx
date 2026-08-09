'use client'

import { useQuery } from "@tanstack/react-query";
import WorkList from "./WorkList";
import WorkspaceDailyHeader from "./WorkspaceDailyHeader";
import { getWorkspaceDetailAction } from "../actions";
import { useMemo } from "react";
import { WorkspaceTaskData, WorkspaceTaskStatus } from "../type";
import WorkDelayItem from "./WorkDelayItem";


const columns = [
    {
        title: "대기",
        count: 2,
        dotColor: "bg-[#BCC3CF]",
        badgeClass: "bg-[#F3F5F8] text-[#AAB2C0]",
        badgeDot: "bg-[#CBD2DC]",
        cards: [
            { title: "9월 시간표 초안 작성adfafdadsfadsfadfadfadfadfasfdsafdsadfadfafdfadfadfadfadfadfadfadsfsafdaf", owner: "김지", date: "~08.10" },
            { title: "교사 회의 자료 준비 (8/4)", owner: "정다", date: "~08.04" },
        ],
    },
    {
        title: "진행중",
        count: 3,
        dotColor: "bg-[#E0B72B]",
        badgeClass: "bg-[#FFF8D9] text-[#C69D13]",
        badgeDot: "bg-[#E1B72A]",
        cards: [
            { title: "8월 원생 청구서 발송", owner: "정다", date: "~08.07", comments: "1/2" },
            { title: "성적 데이터 7월분 엑셀 정리", owner: "윤해", date: "~08.05", comments: "1/2" },
            { title: "여름방학 특강 수강생 명단 취합", owner: "김지", date: "~08.03", comments: "1/2" },
        ],
    },
    {
        title: "완료",
        count: 1,
        dotColor: "bg-[#9CA9BD]",
        badgeClass: "bg-[#EEF1F5] text-[#7F8CA0]",
        badgeDot: "bg-[#9CA9BD]",
        cards: [{ title: "강의실 환경 점검 체크리스트 작성", owner: "정다", date: "~08.03" }],
    },
];

export default function WorkspaceCt({ workspaceId, date }: { workspaceId: string, date: string }) {


    const {
        data: workspaceData,
        isError: workspaceError
    } = useQuery({
        queryKey: ['workspace-date', workspaceId, date],
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

    if (!workspaceData?.success || workspaceError) {
        return (
            <div>{workspaceData?.message || workspaceError}다시 시도해주세요.</div>
        )
    }



    return (
        <>
            <WorkspaceDailyHeader workspaceId={workspaceId} taskCount={workspaceData.data?.taskCount} />

            <section className="px-2 py-4 sm:px-3 md:px-4 md:py-5 lg:px-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-3 lg:gap-4">
                    <WorkList type='WAITING' task={groupedTasksMemo['WAITING']} />
                    <WorkList type='IN_PROGRESS' task={groupedTasksMemo['IN_PROGRESS']} />
                    <WorkList type='COMPLETED' task={groupedTasksMemo['COMPLETED']} />
                </div>

                <section className="mt-4 border-t border-dashed border-[#E5E8ED] pt-4 md:mt-5 md:pt-5">
                    <div className="flex items-center gap-1 text-[10px] leading-[16px] sm:gap-1.5 sm:text-[11px] lg:gap-2 lg:text-[12px] lg:leading-[18px]">
                        <span className={`h-2 w-2 rounded-full bg-[#DF6C82]`} />
                        <h2 className="text-[10px] leading-[16px] font-semibold sm:text-[11px] lg:text-[12px] lg:leading-[18px]">지연</h2>
                        <span className="rounded-full bg-[#F0F2F5] px-[7px] py-px text-[10px] leading-[15px] text-[#A5ADBA]">1</span>
                    </div>
                    <p className="w-full pl-0.5 text-[10px] leading-[15px] text-[#C1C7D0] md:pl-1 lg:text-[11px] lg:leading-[16.5px]">기한이 지난 업무입니다. 상태를 업데이트하거나 완료 처리해주세요.</p>
                    {groupedTasksMemo['DELAYED'].map((task) => {
                        return <WorkDelayItem key={task.taskId} task={task} />
                    })}

                </section>
            </section>
        </>
    )
}