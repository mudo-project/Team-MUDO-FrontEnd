export default function MessageVariable() {
    return (
        <article className="border md:mt-4 rounded-[10px] border-[#E2E8F0] bg-white w-full mt-5">
            <div className="grid grid-cols-5 h-9 items-center border-b border-[#E2E8F0] px-1 text-[10px] font-medium leading-[16.5px] text-[#B0B8C1] sm:px-2 md:h-[37px] md:px-3 md:text-[11px] ">
                <div className="col-span-2">변수</div>
                <div className="col-span-3">값</div>
            </div>
            <div className="grid grid-cols-5 h-9 items-center border-b border-[#E2E8F0] px-1 text-[10px] font-medium leading-[16.5px] text-[#B0B8C1] sm:px-2 md:h-[37px] md:px-3 md:text-[11px] ">
                <div className="col-span-2">{`{학생명}`} 또는 {`{studentName}`}</div>
                <div className="col-span-3">결석/지각 등 대상 학생의 이름</div>
            </div>
            <div className="grid grid-cols-5 h-9 items-center border-b border-[#E2E8F0] px-1 text-[10px] font-medium leading-[16.5px] text-[#B0B8C1] sm:px-2 md:h-[37px] md:px-3 md:text-[11px] ">
                <div className="col-span-2">{`{강의명}`} 또는 {`{lectureName}`}</div>
                <div className="col-span-3">대상 학생이 속한 강의명</div>
            </div>
            <div className="grid grid-cols-5 h-9 items-center border-b border-[#E2E8F0] px-1 text-[10px] font-medium leading-[16.5px] text-[#B0B8C1] sm:px-2 md:h-[37px] md:px-3 md:text-[11px] ">
                <div className="col-span-2">{`{날짜}`} 또는 {`{date}`}</div>
                <div className="col-span-3">발송 기준일 (2000-00-00 형식)</div>
            </div>
        </article>
    )
}