const statusStyle = {
    출근: "bg-[#EAF5EE] text-[#246B40]",
    연차: "bg-[#ECFDF3] text-[#22A559] ring-1 ring-inset ring-[#B7E9C8]",
    미출근: "bg-[#F1F3F5] text-[#9AA2AE]",
    비활성: "bg-[#F1F3F5] text-[#9AA2AE]",
};

export default function MemberItem({ member }: { member: null }) {
    return (
        <div
            className="grid h-16 grid-cols-5 sm:grid-cols-7 items-center border-t border-[#D7E8DB] px-5 text-[12px] text-[#64748B]"
        >
            <div className="col-span-3 flex min-w-0 items-center gap-3">
                <span className={`hidden md:block flex size-7 shrink-0 items-center justify-center rounded-full text-[8px] font-semibold`}>
                    member.initials
                </span>
                <span className="min-w-0">
                    <strong className="block truncate text-[13px] font-semibold leading-[18px] text-[#0F172A]">member.name</strong>
                    <span className="block truncate text-[10px] leading-[15px] text-[#94A3B8]">member.email</span>
                </span>
            </div>
            <span className="col-span-1">member.role</span>
            <span className="col-span-1">member.phone</span>
            <span className="col-span-1 hidden sm:block">member.joinedAt</span>
            <span className="col-span-1 hidden sm:block">
                <span className={`inline-flex min-h-5 items-center rounded-full px-2 text-[10px] font-semibold ${statusStyle['출근']}`}>
                    member.status
                </span>
            </span>
        </div>
    )
}