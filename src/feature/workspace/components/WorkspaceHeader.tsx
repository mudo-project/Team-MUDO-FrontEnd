'use client'

import WorkspaceAttendAddButton from "./WorkspaceAttendAddButton";
import WorkspaceDeleteButton from "./WorkspaceDeleteButton";
import WorkspaceEditButton from "./WorkspaceEditButton";
import { useQuery } from "@tanstack/react-query";
import { getWorkspaceDetailAction } from "../actions";
import TaskCreateButton from "./TaskCreateButton";
import TaskTemplateCreateButton from "./TaskTemplateCreateButton";
import Attend from "./Attend";
import TaskNavLink from "./TaskNavLink";
import { usePathname } from "next/navigation";

export default function WorkspaceHeader({ workspaceId }: { workspaceId: string }) {
    const {
        data: workspaceData,
        isPending: workspacePending,
        isError: workspaceError
    } = useQuery({
        queryKey: ['workspace', workspaceId],
        queryFn: () => getWorkspaceDetailAction(Number(workspaceId))
    })

    const pathName = usePathname().split('/')[3];
    const template = pathName.startsWith('repeat');

    return (
        <header className="min-h-[0px] border-b border-[#E7EAF0] bg-white px-2 pt-3 sm:px-2.5 md:px-4 lg:px-6 lg:pt-4">
            <div className="flex items-start sm:flex-row flex-col">
                <div>
                    <div className="flex gap-1 items-center">
                        <h2 className="min-h-5 text-[12px] font-bold tracking-[-0.02em] md:text-[14px] lg:text-[15px]">{workspaceData?.data?.name}</h2>
                        <WorkspaceEditButton workspaceId={workspaceId} />
                    </div>
                    <p className="mt-0.5 text-[10px] text-[#B0B7C2] lg:mt-1 lg:text-[11px]">
                        참여자: {workspaceData?.data?.members.map((member, i) =>
                            <Attend workspaceData={workspaceData} member={member} i={i} key={member.userId} />
                        )}({workspaceData?.data?.memberCount}명)
                    </p>
                </div>
                <div className="ml-auto flex items-center gap-1 ">
                    <WorkspaceAttendAddButton workspaceId={workspaceId} members={workspaceData?.data?.members} />
                    <WorkspaceDeleteButton workspaceId={workspaceId} />

                    {
                        template ? <TaskTemplateCreateButton workspaceId={workspaceId} /> : <TaskCreateButton workspaceId={workspaceId} />
                    }
                </div>
            </div>
            {!workspacePending && (!workspaceData?.success || workspaceError) && <div>{workspaceData?.message || workspaceError}다시 시도해주세요.</div>}

            <nav className="mt-2 flex h-8 items-end gap-2 sm:gap-3 md:mt-3 md:h-[34px] md:gap-5 lg:mt-4 lg:h-[36px] lg:gap-7">
                <TaskNavLink href={`/workspace/${workspaceId}/daily`}>
                    일별
                </TaskNavLink>
                <TaskNavLink href={`/workspace/${workspaceId}/repeat`}>
                    반복 템플릿
                </TaskNavLink>
            </nav>
        </header>

    )
}