'use client'

import { WorkspaceListData } from "../type";
import { usePathname, useRouter } from "next/navigation";
import { recordWorkspaceRecentAccessAction } from "../actions";

export default function WorkspaceNavLink({ workspace }: { workspace: WorkspaceListData }) {
    const router = useRouter();
    const pathName = usePathname().split('/')
    const isActive = pathName.some((path) => path === String(workspace.workspaceId))

    const handleWorkspaceClick = async () => {
        await recordWorkspaceRecentAccessAction(workspace.workspaceId);
        router.push(`/workspace/${workspace.workspaceId}/daily`);
    };

    return (
        <button
            type="button"
            onClick={handleWorkspaceClick}
            className={`${isActive && 'bg-[#F5F6F8]'} my-0.5 block rounded-[7px] px-3 py-[9px] w-full text-start`}>
            <strong className="block text-[13px] leading-[19.5px] font-medium">{workspace.name}</strong>
            <span className="mt-0.5 block text-[11px] leading-[16.5px] text-[#AEB6C2]">참여자 {workspace.memberCount}명</span>
        </button>
    )
}
