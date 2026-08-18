'use client'

import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { getWorkspaceListAction } from "../actions";
import { useUserStore } from "@/store/useUserStore";

export default function MyWorkHeader({ workspaceId, status }: { workspaceId?: number, status?: string }) {

    const permissions = useUserStore((state) => state.permissions)

    const searchParams = useSearchParams();
    const router = useRouter();

    const updateSearchParam = (key: "status" | "workspaceId", value: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        const query = params.toString();
        router.replace(query ? `?${query}` : "?", { scroll: false });
    };

    const {
        data: workspaceListData,
    } = useQuery({
        queryKey: ["workspace-list", "MINE"],
        queryFn: () => getWorkspaceListAction(permissions.includes('WORKSPACE:READ_ALL') ? 'ALL' : "MINE"),
    });



    const workspaces = workspaceListData?.success
        ? workspaceListData.data ?? []
        : [];

    return (
        <header className="border-b border-[#E4E8ED] px-2 pt-4 pb-4 sm:px-3 md:px-5 md:pt-5 lg:px-8 lg:pt-7 lg:pb-[17px]">
            <h1 className="text-[14px] leading-[22.5px] font-bold tracking-[-0.02em] md:text-[15px]">내 업무 모아보기</h1>
            <div className="mt-2 flex flex-col gap-1 sm:mt-2.5 sm:gap-1.5 md:mt-3 md:flex-row md:items-center md:gap-2 lg:gap-2.5">
                <div className="flex gap-1">
                    <select
                        className="h-7 w-[75px] rounded-[7px] border border-[#DCE1E7] bg-white px-1.5 text-[10px] focus:outline-none sm:w-[85px] sm:px-2 sm:text-[11px] md:h-[30px] lg:w-[101px] lg:px-3 lg:text-[12px]"
                        value={status ?? ""}
                        onChange={(event) => updateSearchParam("status", event.target.value)}
                        aria-label="상태 필터"
                    >
                        <option value="">상태: 전체</option>
                        <option value='WAITING'>상태: 대기</option>
                        <option value='IN_PROGRESS'>상태: 진행중</option>
                        <option value='DELAYED'>상태: 지연</option>
                    </select>

                    <select
                        className="h-7 w-[105px] rounded-[7px] border border-[#DCE1E7] bg-white px-1.5 text-[10px] focus:outline-none sm:w-[120px] sm:px-2 sm:text-[11px] md:h-[30px] lg:w-[145px] lg:px-3 lg:text-[12px]"
                        value={workspaceId ?? ""}
                        onChange={(event) => updateSearchParam("workspaceId", event.target.value)}
                        aria-label="워크스페이스 필터"
                    >
                        <option value="">워크스페이스: 전체</option>
                        {workspaces.map((workspace) => (
                            <option key={workspace.workspaceId} value={workspace.workspaceId}>
                                {workspace.name}
                            </option>
                        ))}
                    </select>
                </div>


            </div>
        </header>
    )
}