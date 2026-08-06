export default function WorkTemplateItem() {
    return (
        <article
            className="flex h-[68px] w-full items-center gap-1.5 rounded-[8px] border border-[#DEE3E9] bg-white px-2 sm:gap-2 sm:px-2.5 md:h-[72px] md:gap-3 md:rounded-[10px] md:px-3.5 lg:h-[76px] lg:gap-3.5 lg:px-[18px]"
        >
            <button
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] bg-[#F5F6F8] text-[10px] font-light text-[#A9B2BF] md:h-8 md:w-8 md:rounded-[7px] md:text-[13px] lg:h-9 lg:w-9 lg:rounded-[8px] lg:text-[16px]"
                aria-label={`수정`}
            >
                ⟋
            </button>

            <div>
                <h2 className="text-[10px] leading-[19.5px] font-semibold tracking-[-0.02em] md:text-[12px] lg:text-[13px]">업무 제목</h2>
                <div className="sm:gap-2 mt-0.5 flex  flex-col sm:flex-row sm:items-center text-[10px] leading-[16.5px] text-[#B4BCC7] lg:mt-1 lg:text-[11px]">
                    <div>
                        <span className="rounded-full bg-[#EDF5FF] px-1 py-px text-[#76A9DF] sm:px-1.5 lg:px-2">주기</span>
                    </div>
                    <span>마지막 생성: 날짜</span>
                </div>
            </div>

            <button className="ml-auto h-7 rounded-[7px] border border-[#DCE1E7] bg-white px-1 text-[10px] leading-[18px] font-medium text-[#515B6A] md:px-2 md:text-[11px] lg:h-8 lg:px-3 lg:text-[12px]">
                지금 생성
            </button>
            <button
                className="h-6 px-1 text-[10px] leading-[18px] font-light text-[#C5CBD4] lg:h-7 lg:px-2 lg:text-[12px]"
                aria-label={` 삭제`}
            >
                ×
            </button>
        </article>
    )
}