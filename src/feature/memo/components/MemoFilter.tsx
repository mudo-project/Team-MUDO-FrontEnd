export default function MemoFilter() {
    return (
        <div className="flex h-9 shrink-0 items-center justify-between border-b border-[#E6EBE7] px-3">
          <div className="flex overflow-hidden rounded-md border border-[#E0E6E1] text-[10px]">
            <button className="bg-[#172033] px-2.5 py-1 font-medium text-white" type="button">최신순</button>
            <button className="border-l border-[#E0E6E1] px-2.5 py-1 text-[#718096]" type="button">오래된순</button>
          </div>
        </div>
    )
}
