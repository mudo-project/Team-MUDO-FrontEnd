export default function ApprovalItem() {
    return (
        <div className="grid h-14 grid-cols-8 md:grid-cols-9 items-center border-b border-[#F7F8F9] px-1 sm:px-2 md:h-[62px] md:px-3 lg:h-[67px] lg:grid-cols-11 lg:px-5">
            <div className="col-span-4 lg:col-span-6">
                <p className="text-[10px] font-medium leading-[19.5px] text-[#0F172A] md:text-[12px] lg:text-[13px]">
                    2025년 1월 연가 신청
                </p>
                <p className="pt-0.5 text-[10px] font-normal leading-[16.5px] text-[#C0C8D0] lg:text-[11px]">
                    2025.01.15
                </p>
            </div>
            <p className="col-span-1 text-[10px] font-normal leading-[18px] text-[#6B7280] md:text-[11px] lg:text-[12px]">박서연</p>
            <p className="hidden md:block col-span-1 text-[10px] font-normal leading-[16.5px] text-[#64748B] lg:text-[11px]">연가 신청서</p>
            <p className="col-span-2 text-[10px] font-normal leading-[18px] text-[#2C8D50] md:text-[11px] lg:text-[12px]">2차 · 김지수</p>
            <div className="col-span-1">
                <span className="rounded-[20px] bg-[#DCFCE7] px-1 py-0.5 text-[10px] font-medium leading-[16.5px] text-[#2C8D50] md:px-1.5 lg:px-[9px] lg:text-[11px]">진행중</span>
            </div>
        </div>
    )
}
