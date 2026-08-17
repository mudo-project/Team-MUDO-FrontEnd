'use client'

import { useState } from "react";
import { Check, CheckSquare, Circle, X } from "lucide-react";
import { toast } from "sonner";
import useModal from "@/components/hooks/useModal";
import TwoButtonModal from "@/components/ui/TwoButtonModal";
import { formatChatTime, getInitials } from "../utils";
import { completeTaskCardAction, deleteTaskCardAction } from "../actions";
import TaskCreateModal from "./TaskCreateModal";

type TaskDetailModalProps = {
    onClose: () => void;
    card: MessengerTaskCardItemData;
    currentUserId: number | null;
    roomId: number;
    roomName?: string;
    onTaskCardsChange: () => void;
};

export default function TaskDetailModal({ card, currentUserId, roomId, roomName, onTaskCardsChange, onClose }: TaskDetailModalProps) {
    const [isEditing, setIsEditing] = useState(false);

    const percent = card.assigneeCount === 0 ? 0 : Math.round((card.completedCount / card.assigneeCount) * 100);
    const myAssignment = card.assignees.find((assignee) => assignee.userId === currentUserId);
    const canComplete = myAssignment && !myAssignment.completedAt;
    const isOwner = card.assignerId === currentUserId;

    const handleComplete = async () => {
        await completeTaskCardAction(roomId, card.id);
        onTaskCardsChange();
        onClose();
    };

    const deleteModal = useModal(async () => {
        const result = await deleteTaskCardAction(roomId, card.id);
        if (result.success) {
            toast.success(result.message);
            onTaskCardsChange();
            onClose();
        } else {
            toast.error(result.message);
        }
    });

    if (isEditing) {
        return (
            <TaskCreateModal
                roomId={roomId}
                editingCard={card}
                onClose={() => setIsEditing(false)}
                onCreated={() => {
                    setIsEditing(false);
                    onTaskCardsChange();
                    onClose();
                }}
            />
        );
    }

    return (
        <div className="fixed top-0 left-0 z-999 h-screen w-screen bg-[#162236]/45">
            <div className="fixed top-1/2 left-1/2 z-1000 max-h-[85vh] w-[calc(100%-2rem)] max-w-[520px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[12px] bg-white p-6 shadow-[0_8px_12px_rgba(22,34,54,0.12)] scrollbar-hide">
                <div className="flex items-center gap-1.5">
                    <span className="flex items-center gap-1 text-[14px] font-bold text-[#0F172A]">
                        <CheckSquare className="size-4 text-[#2C8D50]" strokeWidth={1.8} />
                        업무지시
                    </span>
                    <span className="text-[13px] text-[#94A3B8]">{roomName ? `· ${roomName} · ` : "· "}{card.assignerName}</span>
                    {isOwner && (
                        <span className="ml-auto flex items-center gap-1.5">
                            <button
                                className="rounded-[6px] border border-[#D7E8DB] px-2.5 py-1 text-[11px] font-medium text-[#0F172A] hover:bg-[#F7F9F7]"
                                onClick={() => setIsEditing(true)}
                                type="button"
                            >
                                수정
                            </button>
                            <button
                                className="rounded-[6px] border border-[#F1D3D0] px-2.5 py-1 text-[11px] font-medium text-[#C0483F] hover:bg-[#FBEEEC]"
                                onClick={deleteModal.openModal}
                                type="button"
                            >
                                삭제
                            </button>
                        </span>
                    )}
                    <button
                        aria-label="업무지시 상세조회 닫기"
                        className={`${isOwner ? "ml-3" : "ml-auto"} flex size-[18px] shrink-0 items-center justify-center text-[#64748B]`}
                        onClick={onClose}
                        type="button"
                    >
                        <X className="size-[18px]" strokeWidth={1.5} />
                    </button>
                </div>

                <p className="mt-5 text-[14px] leading-6 text-[#0F172A]">{card.content}</p>

                <div className="mt-5 flex items-start gap-2">
                    <span className="w-16 shrink-0 pt-1 text-[12px] text-[#64748B]">담당자</span>
                    <div className="flex flex-wrap gap-2">
                        {card.assignees.map((assignee) => (
                            <span
                                className="rounded-full bg-[#F1F3F5] px-3 py-1 text-[12px] font-medium text-[#0F172A]"
                                key={assignee.userId}
                            >
                                {assignee.name}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="mt-3 flex items-center gap-2">
                    <span className="w-16 shrink-0 text-[12px] text-[#64748B]">마감일</span>
                    <span className="text-[13px] text-[#0F172A]">{card.dueDate ?? "-"}</span>
                </div>

                <div className="mt-3 flex items-center gap-2">
                    <span className="w-16 shrink-0 text-[12px] text-[#64748B]">등록일시</span>
                    <span className="text-[13px] text-[#0F172A]">{formatChatTime(card.createdAt)}</span>
                </div>

                <div className="mt-5 flex items-center justify-between">
                    <strong className="text-[13px] font-bold text-[#0F172A]">완료 현황</strong>
                    <span className="text-[12px] text-[#64748B]">{card.completedCount}/{card.assigneeCount}명 완료</span>
                </div>
                <div className="mt-2 h-[6px] w-full rounded-full bg-[#E7ECE8]">
                    <div className="h-full rounded-full bg-[#2C8D50]" style={{ width: `${percent}%` }} />
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                    {card.assignees.map((assignee) => (
                        <span
                            className="inline-flex items-center gap-1.5 rounded-full border border-[#D7E8DB] bg-white px-2.5 py-1.5 text-[12px] text-[#0F172A]"
                            key={assignee.userId}
                        >
                            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#E2ECE4] text-[8px] font-semibold text-[#285D3B]">
                                {getInitials(assignee.name)}
                            </span>
                            {assignee.name}
                            {assignee.completedAt
                                ? <Check className="size-3.5 text-[#2C8D50]" strokeWidth={2.5} />
                                : <Circle className="size-3.5 text-[#D7E8DB]" strokeWidth={2} />
                            }
                        </span>
                    ))}
                </div>

                {canComplete && (
                    <div className="mt-5 flex justify-end">
                        <button
                            className="h-10 rounded-[8px] bg-[#172033] px-4 text-[13px] font-semibold text-white"
                            onClick={handleComplete}
                            type="button"
                        >
                            완료 처리
                        </button>
                    </div>
                )}
            </div>

            {deleteModal.isModal && (
                <div className="relative z-[1100]">
                    <TwoButtonModal
                        title="업무지시 삭제"
                        content="이 업무지시를 삭제하시겠습니까?"
                        closeModal={deleteModal.closeModal}
                        activeModal={deleteModal.activeModal}
                    />
                </div>
            )}
        </div>
    );
}
