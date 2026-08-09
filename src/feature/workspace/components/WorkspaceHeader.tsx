'use client'

import Link from "next/link";
import WorkspaceAttendAddButton from "./WorkspaceAttendAddButton";
import WorkspaceDeleteButton from "./WorkspaceDeleteButton";
import WorkspaceEditButton from "./WorkspaceEditButton";
import { useQuery } from "@tanstack/react-query";
import { getWorkspaceDetailAction } from "../actions";

export default function WorkspaceHeader({ workspaceId }: { workspaceId: string }) {
    const {
        data: workspaceData,
        isPending: workspacePending,
        isError: workspaceError
    } = useQuery({
        queryKey: ['workspace-date', workspaceId],
        queryFn: () => getWorkspaceDetailAction(Number(workspaceId))
    })

    if (workspacePending) {
        return <p>워크스페이스를 불러오는 중입니다.</p>
    }

    if (!workspaceData?.success || workspaceError) {
        return (
            <div>{workspaceData?.message || workspaceError}다시 시도해주세요.</div>
        )
    }

    return (
        <header className="min-h-[0px] border-b border-[#E7EAF0] bg-white px-2 pt-3 sm:px-2.5 md:px-4 lg:px-6 lg:pt-4">
            <div className="flex items-start">
                <div>
                    <div className="flex gap-1 items-center">
                        <h2 className="text-[12px] font-bold tracking-[-0.02em] md:text-[14px] lg:text-[15px]">{workspaceData.data?.name}</h2>
                        <WorkspaceEditButton workspaceId={workspaceId} />
                    </div>
                    <p className="mt-0.5 text-[10px] text-[#B0B7C2] lg:mt-1 lg:text-[11px]">
                        참여자: {workspaceData.data?.members.
                            map((member, i) => (
                                <span key={member.userId}>
                                    {member.name}{i + 1 !== workspaceData.data?.members.length ? ', ' : ' '}
                                </span>
                            ))}({workspaceData.data?.memberCount}명)
                    </p>
                </div>
                <div className="ml-auto flex items-center gap-1 ">
                    <WorkspaceAttendAddButton workspaceId={workspaceId} />
                    <WorkspaceDeleteButton workspaceId={workspaceId} />
                    <button className=" flex h-7 items-center rounded-[7px] bg-[#1D2639] px-2 text-[10px] font-semibold text-white  md:h-8 md:px-3 md:text-[12px] lg:h-9 lg:px-4 lg:text-[13px]">
                        <span className="mr-1 text-[14px] font-light md:mr-1.5 md:text-base lg:mr-2 lg:text-lg">＋</span>
                        업무 등록
                    </button>
                </div>
            </div>

            <nav className="mt-2 flex h-8 items-end gap-2 sm:gap-3 md:mt-3 md:h-[34px] md:gap-5 lg:mt-4 lg:h-[36px] lg:gap-7">
                <Link
                    href={`/workspace/${workspaceId}/daily`}
                    className="h-full border-b border-[#596273] px-2 text-[10px] font-semibold leading-[35px] md:px-3 md:text-[12px] lg:px-4 lg:text-[13px]"
                >
                    일별
                </Link>
                <Link
                    href={`/workspace/${workspaceId}/repeat`}
                    className="h-full px-1 text-[10px] leading-[35px] text-[#A9B0BC] md:text-[12px] lg:text-[13px]"
                >
                    반복 템플릿
                </Link>
            </nav>
        </header>

    )
}