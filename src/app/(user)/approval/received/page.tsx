import { Plus } from "lucide-react";

const approvalTabs = [
    { label: "내가 신청한 결재", active: false },
    { label: "내게 온 결재", active: true },
    { label: "전체", active: false },
    { label: "템플릿 관리", active: false },
];

const tableColumns = ["문서 제목", "기안자", "유형", "현재 결재자", "상태"];

export default function Page() {
    return (
        <main className="min-h-[calc(100dvh-52px)] w-full bg-[#FCFCFC] px-8 py-7">
            <div className="flex h-[39px] w-full items-center border-b border-[#D7E8DB]">
                {approvalTabs.map((tab) => (
                    <button
                        className={`h-[39px] px-[18px] pb-[10px] pt-[9px] text-[13px] leading-[19.5px] ${tab.active
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
                    className="ml-auto mb-2 flex items-center gap-1.5 rounded-[8px] bg-[#0F172A] px-3.5 py-1.5 text-[12px] font-medium leading-[18px] text-white"
                    type="button"
                >
                    <Plus className="size-3.5" strokeWidth={2} />
                    결재 상신
                </button>
            </div>

            <section className="mt-5 w-full overflow-hidden rounded-[10px] border border-[#D7E8DB] bg-white">
                <div className="grid h-[37px] grid-cols-[minmax(0,1fr)_80px_90px_160px_80px] items-center border-b border-[#D7E8DB] px-5 text-[11px] font-medium leading-[16.5px] text-[#B0B8C1]">
                    {tableColumns.map((column) => (
                        <p key={column}>{column}</p>
                    ))}
                </div>

                <div className="grid h-[67px] grid-cols-[minmax(0,1fr)_80px_90px_160px_80px] items-center border-b border-[#F7F8F9] px-5">
                    <div>
                        <p className="text-[13px] font-medium leading-[19.5px] text-[#0F172A]">
                            2025년 1월 연가 신청
                        </p>
                        <p className="pt-0.5 text-[11px] font-normal leading-[16.5px] text-[#C0C8D0]">
                            2025.01.15
                        </p>
                    </div>
                    <p className="text-[12px] font-normal leading-[18px] text-[#6B7280]">박서연</p>
                    <p className="text-[11px] font-normal leading-[16.5px] text-[#64748B]">연가 신청서</p>
                    <p className="text-[12px] font-normal leading-[18px] text-[#2C8D50]">2차 · 김지수</p>
                    <span className="w-full rounded-[20px] bg-[#DCFCE7] px-[9px] py-0.5 text-[11px] font-medium leading-[16.5px] text-[#2C8D50]">
                        진행중
                    </span>
                </div>
            </section>
        </main>
    );
}
