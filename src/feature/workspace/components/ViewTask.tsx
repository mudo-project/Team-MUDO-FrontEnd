"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronDown, X } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import {
    getWorkspaceTaskCommentListAction,
    getWorkspaceTaskDetailAction,
} from "../actions";
import { WorkspaceMemberData, WorkspaceTaskStatus } from "../type";
import CommentBar from "./CommentBar";
import TaskComment from "./TaskComment";

const statusLabel: Record<WorkspaceTaskStatus, string> = {
    WAITING: "대기",
    IN_PROGRESS: "진행중",
    COMPLETED: "완료",
    DELAYED: "지연",
};

interface ViewTaskProps {
    selectedTask: number;
    setSelectedTask: Dispatch<SetStateAction<number | undefined>>;
    workspaceId: string;
    workspaceMembers: WorkspaceMemberData[];
}

export default function ViewTask({
    selectedTask,
    setSelectedTask,
    workspaceId,
    workspaceMembers,
}: ViewTaskProps) {
    const {
        data: taskData,
        isPending: taskPending,
        isError: taskError,
    } = useQuery({
        queryKey: ["task", workspaceId, selectedTask],
        queryFn: () =>
            getWorkspaceTaskDetailAction(Number(workspaceId), selectedTask),
    });
    const {
        data: commentData,
        isPending: commentPending,
        isError: commentError,
    } = useQuery({
        queryKey: ["task", workspaceId, selectedTask, "comments", 0, 20],
        queryFn: () =>
            getWorkspaceTaskCommentListAction(
                Number(workspaceId),
                selectedTask,
            ),
    });

    const task = taskData?.data;
    const comments = commentData?.data?.content ?? [];
    const completedCommentCount = comments.filter(
        ({ completed }) => completed,
    ).length;
    const actionError =
        (!taskData?.success && taskData?.message) ||
        (!commentData?.success && commentData?.message);
    const isPending = taskPending || commentPending;
    const isError = taskError || commentError;
    const errorMessage = actionError ||
        (isError ? "업무 정보를 불러오지 못했습니다." : "");

    return (
        <aside className="fixed top-[52px] right-0 bottom-0 z-100 w-[44.3vw] min-w-[520px] max-w-[850px] border-l border-[#D7E8DB] bg-[#FCFCFC] shadow-[-8px_0_20px_rgba(22,34,54,0.06)]">
            <div className="flex h-full flex-col">
                <header className="flex items-start border-b border-[#D7E8DB] px-5 py-4">
                    <div>
                        <h2 className="text-[15px] leading-[22.5px] font-bold text-[#0F172A]">
                            {task?.title ?? "업무 상세"}
                        </h2>
                        {task && (
                            <p className="mt-0.5 text-[10px] leading-[15px] text-[#B0B8C1]">
                                등록 · {task.creator.name} · {task.createdAt}
                            </p>
                        )}
                    </div>
                    <button
                        aria-label="업무 상세 닫기"
                        className="ml-auto flex size-4 items-center justify-center text-[#C0C8D0]"
                        onClick={() => setSelectedTask(undefined)}
                        type="button"
                    >
                        <X className="size-3.5" strokeWidth={1.5} />
                    </button>
                </header>

                <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
                    {isPending && (
                        <p className="text-[12px] text-[#64748B]">
                            업무 정보를 불러오는 중입니다.
                        </p>
                    )}
                    {!isPending && errorMessage && (
                        <p className="text-[12px] text-red-500" role="alert">
                            {errorMessage}
                        </p>
                    )}

                    {!isPending && !errorMessage && task && (
                        <>
                            <dl className="grid grid-cols-[72px_1fr] items-center gap-y-3 text-[12px] leading-[18px]">
                                <dt className="text-[#94A3B8]">상태</dt>
                                <dd>
                                    <button
                                        className="flex h-7 items-center gap-1.5 rounded-[6px] bg-[#FFF7D6] px-2.5 text-[11px] font-medium text-[#B88A00]"
                                        type="button"
                                    >
                                        {statusLabel[task.status]}
                                        <ChevronDown className="size-3" strokeWidth={1.5} />
                                    </button>
                                </dd>

                                <dt className="text-[#94A3B8]">기한</dt>
                                <dd className="text-[#64748B]">
                                    {task.dueAt ?? "기한 없음"}
                                </dd>

                                <dt className="text-[#94A3B8]">상태 변경</dt>
                                <dd className="text-[#64748B]">
                                    {task.lastStatusChangedAt ?? "변경 이력 없음"}
                                </dd>
                            </dl>

                            <section className="mt-5">
                                <div className="flex items-center">
                                    <h3 className="text-[12px] leading-[18px] font-semibold text-[#0F172A]">
                                        진행 코멘트
                                    </h3>
                                    <span className="ml-1.5 text-[10px] leading-[15px] text-[#94A3B8]">
                                        {completedCommentCount}/{comments.length} 완료
                                    </span>
                                </div>

                                <div className="mt-2 space-y-2">
                                    {comments.length > 0 ? (
                                        comments.map((comment) => (
                                            <TaskComment
                                                comment={comment}
                                                key={comment.commentId}
                                                taskId={selectedTask}
                                                workspaceId={workspaceId}
                                            />
                                        ))
                                    ) : (
                                        <p className="text-[11px] text-[#94A3B8]">
                                            등록된 코멘트가 없습니다.
                                        </p>
                                    )}
                                </div>
                            </section>
                        </>
                    )}
                </div>

                <CommentBar
                    selectedTask={selectedTask}
                    workspaceId={workspaceId}
                    workspaceMembers={workspaceMembers}
                />
            </div>
        </aside>
    );
}
