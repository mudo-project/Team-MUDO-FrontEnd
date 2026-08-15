"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import SelectMessageStudent from "@/feature/rollbook/components/SelectMessageStudent";
import { getMessageCandidatesAction, sendAttendanceMessageAction } from "@/feature/rollbook/actions";
import { AttendanceStatus, MessageCandidateData } from "@/feature/rollbook/type";

const ATTENDANCE_STATUS_LABEL: Record<AttendanceStatus, string> = {
    PRESENT: "출석",
    ABSENT: "결석",
    LATE: "지각",
    ONLINE: "온라인",
    ETC: "기타",
};

interface SendMessageModalProps {
    closeModal: () => void;
    date: string;
    lectureId: number;
    lectureName: string;
}

export default function SendMessageModal({ closeModal, date, lectureId, lectureName }: SendMessageModalProps) {
    const [candidates, setCandidates] = useState<MessageCandidateData[]>([]);
    const [selectedRecipientIds, setSelectedRecipientIds] = useState(new Set<number>());
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState("");
    const selectedCount = selectedRecipientIds.size;
    const isAllSelected = candidates.length > 0 && selectedCount === candidates.length;
    const isPartiallySelected = selectedCount > 0 && !isAllSelected;

    useEffect(() => {
        let isCancelled = false;

        async function loadCandidates() {
            setIsLoading(true);
            setError("");

            const result = await getMessageCandidatesAction(lectureId, date);
            if (isCancelled) return;

            if (!result.success || !result.data) {
                setError(result.message);
                setIsLoading(false);
                return;
            }

            const eligibleCandidates = result.data.filter((candidate) => candidate.eligible);
            setCandidates(eligibleCandidates);
            setSelectedRecipientIds(new Set(eligibleCandidates.map((candidate) => candidate.studentId)));
            setIsLoading(false);
        }

        void loadCandidates();

        return () => {
            isCancelled = true;
        };
    }, [date, lectureId]);

    const toggleAllRecipients = (checked: boolean) => {
        setSelectedRecipientIds(checked ? new Set(candidates.map((candidate) => candidate.studentId)) : new Set<number>());
    };

    const toggleRecipient = (recipientId: number, checked: boolean) => {
        setSelectedRecipientIds((current) => {
            const next = new Set(current);

            if (checked) {
                next.add(recipientId);
            } else {
                next.delete(recipientId);
            }

            return next;
        });
    };

    const sendMessage = async () => {
        if (isSending || selectedCount === 0) return;

        setIsSending(true);
        setError("");

        const result = await sendAttendanceMessageAction(lectureId, date, {
            studentIds: [...selectedRecipientIds],
        });
        setIsSending(false);

        if (!result.success) {
            setError(result.message);
            return;
        }

        toast.success(result.message);
        closeModal();
    };

    return (
        <div
            className="fixed inset-0 z-1001 flex items-center justify-center bg-[#0F172A]/60"
            onClick={(event) => {
                event.stopPropagation();
                closeModal();
            }}
        >
            <form
                aria-labelledby="send-message-modal-title"
                className="z-1002 flex max-h-[500px] w-[460px] flex-col overflow-hidden rounded-[14px] bg-white shadow-[0_8px_20px_rgba(0,0,0,0.18)]"
                onClick={(event) => event.stopPropagation()}
                onSubmit={(event) => {
                    event.preventDefault();
                    void sendMessage();
                }}
                role="dialog"
            >
                <header className="flex h-[86px] shrink-0 items-center justify-between border-b border-[#DCE8E2] px-7">
                    <div>
                        <h2 id="send-message-modal-title" className="text-[16px] leading-6 font-bold text-[#0F172A]">
                            출결 문자 발송
                        </h2>
                        <p className="mt-[3px] text-[12px] leading-[18px] text-[#64748B]">
                            {lectureName} · {date}
                        </p>
                    </div>
                    <button aria-label="닫기" className="text-[#94A3B8]" onClick={closeModal} type="button">
                        <X aria-hidden="true" className="size-[18px]" strokeWidth={1.5} />
                    </button>
                </header>

                <label className="flex h-[41px] shrink-0 cursor-pointer items-center gap-2.5 border-b border-[#DCE8E2] px-7" htmlFor="select-all-recipients">
                    <SelectMessageStudent
                        checked={isAllSelected}
                        id="select-all-recipients"
                        indeterminate={isPartiallySelected}
                        onChange={toggleAllRecipients}
                    />
                    <span className="flex-1 text-[13px] leading-[19.5px] font-medium text-[#0F172A]">전체 선택</span>
                    <span className="text-[12px] leading-[18px] text-[#94A3B8]">{selectedCount}/{candidates.length}명</span>
                </label>

                <div className="min-h-0 flex-1 overflow-y-auto">
                    {isLoading && (
                        <p className="px-7 py-8 text-center text-[12px] text-[#94A3B8]">발송 대상을 불러오는 중입니다.</p>
                    )}
                    {!isLoading && candidates.length === 0 && !error && (
                        <p className="px-7 py-8 text-center text-[12px] text-[#94A3B8]">발송 가능한 학생이 없습니다.</p>
                    )}
                    {candidates.map((candidate) => (
                        <label
                            className="flex h-[63px] cursor-pointer items-center gap-3 border-b border-[#F7F8F9] px-7"
                            htmlFor={`recipient-${candidate.studentId}`}
                            key={candidate.studentId}
                        >
                            <SelectMessageStudent
                                checked={selectedRecipientIds.has(candidate.studentId)}
                                id={`recipient-${candidate.studentId}`}
                                onChange={(checked) => toggleRecipient(candidate.studentId, checked)}
                            />
                            <div>
                                <p className="text-[13px] leading-[19.5px] font-medium text-[#0F172A]">{candidate.studentName}</p>
                                <p className="mt-px text-[11px] leading-[16.5px] text-[#94A3B8]">{ATTENDANCE_STATUS_LABEL[candidate.status]} · {candidate.parentPhone}</p>
                            </div>
                        </label>
                    ))}
                </div>

                <footer className="flex h-[73px] shrink-0 items-center justify-end gap-2 border-t border-[#DCE8E2] px-7">
                    {error && <p className="mr-auto text-[11px] text-[#DC2626]" role="alert">{error}</p>}
                    <button className="h-10 rounded-lg border border-[#DCE8E2] bg-white px-4 text-[13px] text-[#64748B]" onClick={closeModal} type="button">
                        취소
                    </button>
                    <button
                        className="h-10 rounded-lg bg-[#2A3A4A] px-5 text-[13px] font-medium text-white disabled:cursor-not-allowed disabled:bg-[#94A3B8]"
                        disabled={selectedCount === 0 || isLoading || isSending}
                        type="submit"
                    >
                        {isSending ? "전송 중" : `${selectedCount}명에게 전송`}
                    </button>
                </footer>
            </form>
        </div>
    );
}
