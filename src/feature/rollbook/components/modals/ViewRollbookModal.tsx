"use client";

import useModal from "@/components/hooks/useModal";
import SendMessageModal from "@/feature/rollbook/components/modals/SendMessageModal";
import { Phone, X } from "lucide-react";

export default function ViewRollbookModal({ closeModal }: { closeModal: () => void }) {
    const sendMessageModal = useModal();

    return (
        <div className="fixed inset-0 z-999 bg-[#162236]/40" onClick={closeModal}>
            <form
                aria-labelledby="view-rollbook-modal-title"
                className="fixed top-1/2 left-1/2 z-1000 w-[720px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[12px] bg-white shadow-[0_12px_32px_rgba(15,23,42,0.18)]"
                onClick={(event) => event.stopPropagation()}
                role="dialog"
            >
                <header className="px-7 pt-[22px] pb-[18px]">
                    <div className="flex items-start">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="inline-flex h-[22px] items-center rounded-full bg-[#EAF1FA] px-2 text-[11px] leading-[16.5px] font-semibold text-[#1E40AF]">
                                    정규반
                                </span>
                                <h2
                                    id="view-rollbook-modal-title"
                                    className="text-[17px] leading-[25.5px] font-bold text-[#0F172A]"
                                >
                                    고1 수학 정규반
                                </h2>
                            </div>
                            <p className="mt-1 text-[12px] leading-[18px] text-[#64748B]">
                                김선생 · A101 · 고1 · 월 19:00~21:00
                            </p>
                        </div>
                        <button
                            aria-label="출결 조회 모달 닫기"
                            className="ml-auto text-[#94A3B8]"
                            onClick={closeModal}
                            type="button"
                        >
                            <X aria-hidden="true" className="size-[18px]" strokeWidth={1.5} />
                        </button>
                    </div>

                    <div className="mt-3.5 flex items-center gap-2">
                        <input
                            aria-label="출결 날짜"
                            className="h-[34px] w-[126px] rounded-[8px] border border-[#DCE8E2] bg-white px-3 text-[12px] text-[#0F172A] focus:outline-none"
                            type="date"
                        />
                        <button
                            className="ml-auto flex h-[34px] items-center gap-1.5 rounded-[8px] border border-[#DCE8E2] bg-white px-3 text-[13px] leading-[19.5px] font-medium text-[#0F172A]"
                            onClick={sendMessageModal.openModal}
                            type="button"
                        >
                            <Phone aria-hidden="true" className="size-[13px]" strokeWidth={1.5} />
                            출결 문자 발송
                        </button>
                        <button
                            className="h-[34px] rounded-[8px] bg-[#E2E8F0] px-4 text-[13px] leading-[19.5px] font-medium text-[#94A3B8]"
                            disabled
                            type="button"
                        >
                            저장
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-6 border-y border-[#DCE8E2]">
                    <div className="border-r border-[#DCE8E2] py-3 text-center">
                        <strong className="block text-[18px] leading-[27px] font-bold text-[#0F172A]">3</strong>
                        <span className="mt-0.5 block text-[11px] leading-[16.5px] text-[#94A3B8]">전체</span>
                    </div>
                    <div className="border-r border-[#DCE8E2] py-3 text-center">
                        <strong className="block text-[18px] leading-[27px] font-bold text-[#16A34A]">0</strong>
                        <span className="mt-0.5 block text-[11px] leading-[16.5px] text-[#94A3B8]">출석</span>
                    </div>
                    <div className="border-r border-[#DCE8E2] py-3 text-center">
                        <strong className="block text-[18px] leading-[27px] font-bold text-[#DC2626]">0</strong>
                        <span className="mt-0.5 block text-[11px] leading-[16.5px] text-[#94A3B8]">결석</span>
                    </div>
                    <div className="border-r border-[#DCE8E2] py-3 text-center">
                        <strong className="block text-[18px] leading-[27px] font-bold text-[#D97706]">0</strong>
                        <span className="mt-0.5 block text-[11px] leading-[16.5px] text-[#94A3B8]">지각</span>
                    </div>
                    <div className="border-r border-[#DCE8E2] py-3 text-center">
                        <strong className="block text-[18px] leading-[27px] font-bold text-[#2563EB]">0</strong>
                        <span className="mt-0.5 block text-[11px] leading-[16.5px] text-[#94A3B8]">온라인</span>
                    </div>
                    <div className="py-3 text-center">
                        <strong className="block text-[18px] leading-[27px] font-bold text-[#6B7280]">0</strong>
                        <span className="mt-0.5 block text-[11px] leading-[16.5px] text-[#94A3B8]">기타</span>
                    </div>
                </div>

                <div className="max-h-[228px] overflow-y-auto">
                    <div className="sticky top-0 z-10 grid h-9 grid-cols-12 items-center gap-3 border-b border-[#DCE8E2] bg-white px-6 text-[11px] leading-[16.5px] font-medium text-[#B0B8C1]">
                        <p className="col-span-3">학생</p>
                        <p className="col-span-1">학년</p>
                        <p className="col-span-4">출결 상태</p>
                        <p className="col-span-4">비고</p>
                    </div>

                    <div className="grid min-h-16 grid-cols-12 items-center gap-3 border-b border-[#F7F8F9] px-6 py-[13px]">
                        <div className="col-span-3">
                            <strong className="block text-[13px] leading-[19.5px] font-medium text-[#0F172A]">김민수</strong>
                            <span className="mt-px block text-[11px] leading-[16.5px] text-[#94A3B8]">010-3333-4444</span>
                        </div>
                        <p className="col-span-1 text-[12px] leading-[18px] text-[#64748B]">고1</p>
                        <select
                            aria-label="김민수 출결 상태"
                            className="col-span-4 h-8 w-full rounded-[7px] border border-[#DCE8E2] bg-white px-3 text-[12px] text-[#0F172A] focus:outline-none"
                            defaultValue=""
                        >
                            <option value="">미입력</option>
                            <option value="present">출석</option>
                            <option value="absent">결석</option>
                            <option value="late">지각</option>
                            <option value="online">온라인</option>
                            <option value="other">기타</option>
                        </select>
                        <input
                            aria-label="김민수 비고"
                            className="col-span-4 h-8 w-full rounded-[7px] border border-[#DCE8E2] px-2.5 text-[12px] text-[#0F172A] placeholder:text-[#0F172A]/50 focus:outline-none"
                            placeholder="비고 입력"
                        />
                    </div>

                    <div className="grid min-h-16 grid-cols-12 items-center gap-3 border-b border-[#F7F8F9] px-6 py-[13px]">
                        <div className="col-span-3">
                            <strong className="block text-[13px] leading-[19.5px] font-medium text-[#0F172A]">이지은</strong>
                            <span className="mt-px block text-[11px] leading-[16.5px] text-[#94A3B8]">010-5555-6666</span>
                        </div>
                        <p className="col-span-1 text-[12px] leading-[18px] text-[#64748B]">고1</p>
                        <select
                            aria-label="이지은 출결 상태"
                            className="col-span-4 h-8 w-full rounded-[7px] border border-[#DCE8E2] bg-white px-3 text-[12px] text-[#0F172A] focus:outline-none"
                            defaultValue=""
                        >
                            <option value="">미입력</option>
                            <option value="present">출석</option>
                            <option value="absent">결석</option>
                            <option value="late">지각</option>
                            <option value="online">온라인</option>
                            <option value="other">기타</option>
                        </select>
                        <input
                            aria-label="이지은 비고"
                            className="col-span-4 h-8 w-full rounded-[7px] border border-[#DCE8E2] px-2.5 text-[12px] text-[#0F172A] placeholder:text-[#0F172A]/50 focus:outline-none"
                            placeholder="비고 입력"
                        />
                    </div>

                    <div className="grid min-h-16 grid-cols-12 items-center gap-3 px-6 py-[13px]">
                        <div className="col-span-3">
                            <strong className="block text-[13px] leading-[19.5px] font-medium text-[#0F172A]">박준호</strong>
                            <span className="mt-px block text-[11px] leading-[16.5px] text-[#94A3B8]">010-7777-8888</span>
                        </div>
                        <p className="col-span-1 text-[12px] leading-[18px] text-[#64748B]">고1</p>
                        <select
                            aria-label="박준호 출결 상태"
                            className="col-span-4 h-8 w-full rounded-[7px] border border-[#DCE8E2] bg-white px-3 text-[12px] text-[#0F172A] focus:outline-none"
                            defaultValue=""
                        >
                            <option value="">미입력</option>
                            <option value="present">출석</option>
                            <option value="absent">결석</option>
                            <option value="late">지각</option>
                            <option value="online">온라인</option>
                            <option value="other">기타</option>
                        </select>
                        <input
                            aria-label="박준호 비고"
                            className="col-span-4 h-8 w-full rounded-[7px] border border-[#DCE8E2] px-2.5 text-[12px] text-[#0F172A] placeholder:text-[#0F172A]/50 focus:outline-none"
                            placeholder="비고 입력"
                        />
                    </div>
                </div>
            </form>
            {sendMessageModal.isModal && (
                <SendMessageModal closeModal={sendMessageModal.closeModal} />
            )}
        </div>
    );
}
