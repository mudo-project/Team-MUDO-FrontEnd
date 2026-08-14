'use client'

import { useEffect, useRef } from "react";
import MyWorkItem from "./MyWorkItem";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getMyWorkspaceTaskListAction } from "../actions";
import { MyWorkspaceTaskStatus } from "../type";

export default function MyWorkList({ status, workspaceId }: {
    status?: MyWorkspaceTaskStatus;
    workspaceId?: number;
}) {
    const loadMoreRef = useRef<HTMLDivElement>(null);

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

    return (
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
    )
}