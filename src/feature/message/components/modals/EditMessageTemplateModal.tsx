import { X } from "lucide-react";

export default function EditMessageTemplateModal({
    closeModal,
    content,
    name,
}: {
    closeModal: () => void;
    content: string;
    name: string;
}) {
    return (
        <div className="fixed top-0 left-0 z-999 flex h-screen w-screen items-center justify-center bg-[#0F172A]/55" onClick={closeModal}>
            <form className="z-1000 w-[640px] overflow-hidden rounded-[20px] bg-white shadow-[0_32px_40px_rgba(0,0,0,0.20)]" onClick={(event) => event.stopPropagation()}>
                <header className="flex items-center border-b border-[#F1F5F9] px-7 pt-6 pb-5">
                    <div>
                        <h2 className="text-[17px] leading-[25.5px] font-bold text-[#0F172A]">
                            템플릿 수정
                        </h2>
                        <p className="pt-0.5 text-[12px] leading-[18px] text-[#94A3B8]">
                            템플릿 이름과 문자 내용을 수정할 수 있습니다.
                        </p>
                    </div>
                    <button
                        aria-label="템플릿 수정 모달 닫기"
                        className="ml-auto flex size-8 items-center justify-center rounded-[9px] bg-[#F8FAFC] text-[#94A3B8]"
                        onClick={closeModal}
                        type="button"
                    >
                        <X aria-hidden="true" className="size-4" strokeWidth={1.5} />
                    </button>
                </header>

                <div className="px-7 py-6">
                    <div className="flex gap-3">
                        <label className="w-full text-[12px] leading-[18px] font-medium text-[#64748B]">
                            템플릿 이름 <span aria-hidden="true">*</span>
                            <input
                                className="mt-1.5 h-10 w-full rounded-[9px] border border-[#E2E8F0] bg-white px-3 text-[13px] text-[#0F172A] outline-none placeholder:text-[#0F172A]/50"
                                defaultValue={name}
                                name="name"
                                placeholder="예: 결석 안내"
                                type="text"
                            />
                        </label>
                    </div>

                    <label className="mt-5 block text-[12px] leading-[18px] font-medium text-[#64748B]">
                        <span className="flex items-center">
                            내용 <span aria-hidden="true">*</span>
                            <span className="ml-auto text-[11px] leading-[16.5px] font-normal text-[#94A3B8]">
                                0자
                            </span>
                        </span>
                        <textarea
                            className="mt-1.5 h-[131px] w-full resize-none rounded-[9px] border border-[#E2E8F0] bg-white px-3 py-2.5 text-[13px] leading-[22px] text-[#0F172A] outline-none placeholder:text-[#0F172A]/50"
                            defaultValue={content}
                            name="content"
                            placeholder="예: 학생이 오늘 결석했습니다."
                        />
                    </label>
                </div>

                <footer className="flex justify-end gap-2 border-t border-[#F1F5F9] px-7 py-4">
                    <button
                        className="h-9 rounded-[9px] border border-[#E2E8F0] bg-white px-4 text-[13px] leading-[19.5px] text-[#64748B]"
                        onClick={closeModal}
                        type="button"
                    >
                        취소
                    </button>
                    <button
                        className="h-9 rounded-[9px] bg-[#1E293B] px-[22px] text-[13px] leading-[19.5px] font-semibold text-white"
                        type="button"
                    >
                        저장
                    </button>
                </footer>
            </form>
        </div>
    );
}
