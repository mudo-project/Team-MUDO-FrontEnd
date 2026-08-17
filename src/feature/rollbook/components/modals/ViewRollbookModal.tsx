"use client";

import useModal from "@/components/hooks/useModal";
import RollbookItem, { RollbookDraft } from "@/feature/rollbook/components/RollbookItem";
import RollbookStatus from "@/feature/rollbook/components/RollbookStatus";
import SendMessageModal from "@/feature/rollbook/components/modals/SendMessageModal";
import {
    changeLectureAttendanceAction,
    getLectureAttendanceAction,
} from "@/feature/rollbook/actions";
import {
    AttendanceStatus,
    LectureAttendanceData,
} from "@/feature/rollbook/type";
import { format } from "date-fns";
import { Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import AttendanceDownloadButton from "../AttendanceDownloadButton";

const SUMMARY_ITEMS = [
    { key: "total", label: "전체", color: "text-[#0F172A]" },
    { key: "present", label: "출석", color: "text-[#16A34A]" },
    { key: "absent", label: "결석", color: "text-[#DC2626]" },
    { key: "late", label: "지각", color: "text-[#D97706]" },
    { key: "online", label: "온라인", color: "text-[#2563EB]" },
    { key: "etc", label: "기타", color: "text-[#6B7280]" },
] as const;

export default function ViewRollbookModal({
    closeModal,
    lectureId,
}: {
    closeModal: () => void;
    lectureId: number;
}) {
    const sendMessageModal = useModal();
    const [date, setDate] = useState(() => format(new Date(), "yyyy-MM-dd"));
    const [attendance, setAttendance] = useState<LectureAttendanceData | null>(null);
    const [drafts, setDrafts] = useState<Record<number, RollbookDraft>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");
    const [refreshVersion, setRefreshVersion] = useState(0);

    useEffect(() => {
        let isCancelled = false;

        async function loadAttendance() {
            setIsLoading(true);
            setError("");
            setAttendance(null);
            setDrafts({});

            const result = await getLectureAttendanceAction(lectureId, date);
            if (isCancelled) return;

            if (!result.success || !result.data) {
                setError(result.message);
                setIsLoading(false);
                return;
            }

            setAttendance(result.data);
            setIsLoading(false);
        }

        void loadAttendance();

        return () => {
            isCancelled = true;
        };
    }, [date, lectureId, refreshVersion]);

    const changeDraft = (
        studentId: number,
        change: Partial<RollbookDraft>,
    ) => {
        const original = attendance?.entries.find(
            (entry) => entry.studentId === studentId,
        );
        if (!original) return;

        setDrafts((current) => {
            const currentDraft = current[studentId];
            const next = {
                status:
                    change.status !== undefined
                        ? change.status
                        : currentDraft?.status ?? original.status,
                note:
                    change.note !== undefined
                        ? change.note
                        : currentDraft?.note ?? original.note ?? "",
            };

            if (
                next.status === original.status &&
                next.note === (original.note ?? "")
            ) {
                const remaining = { ...current };
                delete remaining[studentId];
                return remaining;
            }

            return { ...current, [studentId]: next };
        });
    };

    const draftEntries = Object.entries(drafts);
    const canSave =
        draftEntries.length > 0 &&
        draftEntries.every(([, draft]) => draft.status !== null) &&
        !isLoading &&
        !isSaving;

    const saveAttendance = async () => {
        if (!canSave) return;

        setIsSaving(true);
        setError("");

        const result = await changeLectureAttendanceAction(lectureId, date, {
            entries: draftEntries.map(([studentId, draft]) => ({
                studentId: Number(studentId),
                status: draft.status as AttendanceStatus,
                note: draft.note.trim() || null,
            })),
        });

        if (!result.success) {
            setError(result.message);
            setIsSaving(false);
            return;
        }

        toast.success(result.message);
        setIsSaving(false);
        setRefreshVersion((version) => version + 1);
    };

    return (
        <div className="fixed inset-0 z-999 bg-[#162236]/40" onClick={closeModal}>
            <form
                aria-labelledby="view-rollbook-modal-title"
                className="fixed top-1/2 left-1/2 z-1000 w-11/12 md:w-[720px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[12px] bg-white shadow-[0_12px_32px_rgba(15,23,42,0.18)]"
                onClick={(event) => event.stopPropagation()}
                onSubmit={(event) => {
                    event.preventDefault();
                    void saveAttendance();
                }}
                role="dialog"
            >
                <header className="px-7 pt-[22px] pb-[18px]">
                    <div className="flex items-start">
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 id="view-rollbook-modal-title" className="h-7 text-[15px] sm:text-base md:text-[17px] leading-[25.5px] font-bold text-[#0F172A]">
                                    {attendance?.lectureName}
                                </h2>
                            </div>
                            <p className="mt-1 text-[12px] leading-[18px] text-[#64748B]">
                                선택한 날짜의 학생별 출결을 관리합니다.
                            </p>
                        </div>
                        <button aria-label="출결 조회 모달 닫기" className="ml-auto text-[#94A3B8]" onClick={closeModal} type="button">
                            <X aria-hidden="true" className="size-[18px]" strokeWidth={1.5} />
                        </button>
                    </div>

                    <div className="mt-3.5 flex items-center gap-2 flex-wrap">
                        <input
                            aria-label="출결 날짜"
                            className="h-[34px] w-[126px] rounded-[8px] border border-[#DCE8E2] bg-white px-3 text-[12px] text-[#0F172A] focus:outline-none"
                            onChange={(event) => setDate(event.target.value)}
                            type="date"
                            value={date}
                        />
                        <button
                            className=" ml-auto flex h-[34px] items-center gap-1.5 rounded-[8px] border border-[#DCE8E2] bg-white px-3 text-[13px] leading-[19.5px] font-medium text-[#0F172A] disabled:cursor-not-allowed disabled:text-[#94A3B8]"
                            disabled={isLoading}
                            onClick={sendMessageModal.openModal}
                            type="button"
                        >
                            <Phone aria-hidden="true" className="size-[13px]" strokeWidth={1.5} />
                            <p className="hidden sm:block">출결 문자 발송</p>
                        </button>
                        <AttendanceDownloadButton date={date} lectureId={lectureId} />
                        <button
                            className="h-[34px] rounded-[8px] bg-[#1F8A70] px-4 text-[13px] leading-[19.5px] font-medium text-white disabled:bg-[#E2E8F0] disabled:text-[#94A3B8]"
                            disabled={!canSave}
                            type="submit"
                        >
                            {isSaving ? "저장 중" : "저장"}
                        </button>
                    </div>
                    {error && <p className="mt-2 text-[12px] text-[#DC2626]" role="alert">{error}</p>}
                </header>

                <div className="grid grid-cols-6 border-y border-[#DCE8E2]">
                    {SUMMARY_ITEMS.map((item, index) => (
                        <RollbookStatus
                            color={item.color}
                            count={attendance?.summary[item.key] ?? 0}
                            hasRightBorder={index < SUMMARY_ITEMS.length - 1}
                            key={item.key}
                            label={item.label}
                        />
                    ))}
                </div>

                <div className="max-h-[228px] overflow-y-auto">
                    <div className="sticky top-0 z-10 grid h-9  sm:grid-cols-12 grid-cols-11 items-center gap-3 border-b border-[#DCE8E2] bg-white px-6 text-[10px] md:text-[11px] leading-[16.5px] font-medium text-[#B0B8C1]">
                        <p className="col-span-3">학생</p><p className="col-span-1 hidden sm:block">학년</p><p className="col-span-4">출결 상태</p><p className="col-span-4">비고</p>
                    </div>

                    {isLoading && <p className="py-8 text-center text-[12px] text-[#94A3B8]">출결 정보를 불러오는 중입니다.</p>}
                    {!isLoading && attendance?.entries.length === 0 && <p className="py-8 text-center text-[12px] text-[#94A3B8]">등록된 학생이 없습니다.</p>}
                    {!isLoading && attendance?.entries.map((entry) => (
                        <RollbookItem
                            draft={drafts[entry.studentId]}
                            entry={entry}
                            key={entry.studentId}
                            onChange={(change) => changeDraft(entry.studentId, change)}
                        />
                    ))}
                </div>
            </form>
            {sendMessageModal.isModal && (
                <SendMessageModal
                    closeModal={sendMessageModal.closeModal}
                    date={date}
                    lectureId={lectureId}
                    lectureName={attendance?.lectureName ?? ""}
                />
            )}
        </div>
    );
}
