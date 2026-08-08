'use client'

import Link from "next/link";
import { WorkspaceListData } from "../type";
import { usePathname } from "next/navigation";

export default function WorkspaceNavLink({ workspace }: { workspace: WorkspaceListData }) {
    const pathName = usePathname().split('/')
    const isActive = pathName.some((path) => path === String(workspace.workspaceId))

    return (
        <Link href={`/workspace/${workspace.workspaceId}/daily`}
            className={`${isActive && 'bg-[#F5F6F8]'} my-0.5 block rounded-[7px] px-3 py-[9px]`}>
            <strong className="block text-[13px] leading-[19.5px] font-medium">{workspace.name}</strong>
            <span className="mt-0.5 block text-[11px] leading-[16.5px] text-[#AEB6C2]">참여자 {workspace.memberCount}명</span>
        </Link>
    )
}
