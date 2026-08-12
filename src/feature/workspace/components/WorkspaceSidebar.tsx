'use client'

import { ChevronsLeft, ChevronsRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getWorkspaceListAction, WorkspaceActionResult } from "../actions";
import { WorkspaceListData } from "../type";
import WorkspaceNavLink from "./WorkspaceNavLink";
import useModal from "@/components/hooks/useModal";
import CreateWorkspaceModal from "./modals/CreateWorkspaceModal";


export default function WorkspaceSidebar() {
    const [open, setOpen] = useState<boolean>(true);
    const modal = useModal();
    const [workspaceList, setWorkspaceList] = useState<{
        loading: boolean;
        error: string;
        data: WorkspaceListData[];
    }>({
        loading: true,
        error: '',
        data: []
    })

    useEffect(() => {
        const fetchWorkspace = async () => {
            const response: WorkspaceActionResult<WorkspaceListData[]> = await getWorkspaceListAction();
            setWorkspaceList({
                loading: false,
                error: response.success ? '' : response.message,
                data: response.data ?? []
            })

        }

        fetchWorkspace();
    }, [])

    return (
        <aside className={`${open ? 'w-[230px]' : 'w-[50px]'}  shrink-0 border-r border-[#E7EAF0] bg-white`}>
            <div className={`${open && 'hidden'} flex h-[60px] items-center  px-4 pt-3.5 pb-[11px]`}>
                <button onClick={() => { setOpen(!open) }} >
                    <ChevronsRight className="size-4" strokeWidth={1.5} />
                </button>
            </div>
            <div className={`${!open && 'hidden'} flex h-[60px] items-center border-b border-[#EEF0F3] px-4 pt-3.5 pb-[11px]`}>
                <h1 className="text-[12px] leading-[18px] font-semibold tracking-[-0.02em]">워크스페이스</h1>
                <button
                    onClick={modal.openModal}
                    className="ml-auto flex h-6 w-6 items-center justify-center rounded-[6px] border border-[#DDE2E8] text-[14px] font-light text-[#A6AFBD]"
                    aria-label="워크스페이스 추가"
                >
                    +
                </button>
                <button onClick={() => { setOpen(!open) }} className="ml-2">
                    <ChevronsLeft className="size-4" strokeWidth={1.5} />
                </button>
            </div>

            <nav className={`${!open && 'hidden'} p-2`}>
                <Link
                    href="/workspace"
                    className="flex h-9 items-center rounded-[7px] px-3 text-[13px] leading-[19.5px] text-[#6F7988]"
                >
                    <span className="mr-[9px] flex h-[13px] w-[13px] items-center justify-center rounded-[2px] border border-[#AAB3C0] text-[9px]">
                        ✓
                    </span>
                    내 업무 모아보기
                </Link>

                <div className="mx-1 mt-1.5 border-t border-[#EFF1F4]" />
                <div className="h-[calc(100dvh-170px)] scrollbar-hide overflow-auto pt-2">
                    {workspaceList.data.map((workspace) => {
                        return (
                            <WorkspaceNavLink key={workspace.workspaceId} workspace={workspace} />
                        )
                    })}
                    {workspaceList.data.length === 0 && (
                        <p> 생성된 워크스페이스가 없습니다</p>
                    )}
                </div>
            </nav>
            {modal.isModal &&
                <CreateWorkspaceModal
                    closeModal={modal.closeModal}
                />
            }

        </aside>
    )
}
