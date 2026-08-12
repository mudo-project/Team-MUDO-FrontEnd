const statusClass = {
    진행중: "bg-[#EAF2FC] text-[#72A4D8]",
    대기: "bg-[#F0F1F3] text-[#3F4856]",
    지연: "bg-[#F0F1F3] text-[#3F4856]",
    완료: "bg-[#F0F1F3] text-[#596273]",
};


export default function MyWorkItem() {
    return (
        <div
            className="grid h-11 grid-cols-8 md:grid-cols-9 items-center border-b border-[#EEF0F3] px-2 text-[10px] leading-[18px] last:border-b-0 sm:px-3 md:h-[46px] md:px-4 md:text-[11px] lg:h-[47px] lg:px-5 lg:text-[12px]"
        >
            <p className="col-span-3 md:col-span-4 "><strong className="truncate pr-2 text-[10px] leading-[19.5px] font-medium md:pr-3 md:text-[12px] lg:pr-4 lg:text-[13px]">업무 제목</strong></p>
            <span className="col-span-2 text-[10px] leading-[16.5px] text-[#A7B0BD] lg:text-[11px]">워크스페이스</span>
            <span className="col-span-1 text-[#8F99A8]">작성자</span>
            <span className="col-span-1 text-[#98A2B1]">마감일</span>
            <div className="col-span-1 ">
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] leading-[16.5px] font-medium lg:px-2 lg:text-[11px] ${statusClass['진행중']}`}>
                    진행중
                </span>
            </div>
        </div>
    )
}
