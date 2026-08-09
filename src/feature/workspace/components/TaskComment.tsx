"use client";

import { Check, EllipsisVertical } from "lucide-react"
import { useEffect, useId, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import TaskCommentMenu from "./TaskCommentMenu";
import { toggleWorkspaceTaskCommentCompleteAction } from "../actions";
import { WorkspaceTaskCommentListItemData } from "../type";

interface TaskCommentProps {
    comment: WorkspaceTaskCommentListItemData;
    workspaceId: string;
    taskId: number;
}

export default function TaskComment({
    comment,
    workspaceId,
    taskId,
}: TaskCommentProps) {
    const queryClient = useQueryClient();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCompleted, setIsCompleted] = useState(comment.completed);
    const [error, setError] = useState("");
    const menuRef = useRef<HTMLDivElement>(null);

    const toggleCompleteMutation = useMutation({
        mutationFn: () =>
            toggleWorkspaceTaskCommentCompleteAction(
                Number(workspaceId),
                taskId,
                comment.commentId,
            ),
        onSuccess: (result) => {
            if (!result.success) {
                setError(result.message);
                return;
            }

            setIsCompleted(result.data?.completed ?? false);
            setError("");

            void queryClient.invalidateQueries({
                queryKey: ["workspace", workspaceId],
            });
            void queryClient.invalidateQueries({
                queryKey: ["task", workspaceId, taskId],
            });

            toast.success(result.message);
        },
    });

    useEffect(() => {
        if (!isMenuOpen) return;

        const closeMenu = (event: PointerEvent) => {
            if (!menuRef.current?.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener("pointerdown", closeMenu);

        return () => document.removeEventListener("pointerdown", closeMenu);
    }, [isMenuOpen]);

    return (
        <label
            htmlFor={String(comment.commentId)}
            className="flex items-start gap-2.5 rounded-[8px] border border-[#D7E8DB] bg-white px-3 py-2.5">
            <input
                checked={isCompleted}
                className="peer hidden"
                disabled={toggleCompleteMutation.isPending}
                id={String(comment.commentId)}
                onChange={() => {
                    setError("");
                    toggleCompleteMutation.mutate();
                }}
                type="checkbox"
            />
            <div className="border-[#94A3B8] border-1 flex items-center justify-center text-[#94A3B8] peer-checked:bg-[#2C8D50] peer-checked:border-[#2C8D50] peer-checked:text-[#ffffff] rounded-full mt-0.5 w-5 h-5">
                <Check
                    className="size-3"
                    strokeWidth={1.5}
                />
            </div>
            <div className="peer-checked:[&>p]:line-through [&>p]:text-[#0F172A] peer-checked:[&>p]:text-[#64748B]">
                <p className="text-[12px] leading-[18px] ">
                    {comment.content}
                </p>
                <div className="mt-1 text-[10px] leading-[15px] text-[#C0C8D0]">
                    {comment.author.name} · {comment.createdAt}
                </div>
            </div>
            <div ref={menuRef} className="relative ml-auto">
                <button
                    aria-expanded={isMenuOpen}
                    aria-label="댓글 메뉴 열기"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsMenuOpen((prev) => !prev);
                    }}
                    type="button"
                >
                    <EllipsisVertical
                        className="size-3"
                        strokeWidth={1.5}
                    />
                </button>

                {isMenuOpen && (
                    <TaskCommentMenu
                        commentId={comment.commentId}
                        taskId={taskId}
                        workspaceId={workspaceId}
                    />
                )}
            </div>
            {error && (
                <p className="text-[10px] text-[#C0483F]" role="alert">
                    {error}
                </p>
            )}
        </label>
    )
}
