'use client';

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import MyWorkItem from "@/feature/workspace/components/MyWorkItem";
import {
    getMyWorkspaceTaskListAction,
    getWorkspaceListAction,
} from "@/feature/workspace/actions";
import { MyWorkspaceTaskStatus } from "@/feature/workspace/type";

const statusValues: MyWorkspaceTaskStatus[] = [
    "WAITING",
    "IN_PROGRESS",
    "DELAYED",
];

const statusOptions: { value: MyWorkspaceTaskStatus; label: string }[] = [
    { value: "WAITING", label: "대기" },
    { value: "IN_PROGRESS", label: "진행중" },
    { value: "DELAYED", label: "지연" },
];

export default function Page() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const loadMoreRef = useRef<HTMLDivElement>(null);

    const statusParam = searchParams.get("status");
    const status = statusValues.includes(statusParam as MyWorkspaceTaskStatus)
        ? statusParam as MyWorkspaceTaskStatus
        : undefined;
    const workspaceIdParam = Number(searchParams.get("workspaceId"));
    const workspaceId = Number.isInteger(workspaceIdParam) && workspaceIdParam > 0
        ? workspaceIdParam
        : undefined;

    const {
        data: workspaceListData,
    } = useQuery({
        queryKey: ["workspace-list", "MINE"],
        queryFn: () => getWorkspaceListAction("MINE"),
    });

    const {
        data: myWorkData,
        isPending: myWorkPending,
        isError: myWorkError,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
    } = useInfiniteQuery({
        queryKey: ["my-workspace-tasks", status, workspaceId],
        queryFn: ({ pageParam }) => getMyWorkspaceTaskListAction({
            status,
            workspaceId,
            page: pageParam,
        }),
        initialPageParam: 0,
        getNextPageParam: (lastPage) => (
            lastPage.success && lastPage.data?.hasNext
                ? lastPage.data.page + 1
                : undefined
        ),
    });

    const tasks = myWorkData?.pages.flatMap((page) => page.data?.content ?? []) ?? [];

    const myWorkFailure = myWorkData?.pages.find((page) => !page.success);

    useEffect(() => {
        const target = loadMoreRef.current;

        if (!target || !hasNextPage || isFetchingNextPage) {
            return;
        }

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                void fetchNextPage();
            }
        });

        observer.observe(target);

        return () => observer.disconnect();
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

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

    const workspaces = workspaceListData?.success
        ? workspaceListData.data ?? []
        : [];

    return (
        <main className="min-h-screen w-full bg-[#FCFDFE] text-[#202A3C]">
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
                            {statusOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    상태: {option.label}
                                </option>
                            ))}
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

                    <span className="text-[10px] text-[#B3BBC6] sm:text-[11px] lg:text-[12px]">
                        {tasks.length}건
                    </span>
                </div>
            </header>

            <section className="px-2 py-4 sm:px-3 md:px-4 md:py-5 lg:px-6">
                <div className="w-full overflow-hidden rounded-[9px] border border-[#DDE2E8] bg-white">
                    <div className="grid h-[34px] grid-cols-7 items-center border-b border-[#EBEEF2] px-2 text-[10px] leading-[16.5px] font-medium text-[#A8B0BC] sm:px-3 md:h-9 md:px-4 lg:h-[37px] lg:px-5 lg:text-[11px]">
                        <span className="col-span-3">업무 제목</span>
                        <span className="col-span-2">워크스페이스</span>
                        <span className="col-span-1">기한</span>
                        <span className="col-span-1">상태</span>
                    </div>

                    {myWorkPending && <p className="px-3 py-4 text-[12px] text-[#A8B0BC] text-center">업무를 불러오는 중입니다.</p>}

                    {!myWorkPending && (myWorkError || myWorkFailure) && (
                        <p className="px-3 py-4 text-[12px] text-red-500">
                            {myWorkFailure?.message ?? "내 업무 목록을 불러오지 못했습니다."}
                        </p>
                    )}

                    {!myWorkPending && !myWorkError && !myWorkFailure && tasks.length === 0 && (
                        <p className="px-3 py-4 text-[12px] text-[#A8B0BC] text-center">조회된 업무가 없습니다.</p>
                    )}
                    <div
                        className="h-[calc(100dvh-250px)] w-full overflow-y-auto"
                    >
                        {tasks.map((task) => (
                            <MyWorkItem key={`${task.workspaceId}-${task.taskId}`} task={task} />
                        ))}
                        <div aria-hidden="true" className="h-1 w-full" ref={loadMoreRef} />
                    </div>
                    {isFetchingNextPage && <p className="px-3 py-4 text-center text-[12px] text-[#A8B0BC]">업무를 더 불러오는 중입니다.</p>}
                </div>
            </section>
        </main>
    );
}
