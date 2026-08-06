const approvalLine = ["이민준", "김지수"];


export default function TemplateItem() {
    return (
        <div
            className="grid h-11 grid-cols-9 items-center border-b border-[#F7F8F9] px-1 last:border-b-0 sm:px-2 md:h-[47px] md:px-3 lg:h-[49px] lg:grid-cols-11 lg:px-5"
        >
            <p className="col-span-4 text-[10px] font-medium leading-[19.5px] text-[#0F172A] md:text-[12px] lg:col-span-6 lg:text-[13px]">
                연가 신청서
            </p>
            <p className="col-span-1 text-[10px] font-normal leading-[18px] text-[#64748B] md:text-[11px] lg:text-[12px]">
                정다은
            </p>
            <div className="col-span-3 flex items-center gap-0.5 md:gap-1">
                {approvalLine.map((approver, index) => (
                    <div className="flex items-center gap-0.5 md:gap-1" key={approver}>
                        <span className="rounded-[20px] bg-[#FCFCFC] px-1 py-0.5 text-[10px] font-normal leading-[16.5px] text-[#0F172A] md:px-1.5 lg:px-2 lg:text-[11px]">
                            {approver}
                        </span>
                        {index !== (approvalLine.length - 1) && <span className="text-[10px] font-normal leading-[15px] text-[#D0D5DC]">
                            →
                        </span>}
                    </div>
                ))}
            </div>
            <p className="col-span-1 text-[10px] font-normal leading-[18px] text-[#B0B8C1] md:text-[11px] lg:text-[12px]">
                2025.01.02
            </p>
        </div>
    )
}
