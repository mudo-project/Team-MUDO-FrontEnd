import { Plus, Upload, X } from "lucide-react";

export default function CreateApprovalTemplateModal() {
    return (
        <div className="fixed top-0 left-0 z-999 h-screen w-screen bg-[#162236]/35">
            <form className="fixed top-1/2 left-1/2 z-1000 h-[395px] w-[560px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[14px] bg-white p-7 shadow-[0_8px_40px_rgba(22,34,54,0.18)]">
                <div className="flex h-[27px] w-full items-center">
                    <h2 className="text-[18px] font-bold leading-[27px] text-[#0F172A]">
                        결재 템플릿 생성
                    </h2>
                    <button
                        aria-label="결재 템플릿 생성 모달 닫기"
                        className="ml-auto flex size-[22px] items-center justify-center text-[#C0C8D0]"
                        type="button"
                    >
                        <X className="size-3.5" strokeWidth={1.5} />
                    </button>
                </div>

                <div className="mt-4 w-full">
                    <label
                        className="block pb-1.5 text-[12px] font-medium leading-[18px] text-[#6B7280]"
                        htmlFor="approval-template-name"
                    >
                        템플릿 이름 <span className="text-[#C0483F]">*</span>
                    </label>
                    <input
                        className="h-[37px] w-full rounded-[8px] border border-[#D7E8DB] px-3 text-[13px] font-normal text-[#0F172A] placeholder:text-[#0F172A]/50 focus:outline-none"
                        id="approval-template-name"
                        name="templateName"
                        placeholder="예: 휴가 신청서"
                    />
                </div>

                <div className="mt-4 w-full">
                    <p className="text-[12px] font-medium leading-[18px] text-[#6B7280]">
                        결재 라인 <span className="text-[#C0483F]">*</span>
                    </p>
                    <button
                        className="mt-1.5 flex h-8 w-full items-center gap-1.5 rounded-[7px] border border-dashed border-[#D7E8DB] px-2.5 text-[12px] font-normal leading-[18px] text-[#B0B8C1]"
                        type="button"
                    >
                        <Plus className="size-3.5" strokeWidth={1.5} />
                        결재자 추가
                    </button>
                </div>

                <div className="mt-4 w-full">
                    <p className="text-[12px] font-medium leading-[18px] text-[#6B7280]">
                        양식 파일 첨부
                    </p>
                    <label className="mt-2 flex h-[50px] w-full cursor-pointer items-center gap-2.5 rounded-[8px] border border-dashed border-[#D7E8DB] bg-[#FAFBFC] px-4">
                        <Upload className="size-[18px] shrink-0 text-[#64748B]" strokeWidth={1.5} />
                        <span>
                            <strong className="block text-[12px] font-medium leading-[18px] text-[#0F172A]">
                                파일 끌어다 놓기 또는 클릭해 선택
                            </strong>
                            <span className="block text-[11px] font-normal leading-[16.5px] text-[#64748B]">
                                PDF, DOCX, XLSX · 개당 최대 50MB
                            </span>
                        </span>
                        <input
                            accept=".pdf,.docx,.xlsx"
                            className="hidden"
                            name="templateFile"
                            type="file"
                        />
                    </label>
                </div>

                <button
                    className="mt-4 h-10 w-full rounded-[8px] bg-[#0F172A] text-[13px] font-semibold leading-[19.5px] text-white opacity-40"
                    type="submit"
                >
                    템플릿 저장
                </button>
            </form>
        </div>
    );
}
