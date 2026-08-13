'use client'

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { useTaskCommentEditStore } from "@/store/useTaskCommentEditStore";
import { deleteWorkspaceTaskCommentAction } from "../actions";

interface TaskCommentMenuProps {
    workspaceId: string;
    taskId: number;
    commentId: number;
    content: string;
    mentionedUserIds?: number[];
    authorName: string;
    createdAt: string;
    closeMenu: () => void;
}

export default function TaskCommentMenu({
    workspaceId,
    taskId,
    commentId,
    content,
    mentionedUserIds,
    authorName,
    createdAt,
    closeMenu,
}: TaskCommentMenuProps) {

    const queryClient = useQueryClient();
    const setEditingComment = useTaskCommentEditStore((state) => state.setEditingComment);
    const [error, setError] = useState("");

    const deleteMutation = useMutation({
        mutationFn: (() => (
            deleteWorkspaceTaskCommentAction(Number(workspaceId), taskId, commentId)
        )),
        onSuccess: (result) => {
            if (!result.success) {
                setError(result.message);
                return;
            }

            void queryClient.invalidateQueries({
                queryKey: ["workspace", workspaceId],
            });

            void queryClient.invalidateQueries({
                queryKey: ["task", workspaceId, taskId],
            });

            toast.success(result.message);
        },
    });

    return (
        <div className="absolute top-full right-0 z-10 mt-1 w-20 overflow-hidden rounded-[7px] border border-[#D7E8DB] bg-white py-1 shadow-[0_6px_16px_rgba(22,34,54,0.14)]">
            <button
                className="block w-full px-3 py-1.5 text-left text-[11px] text-[#64748B] hover:bg-[#F7F8F9]"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setEditingComment({
                        workspaceId: Number(workspaceId),
                        taskId,
                        commentId,
                        content,
                        mentionedUserIds,
                        authorName,
                        createdAt,
                    });
                    closeMenu();
                }}
                type="button"
            >
                수정
            </button>
            <button
                className="block w-full px-3 py-1.5 text-left text-[11px] text-[#C0483F] hover:bg-[#F7F8F9]"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setError("");
                    deleteMutation.mutate();
                }}
                disabled={deleteMutation.isPending}
                type="button"
            >
                {deleteMutation.isPending ? "삭제 중" : "삭제"}
            </button>
            {error && (
                <p className="px-2 py-1 text-[10px] text-[#C0483F]">{error}</p>
            )}
        </div>
    )
}
