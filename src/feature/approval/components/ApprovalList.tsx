import ApprovalItem from "./ApprovalItem";

export default function ApprovalList() {
    return (
        <section className="mt-3 w-full overflow-hidden border md:mt-4 rounded-[10px] border-[#D7E8DB] bg-white lg:mt-5">
            <div className="grid h-9 grid-cols-8 md:grid-cols-9 items-center border-b border-[#D7E8DB] px-1 text-[10px] font-medium leading-[16.5px] text-[#B0B8C1] sm:px-2 md:h-[37px] md:px-3 md:text-[11px] lg:grid-cols-11 lg:px-5">
                <p className="col-span-4 lg:col-span-6">문서 제목</p>
                <p className="col-span-1">기안자</p>
                <p className="hidden md:block col-span-1">유형</p>
                <p className="col-span-2">현재 결재자</p>
                <p className="col-span-1">상태</p>
            </div>

            <ApprovalItem />
        </section>
    )
}
