'use client'

import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, Search, X } from "lucide-react";
import { toast } from "sonner";
import { getChatRoomMembersAction, createTaskCardAction, getCurrentUserIdAction, updateTaskCardAction } from "../actions";
import { getInitials } from "../utils";

type TaskCreateModalProps = {
    roomId: number;
    onClose: () => void;
    onCreated: () => void;
    editingCard?: MessengerTaskCardItemData;
};

export default function TaskCreateModal({ roomId, onClose, onCreated, editingCard }: TaskCreateModalProps) {
    const [members, setMembers] = useState<MessengerRoomMemberData[]>([]);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [content, setContent] = useState(editingCard?.content ?? "");
    const [dueDate, setDueDate] = useState(editingCard?.dueDate ?? "");
    const [assigneeIds, setAssigneeIds] = useState<number[]>(editingCard?.assignees.map((assignee) => assignee.userId) ?? []);
    const [assigneeQuery, setAssigneeQuery] = useState("");
    const [isAssigneeMenuOpen, setIsAssigneeMenuOpen] = useState(false);
    const assigneeMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        getChatRoomMembersAction(roomId).then(setMembers);
        getCurrentUserIdAction().then(setCurrentUserId);
    }, [roomId]);

    useEffect(() => {
        if (!isAssigneeMenuOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (!assigneeMenuRef.current?.contains(event.target as Node)) {
                setIsAssigneeMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isAssigneeMenuOpen]);

    const filteredMembers = useMemo(
        () =>
            members.filter(
                (member) =>
                    member.userId !== currentUserId &&
                    !assigneeIds.includes(member.userId) &&
                    member.name.includes(assigneeQuery.trim())
            ),
        [members, currentUserId, assigneeIds, assigneeQuery]
    );

    const removeAssignee = (userId: number) => {
        setAssigneeIds((prev) => prev.filter((id) => id !== userId));
    };

    const selectAssignee = (userId: number) => {
        setAssigneeIds((prev) => [...prev, userId]);
        setIsAssigneeMenuOpen(false);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const result = editingCard
            ? await updateTaskCardAction(roomId, editingCard.id, content, assigneeIds, dueDate || undefined)
            : await createTaskCardAction(roomId, content, assigneeIds, dueDate || undefined);

        if (result.success) {
            toast.success(result.message);
            onCreated();
            onClose();
        } else {
            toast.error(result.message);
        }
    };

    return (
        <div className="fixed top-0 left-0 z-999 h-screen w-screen bg-[#162236]/45">
            <form className="fixed top-1/2 left-1/2 z-1000 w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-[12px] bg-white p-6 shadow-[0_8px_12px_rgba(22,34,54,0.12)]" onSubmit={handleSubmit}>
                <div className="flex h-[27px] w-full items-center">
                    <h2 className="text-[18px] font-bold leading-[27px] text-[#0F172A]">{editingCard ? "업무지시 수정" : "업무지시 작성"}</h2>
                    <button
                        aria-label="업무지시 작성 모달 닫기"
                        className="ml-auto flex size-[18px] items-center justify-center text-[#64748B]"
                        onClick={onClose}
                        type="button"
                    >
                        <X className="size-[18px]" strokeWidth={1.5} />
                    </button>
                </div>

                <div className="mt-5 w-full">
                    <label
                        className="block pb-1.5 text-[13px] font-medium leading-[19.5px] text-[#0F172A]"
                        htmlFor="task-content"
                    >
                        내용
                    </label>
                    <textarea
                        className="min-h-24 w-full resize-y rounded-[8px] border border-[#D7E8DB] px-3 py-2.5 text-[13px] text-[#0F172A] outline-none placeholder:text-[#94A3B8]"
                        id="task-content"
                        onChange={(event) => setContent(event.target.value)}
                        placeholder="예: 금요일 보강 교실 변경 안내 부탁드립니다"
                        value={content}
                    />
                </div>

                <div className="mt-5 w-full">
                    <p className="pb-1.5 text-[13px] font-medium leading-[19.5px] text-[#0F172A]">담당자</p>
                    <div className="flex flex-wrap items-center gap-2">
                        {assigneeIds.map((userId) => {
                            const member = members.find((item) => item.userId === userId);
                            if (!member) return null;
                            return (
                                <span
                                    className="inline-flex items-center gap-1.5 rounded-full bg-[#F1F3F5] py-1.5 pr-2 pl-3 text-[12px] font-medium text-[#0F172A]"
                                    key={userId}
                                >
                                    {member.name}
                                    <button
                                        aria-label={`${member.name} 담당자 제거`}
                                        className="flex size-4 items-center justify-center text-[#94A3B8]"
                                        onClick={() => removeAssignee(userId)}
                                        type="button"
                                    >
                                        <X className="size-3" strokeWidth={2} />
                                    </button>
                                </span>
                            );
                        })}

                        <div className="relative" ref={assigneeMenuRef}>
                            <button
                                className="inline-flex h-8 items-center gap-1 rounded-full border border-[#D7E8DB] px-3 text-[12px] font-medium text-[#0F172A]"
                                onClick={() => setIsAssigneeMenuOpen((open) => !open)}
                                type="button"
                            >
                                <Plus className="size-3.5" strokeWidth={2} />
                                추가
                            </button>

                            {isAssigneeMenuOpen && (
                                <div className="absolute top-[calc(100%+6px)] left-0 z-30 w-64 overflow-hidden rounded-[10px] border border-[#D7E8DB] bg-white shadow-[0_12px_24px_rgba(22,34,54,0.18)]">
                                    <label className="flex h-10 items-center gap-2 border-b border-[#EDF1EE] px-3">
                                        <Search className="size-3.5 text-[#94A3B8]" strokeWidth={1.8} />
                                        <input
                                            aria-label="담당자 검색"
                                            className="min-w-0 flex-1 border-0 bg-transparent text-[12px] outline-none placeholder:text-[#94A3B8]"
                                            onChange={(event) => setAssigneeQuery(event.target.value)}
                                            placeholder="이름 검색"
                                            value={assigneeQuery}
                                        />
                                    </label>
                                    <p className="px-3 pt-2 pb-1 text-[10px] text-[#94A3B8]">이 채팅방 참여자만 지정할 수 있습니다</p>
                                    <div className="max-h-52 overflow-y-auto pb-1">
                                        {filteredMembers.length === 0
                                            ? <p className="px-3 py-4 text-center text-[11px] text-[#94A3B8]">일치하는 인원이 없습니다</p>
                                            : filteredMembers.map((member) => {
                                                return (
                                                    <button
                                                        className="flex w-full items-center gap-2.5 px-3 py-2 text-left hover:bg-[#F7F9F7]"
                                                        key={member.userId}
                                                        onClick={() => selectAssignee(member.userId)}
                                                        type="button"
                                                    >
                                                        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#E2ECE4] text-[9px] font-semibold text-[#285D3B]">
                                                            {getInitials(member.name)}
                                                        </span>
                                                        <span className="min-w-0 flex-1">
                                                            <strong className="block truncate text-[12px] font-semibold text-[#0F172A]">{member.name}</strong>
                                                        </span>
                                                    </button>
                                                );
                                            })
                                        }
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-5 w-full">
                    <label
                        className="block pb-1.5 text-[13px] font-medium leading-[19.5px] text-[#0F172A]"
                        htmlFor="task-due-date"
                    >
                        마감일 (선택)
                    </label>
                    <input
                        className="h-11 w-full rounded-[8px] border border-[#D7E8DB] px-3 text-[14px] text-[#0F172A] outline-none"
                        id="task-due-date"
                        onChange={(event) => setDueDate(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key !== "Tab") event.preventDefault();
                        }}
                        type="date"
                        value={dueDate}
                    />
                </div>

                <div className="mt-5 flex w-full justify-end gap-2">
                    <button
                        className="h-11 rounded-[8px] border border-[#D7E8DB] bg-white px-5 text-[14px] font-normal leading-[21px] text-[#0F172A]"
                        onClick={onClose}
                        type="button"
                    >
                        취소
                    </button>
                    <button
                        className="h-11 rounded-[8px] bg-[#172033] px-5 text-[14px] font-semibold leading-[21px] text-white"
                        type="submit"
                    >
                        {editingCard ? "수정 완료" : "등록"}
                    </button>
                </div>
            </form>
        </div>
    );
}
