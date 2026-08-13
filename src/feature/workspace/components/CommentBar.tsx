'use client'

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { changeWorkspaceTaskCommentAction, createWorkspaceTaskCommentAction } from "../actions";
import { getUserListAction } from "@/feature/auth/actions";
import { WorkspaceMemberData } from "../type";
import { useTaskCommentEditStore } from "@/store/useTaskCommentEditStore";
import { X } from "lucide-react";

export default function CommentBar({ selectedTask, workspaceId, workspaceMembers }: { selectedTask: number, workspaceId: string, workspaceMembers: WorkspaceMemberData[] }) {

    const queryClient = useQueryClient();
    const editingComment = useTaskCommentEditStore((state) => state.editingComment);
    const setEditingContent = useTaskCommentEditStore((state) => state.setEditingContent);
    const setEditingMentionedUserIds = useTaskCommentEditStore((state) => state.setEditingMentionedUserIds);
    const clearEditingComment = useTaskCommentEditStore((state) => state.clearEditingComment);
    const [comment, setComment] = useState("");
    const [error, setError] = useState("");
    const [searchError, setSearchError] = useState("");
    const [members, setMembers] = useState<UserListResponse[]>([]);
    const [selectedMembers, setSelectedMembers] = useState<UserListResponse[]>([]);
    const [resolvedSearchKey, setResolvedSearchKey] = useState("");
    const [mentionQuery, setMentionQuery] = useState("");
    const [mentionStart, setMentionStart] = useState<number>();
    const memberListRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const editingCommentId = editingComment?.commentId;

    const createMutation = useMutation({
        mutationFn: ((formData: FormData) => (
            createWorkspaceTaskCommentAction(Number(workspaceId), selectedTask, formData)
        )),
        onSuccess: (result) => {
            if (!result.success) {
                setError(result.message)
                return;
            }

            void queryClient.invalidateQueries({
                queryKey: ["workspace", workspaceId],
            });

            void queryClient.invalidateQueries({
                queryKey: ["task", workspaceId, selectedTask],
            });

            setComment("");
            setSelectedMembers([]);
            setMentionStart(undefined);
            setError("");
            toast.success(result.message)
        },
    });

    const editMutation = useMutation({
        mutationFn: ({
            commentId,
            content,
            mentionedUserIds,
        }: {
            commentId: number;
            content: string;
            mentionedUserIds: number[];
        }) => changeWorkspaceTaskCommentAction(
            Number(workspaceId),
            selectedTask,
            commentId,
            { content, mentionedUserIds },
        ),
        onSuccess: (result) => {
            if (!result.success) {
                setError(result.message);
                return;
            }

            void queryClient.invalidateQueries({
                queryKey: ["workspace", workspaceId],
            });
            void queryClient.invalidateQueries({
                queryKey: ["task", workspaceId, selectedTask],
            });

            setComment("");
            setSelectedMembers([]);
            setMentionStart(undefined);
            setError("");
            clearEditingComment();
            toast.success(result.message);
        },
        onError: (error) => {
            setError(error.message);
        },
    });

    useEffect(() => {
        if (editingCommentId === undefined) return;
        requestAnimationFrame(() => inputRef.current?.focus());
    }, [editingCommentId]);

    useEffect(
        () => () => clearEditingComment(),
        [clearEditingComment, selectedTask, workspaceId],
    );

    useEffect(() => {
        if (mentionStart === undefined) return;

        let cancelled = false;
        const searchKey = `${mentionStart}:${mentionQuery}`;

        const fetchUser = async () => {
            setSearchError("");
            const response = await getUserListAction(mentionQuery.trim());
            if (cancelled) return;

            const workspaceMemberIds = new Set(
                workspaceMembers.map(({ userId }) => userId),
            );
            setMembers(
                (response.data ?? []).filter(({ userId }) =>
                    workspaceMemberIds.has(userId),
                ),
            );
            setSearchError(response.success ? "" : response.message);
            setResolvedSearchKey(searchKey);
        };

        if (!mentionQuery.trim()) {
            void fetchUser();
            return () => {
                cancelled = true;
            };
        }

        const debounceTimer = setTimeout(() => void fetchUser(), 500);

        return () => {
            cancelled = true;
            clearTimeout(debounceTimer);
        };
    }, [mentionQuery, mentionStart, workspaceMembers]);

    useEffect(() => {
        if (mentionStart === undefined) return;

        const closeMemberList = (event: PointerEvent) => {
            if (!memberListRef.current?.contains(event.target as Node)) {
                setMentionStart(undefined);
            }
        };

        document.addEventListener("pointerdown", closeMemberList);
        return () => document.removeEventListener("pointerdown", closeMemberList);
    }, [mentionStart]);

    const updateMentionSearch = (value: string, cursor: number) => {
        const textBeforeCursor = value.slice(0, cursor);
        const match = textBeforeCursor.match(/(?:^|\s)@([^\s@]*)$/);

        if (!match) {
            setMentionStart(undefined);
            setMentionQuery("");
            return;
        }

        const atIndex = textBeforeCursor.lastIndexOf("@");
        setMentionStart(atIndex);
        setMentionQuery(match[1]);
    };

    const selectMember = (member: UserListResponse) => {
        if (mentionStart === undefined) return;

        const currentComment = editingComment?.content ?? comment;
        const cursor = inputRef.current?.selectionStart ?? currentComment.length;
        const nextComment = `${currentComment.slice(0, mentionStart)}@${member.name} ${currentComment.slice(cursor)}`;

        if (editingComment) {
            setEditingContent(nextComment);
            setEditingMentionedUserIds(
                Array.from(new Set([...(editingComment.mentionedUserIds ?? []), member.userId])),
            );
        } else {
            setComment(nextComment);
            setSelectedMembers((current) =>
                current.some(({ userId }) => userId === member.userId)
                    ? current
                    : [...current, member],
            );
        }
        setMentionStart(undefined);
        setMentionQuery("");

        requestAnimationFrame(() => {
            inputRef.current?.focus();
            const nextCursor = mentionStart + member.name.length + 2;
            inputRef.current?.setSelectionRange(nextCursor, nextCursor);
        });
    };

    const submitComment = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");

        const mentionedUserIds = editingComment
            ? (editingComment.mentionedUserIds ?? [])
            : selectedMembers.map(({ userId }) => userId);

        if (editingComment) {
            editMutation.mutate({
                commentId: editingComment.commentId,
                content: editingComment.content,
                mentionedUserIds,
            });
            return;
        }

        const formData = new FormData(event.currentTarget);
        mentionedUserIds.forEach((userId) => {
            formData.append("mentionedUserIds", String(userId));
        });
        createMutation.mutate(formData);
    };

    const isSearching = mentionStart !== undefined && resolvedSearchKey !== `${mentionStart}:${mentionQuery}`;


    return (
        <form
            className="relative flex flex-wrap gap-2 border-t border-[#D7E8DB] bg-[#FCFCFC] px-5 py-3"
            onSubmit={submitComment}
        >
            {editingComment && (
                <div className="flex w-full items-center text-[10px] leading-[15px] text-[#C0C8D0]">
                    <span>{editingComment.authorName} · {editingComment.createdAt}</span>
                    <button
                        aria-label="댓글 수정 취소"
                        className="ml-auto"
                        onClick={() => {
                            clearEditingComment();
                            setComment("");
                            setSelectedMembers([]);
                            setError("");
                        }}
                        type="button"
                    >
                        <X className="size-3.5" strokeWidth={1.5} />
                    </button>
                </div>
            )}
            <div ref={memberListRef} className="relative min-w-0 flex-1">
                {mentionStart !== undefined && (
                    <div className="absolute bottom-full left-0 z-10 mb-1 max-h-48 w-full overflow-y-auto rounded-[8px] border border-[#D7E8DB] bg-white py-1 shadow-[0_8px_16px_rgba(22,34,54,0.16)]">
                        {searchError && (
                            <p className="px-3 py-2.5 text-[12px] text-red-500">{searchError}</p>
                        )}
                        {isSearching && (
                            <p className="px-3 py-2.5 text-[12px] text-[#64748B]">구성원을 검색하는 중입니다.</p>
                        )}
                        {!isSearching && !searchError && members.length === 0 && (
                            <p className="px-3 py-2.5 text-[12px] text-[#64748B]">검색 결과가 없습니다.</p>
                        )}
                        {!isSearching && members.map((member) => (
                            <button
                                className="flex w-full items-center gap-2.5 px-3 py-2 text-left hover:bg-[#F7F9F8]"
                                key={member.userId}
                                onClick={() => selectMember(member)}
                                type="button"
                            >
                                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#D7E8DB] text-[10px] font-semibold text-[#0F172A]">
                                    {member.name.slice(0, 2)}
                                </span>
                                <span>
                                    <strong className="block text-[12px] font-medium text-[#0F172A]">{member.name}</strong>
                                    <span className="block text-[10px] text-[#64748B]">{member.username}</span>
                                </span>
                            </button>
                        ))}
                    </div>
                )}

                <input
                    className="h-9 w-full rounded-[7px] border border-[#D7E8DB] bg-[#FAFBFC] px-3 text-[12px] text-[#0F172A] placeholder:text-[#0F172A]/50 focus:outline-none"
                    name="comment"
                    onChange={(event) => {
                        const value = event.target.value;
                        if (editingComment) {
                            setEditingContent(value);
                            setEditingMentionedUserIds(
                                (editingComment.mentionedUserIds ?? []).filter((userId) => {
                                    const member = workspaceMembers.find((item) => item.userId === userId);
                                    return member ? value.includes(`@${member.name}`) : false;
                                }),
                            );
                        } else {
                            setComment(value);
                            setSelectedMembers((current) =>
                                current.filter(({ name }) => value.includes(`@${name}`)),
                            );
                        }
                        updateMentionSearch(value, event.target.selectionStart ?? value.length);
                    }}
                    onKeyDown={(event) => {
                        if (event.key === "Escape") setMentionStart(undefined);
                    }}
                    placeholder="코멘트 추가 · @ 로 멘션"
                    ref={inputRef}
                    value={editingComment?.content ?? comment}
                />
                {error && <p className="mt-1 text-[11px] text-red-500">{error}</p>}
            </div>
            <button
                className="h-9 shrink-0 rounded-[7px] bg-[#0F172A] px-3 text-[12px] font-medium text-white disabled:bg-[#0F172A]/40"
                disabled={createMutation.isPending || editMutation.isPending || !(editingComment?.content ?? comment).trim()}
                type="submit"
            >
                {editingComment
                    ? (editMutation.isPending ? "수정 중..." : "수정")
                    : (createMutation.isPending ? "추가 중..." : "추가")}
            </button>
        </form>
    )
}
