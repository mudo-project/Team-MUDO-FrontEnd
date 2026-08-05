import { Plus } from "lucide-react";

const approvalTabs = [
    { label: "내가 신청한 결재", active: true },
    { label: "내게 온 결재", active: false },
    { label: "전체", active: false },
    { label: "템플릿 관리", active: false },
];

export default function Page() {
    return (
        <main className="min-h-[calc(100dvh-52px)] w-full bg-[#FCFCFC] px-8 py-7">
            <div className="flex h-[39px] w-full items-start border-b border-[#D7E8DB]">
                {approvalTabs.map((tab) => (
                    <button
                        className={`h-[39px] px-[18px] pb-[10px] pt-[9px] text-[13px] leading-[19.5px] ${
                            tab.active
                                ? "border-b-2 border-[#0F172A] font-semibold text-[#0F172A]"
                                : "font-normal text-[#64748B]"
                        }`}
                        key={tab.label}
                        type="button"
                    >
                        {tab.label}
                    </button>
                ))}

                <button
                    className="ml-auto flex items-center gap-1.5 rounded-[8px] bg-[#0F172A] px-3.5 py-1.5 text-[12px] font-medium leading-[18px] text-white"
                    type="button"
                >
                    <Plus className="size-3.5" strokeWidth={2} />
                    결재 상신
                </button>
            </div>

            <section className="mt-5 w-full rounded-[10px] border border-[#D7E8DB] bg-white py-[61px] text-center">
                <p className="text-[13px] font-normal leading-[19.5px] text-[#C0C8D0]">
                    결재 문서가 없습니다
                </p>
            </section>
        </main>
    );
}
