import { X } from "lucide-react";

export default function TwoButtonModal({ title, content, closeModal, activeModal }: { title: string, content: string, closeModal: () => void, activeModal: () => void }) {
    return (
        <div onClick={closeModal} className="fixed top-0 left-0 z-1001 flex h-screen w-screen items-center justify-center bg-[#162236]/30">
            <section
                onClick={(e) => e.stopPropagation()}
                className="w-[420px] rounded-[12px] bg-white p-6 shadow-[0_8px_16px_rgba(22,34,54,0.16)]">
                <div className="flex w-full items-center">
                    <h2 className="text-[15px] leading-[22.5px] font-bold text-[#1D2B3A]">
                        {title}
                    </h2>
                    <button
                        aria-label="템플릿 삭제 모달 닫기"
                        className="ml-auto flex size-3.5 items-center justify-center text-[#C0C8D0]"
                        type="button"
                        onClick={closeModal}
                    >
                        <X className="size-3.5" strokeWidth={1.5} />
                    </button>
                </div>

                <div className="pt-5">
                    <p className="rounded-[8px] px-3.5 py-3 text-[13px] leading-[19.5px] font-normal text-[#0F172A]">
                        {content}
                    </p>

                    <div className="mt-4 flex gap-2">
                        <button
                            className="h-11 w-full rounded-[8px] border border-[#D7E8DB] bg-white text-[13px] leading-[19.5px] font-normal text-[#6B7280]"
                            type="button"
                            onClick={closeModal}
                        >
                            취소
                        </button>
                        <button
                            className="h-11 w-full rounded-[8px] bg-[#0F172A] text-[13px] leading-[19.5px] font-semibold text-white"
                            type="button"
                            onClick={activeModal}
                        >
                            확인
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
