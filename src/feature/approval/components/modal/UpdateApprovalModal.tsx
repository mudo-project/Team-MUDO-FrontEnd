import { ChevronDown, Paperclip, Plus, X } from "lucide-react";

const approvers = [
    { step: "1차", name: "이민준 (강사)" },
    { step: "2차", name: "김지수 (원장)" },
];

export default function UpdateApprovalModal() {
    return (
        <div className="fixed top-0 left-0 z-999 h-screen w-screen bg-[#162236]/30">
            <form className="fixed top-1/2 left-1/2 z-1000 flex max-h-[450px] md:max-h-[550px] w-[420px] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[12px] bg-white shadow-[0_8px_16px_rgba(22,34,54,0.16)]">
                <header className="flex h-[23px] shrink-0 items-center p-6 pb-0">
                    <h2 className="text-[15px] font-bold leading-[22.5px] text-[#0F172A]">
                        결재 수정
                    </h2>
                    <button
                        aria-label="결재 수정 모달 닫기"
                        className="ml-auto flex size-3.5 items-center justify-center text-[#C0C8D0]"
                        type="button"
                    >
                        <X className="size-3.5" strokeWidth={1.5} />
                    </button>
                </header>

                <div className="min-h-0 flex-1 overflow-y-auto p-6 pt-5">
                <div className="flex w-full flex-col gap-3.5">
                    <div className="w-full">
                        <p className="text-[12px] font-medium leading-[18px] text-[#6B7280]">
                            결재 라인{" "}
                            <span className="font-normal text-[#C0C8D0]">(수정 가능)</span>
                        </p>

                        <div className="flex w-full flex-col gap-1.5 pt-1.5">
                            {approvers.map((approver) => (
                                <div className="flex h-[30px] w-full items-center gap-2" key={approver.step}>
                                    <span className="w-7 text-[11px] font-normal leading-[16.5px] text-[#B0B8C1]">
                                        {approver.step}
                                    </span>
                                    <div className="relative flex h-[30px] w-full items-center rounded-[7px] border border-[#D7E8DB] bg-white">
                                        <select
                                            aria-label={`${approver.step} 결재자`}
                                            className="h-full w-full appearance-none bg-transparent px-3.5 pr-8 text-[12px] font-normal text-[#0F172A] focus:outline-none"
                                            defaultValue={approver.name}
                                            name={`approver-${approver.step}`}
                                        >
                                            <option value={approver.name}>{approver.name}</option>
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute right-2 size-3 text-[#0F172A]" strokeWidth={2} />
                                    </div>
                                    <button
                                        aria-label={`${approver.step} 결재자 삭제`}
                                        className="flex w-2.5 items-center justify-center text-[14px] font-normal leading-[21px] text-[#C0C8D0]"
                                        type="button"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}

                            <button
                                className="flex h-8 w-full items-center gap-1.5 rounded-[7px] border border-dashed border-[#D7E8DB] px-2.5 text-[12px] font-normal leading-[18px] text-[#B0B8C1]"
                                type="button"
                            >
                                <Plus className="size-3.5" strokeWidth={1.5} />
                                결재자 추가
                            </button>
                        </div>
                    </div>

                    <div className="w-full">
                        <label className="block pb-1.5 text-[12px] font-medium leading-[18px] text-[#6B7280]" htmlFor="update-approval-title">
                            제목
                        </label>
                        <input
                            className="h-[37px] w-full rounded-[8px] border border-[#D7E8DB] px-3 text-[13px] font-normal leading-[19.5px] text-[#0F172A] focus:outline-none"
                            defaultValue="0"
                            id="update-approval-title"
                            name="title"
                        />
                    </div>

                    <div className="w-full">
                        <label className="block pb-1.5 text-[12px] font-medium leading-[18px] text-[#6B7280]" htmlFor="update-approval-content">
                            내용
                        </label>
                        <textarea
                            className="block h-[96px] w-full resize-none rounded-[8px] border border-[#D7E8DB] px-3 py-2 text-[13px] font-normal leading-[19.5px] text-[#0F172A] placeholder:text-[#0F172A]/50 focus:outline-none"
                            id="update-approval-content"
                            name="content"
                            placeholder="결재 내용을 입력하세요"
                        />
                    </div>

                    <div className="w-full">
                        <label className="block text-[12px] font-medium leading-[18px] text-[#6B7280]">
                            첨부파일
                        </label>
                        <label className="mt-3 flex h-[34px] w-fit cursor-pointer items-center gap-1.5 rounded-[7px] border border-[#D7E8DB] bg-white px-3 text-[12px] font-normal leading-[18px] text-[#6B7280]">
                            <Paperclip className="size-3" strokeWidth={1.7} />
                            파일 첨부
                            <input className="hidden" name="attachment" type="file" />
                        </label>
                    </div>
                </div>
                </div>

                <footer className="shrink-0 p-6 pt-2">
                    <button className="h-10 w-full rounded-[8px] bg-[#0F172A] text-[13px] font-semibold leading-[19.5px] text-white" type="submit">
                        저장하기
                    </button>
                </footer>
            </form>
        </div>
    );
}
