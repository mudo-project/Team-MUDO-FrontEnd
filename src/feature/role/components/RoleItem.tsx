export default function RoleItem() {
    return (
        <button
            className={`flex h-11 w-full items-center gap-2.5 rounded-[8px] border-l-[2px] px-3 border-transparent bg-transparent`}
            type="button"
        >
            <span className={`size-2.5 rounded-full`} />
            <span className={`text-[14px] leading-[21px] text-[#0F172A] font-normal`}>
                role.name
            </span>
            <span className="ml-auto text-[12px] font-normal leading-[18px] text-[#64748B]">
                role.count명
            </span>
        </button>
    )
}