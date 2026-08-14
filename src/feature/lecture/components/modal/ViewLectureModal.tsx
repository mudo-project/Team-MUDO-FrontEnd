'use client'

import { X } from "lucide-react";

import useModal from "@/components/hooks/useModal";
import TwoButtonModal from "@/components/ui/TwoButtonModal";
import EditLectureModal from "./EditLectureModal";

interface ViewLectureModalProps {
    closeModal: () => void;
}

export default function ViewLectureModal({ closeModal }: ViewLectureModalProps) {
    const editModal = useModal();
    const deleteModal = useModal();

    return (
        <div className="fixed top-0 left-0 z-999 h-screen w-screen bg-[#162236]/40" onClick={closeModal}>
            <article
                aria-labelledby="lecture-detail-title"
                aria-modal="true"
                className="fixed top-1/2 left-1/2 z-1000 max-h-[calc(100dvh-48px)] w-[560px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[12px] bg-white shadow-[0_12px_32px_rgba(22,34,54,0.18)]"
                onClick={(event) => event.stopPropagation()}
                role="dialog"
            >
                <header className="flex items-start px-6 pt-[18px] pb-4">
                    <div>
                        <div className="flex items-center gap-1.5">
                            <span className="rounded-full bg-[#EAF1FA] px-2 py-0.5 text-[11px] leading-[16.5px] font-medium text-[#1E40AF]">
                                정규반
                            </span>
                            <span className="rounded-full bg-[#F4F5F2] px-2 py-0.5 text-[11px] leading-[16.5px] font-medium text-[#64748B]">
                                고1
                            </span>
                        </div>
                        <h2
                            className="pt-1 text-[18px] leading-[27px] font-bold text-[#0F172A]"
                            id="lecture-detail-title"
                        >
                            고1 수학 정규반
                        </h2>
                    </div>

                    <div className="ml-auto flex items-center gap-1.5">
                        <button
                            className="h-[26px] rounded-[7px] border border-[#3E7D62] px-3 text-[12px] leading-[18px] font-medium text-[#3E7D62]"
                            onClick={editModal.openModal}
                            type="button"
                        >
                            수정
                        </button>
                        <button
                            className="h-[26px] rounded-[7px] border border-[#C0483F] px-3 text-[12px] leading-[18px] font-medium text-[#C0483F]"
                            onClick={deleteModal.openModal}
                            type="button"
                        >
                            삭제
                        </button>
                        <button
                            aria-label="강의 상세 모달 닫기"
                            className="flex size-[18px] items-center justify-center text-[#94A3B8]"
                            onClick={closeModal}
                            type="button"
                        >
                            <X className="size-[18px]" strokeWidth={1.5} />
                        </button>
                    </div>
                </header>

                <div className="px-6 pt-5 pb-7">
                    <section>
                        <h3 className="text-[11px] leading-[16.5px] font-semibold tracking-[0.55px] text-[#94A3B8]">
                            기본 정보
                        </h3>

                        <div className="pt-3.5">
                            <div className="flex gap-6">
                                <div className="w-full">
                                    <p className="text-[11px] leading-[16.5px] text-[#94A3B8]">
                                        과목
                                    </p>
                                    <p className="pt-[3px] text-[13px] leading-[19.5px] font-medium text-[#0F172A]">
                                        수학
                                    </p>
                                </div>
                                <div className="w-full">
                                    <p className="text-[11px] leading-[16.5px] text-[#94A3B8]">
                                        학기
                                    </p>
                                    <p className="pt-[3px] text-[13px] leading-[19.5px] font-medium text-[#0F172A]">
                                        2026 여름학기
                                    </p>
                                </div>
                            </div>

                            <div className="mt-2.5 flex gap-6">
                                <div className="w-full">
                                    <p className="text-[11px] leading-[16.5px] text-[#94A3B8]">
                                        담당 선생님
                                    </p>
                                    <p className="pt-[3px] text-[13px] leading-[19.5px] font-medium text-[#0F172A]">
                                        김선생
                                    </p>
                                </div>
                                <div className="w-full">
                                    <p className="text-[11px] leading-[16.5px] text-[#94A3B8]">
                                        강의실
                                    </p>
                                    <p className="pt-[3px] text-[13px] leading-[19.5px] font-medium text-[#0F172A]">
                                        A101 (A101)
                                    </p>
                                </div>
                            </div>

                            <div className="mt-2.5 flex gap-6">
                                <div className="w-full">
                                    <p className="text-[11px] leading-[16.5px] text-[#94A3B8]">
                                        수강료 유형
                                    </p>
                                    <p className="pt-[3px] text-[13px] leading-[19.5px] font-medium text-[#0F172A]">
                                        월정액
                                    </p>
                                </div>
                                <div className="w-full">
                                    <p className="text-[11px] leading-[16.5px] text-[#94A3B8]">
                                        수강료
                                    </p>
                                    <p className="pt-[3px] text-[13px] leading-[19.5px] font-medium text-[#0F172A]">
                                        300,000원
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mt-[22px]">
                        <h3 className="text-[11px] leading-[16.5px] font-semibold tracking-[0.55px] text-[#94A3B8]">
                            시간표
                        </h3>
                        <div className="mt-3 flex w-full items-center gap-3 rounded-[8px] bg-[#F7FAF8] px-3.5 py-2.5">
                            <strong className="w-7 text-center text-[13px] leading-[19.5px] font-bold text-[#0F172A]">
                                월
                            </strong>
                            <p className="text-[13px] leading-[19.5px] text-[#64748B]">
                                19:00 ~ 21:00
                            </p>
                            <p className="ml-auto text-[11px] leading-[16.5px] text-[#94A3B8]">
                                2시간
                            </p>
                        </div>
                    </section>

                    <section className="mt-[22px]">
                        <h3 className="text-[11px] leading-[16.5px] font-semibold tracking-[0.55px] text-[#94A3B8]">
                            수강생 <strong className="font-bold text-[#0F172A]">8명</strong>
                        </h3>

                        <div className="mt-3 flex gap-2">
                            <div className="flex h-[52px] items-center gap-2 rounded-[8px] bg-[#F4F5F2] px-3 py-2">
                                <span className="flex size-[26px] items-center justify-center rounded-full bg-[#D7E8DB] text-[11px] leading-[16.5px] font-semibold text-[#0F172A]">
                                    김
                                </span>
                                <div>
                                    <p className="text-[13px] leading-[19.5px] font-medium text-[#0F172A]">
                                        김민수
                                    </p>
                                    <p className="text-[11px] leading-[16.5px] text-[#94A3B8]">
                                        고1
                                    </p>
                                </div>
                            </div>

                            <div className="flex h-[52px] items-center gap-2 rounded-[8px] bg-[#F4F5F2] px-3 py-2">
                                <span className="flex size-[26px] items-center justify-center rounded-full bg-[#D7E8DB] text-[11px] leading-[16.5px] font-semibold text-[#0F172A]">
                                    이
                                </span>
                                <div>
                                    <p className="text-[13px] leading-[19.5px] font-medium text-[#0F172A]">
                                        이지은
                                    </p>
                                    <p className="text-[11px] leading-[16.5px] text-[#94A3B8]">
                                        고1
                                    </p>
                                </div>
                            </div>

                            <div className="flex h-[52px] items-center gap-2 rounded-[8px] bg-[#F4F5F2] px-3 py-2">
                                <span className="flex size-[26px] items-center justify-center rounded-full bg-[#D7E8DB] text-[11px] leading-[16.5px] font-semibold text-[#0F172A]">
                                    박
                                </span>
                                <div>
                                    <p className="text-[13px] leading-[19.5px] font-medium text-[#0F172A]">
                                        박준호
                                    </p>
                                    <p className="text-[11px] leading-[16.5px] text-[#94A3B8]">
                                        고1
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <p className="mt-[22px] text-[11px] leading-[16.5px] text-[#CBD5E1]">
                        등록일시 2026-08-06
                    </p>
                </div>
            </article>

            {editModal.isModal && <EditLectureModal closeModal={editModal.closeModal} />}
            {deleteModal.isModal && (
                <div onClick={(event) => event.stopPropagation()}>
                    <TwoButtonModal
                        activeModal={deleteModal.activeModal}
                        closeModal={deleteModal.closeModal}
                        content="해당 강의를 삭제하시겠습니까?"
                        title="강의 삭제"
                    />
                </div>
            )}
        </div>
    );
}
