export default function WorkspaceAttends({ member }: {
    member: {
        name: string;
        role: string;
    }
}) {
    return (
        <label
            className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left hover:bg-[#F7F9F8]"
            key={member.name}
            onMouseDown={(event) => event.preventDefault()}
        >
            <input type='radio' name="memberId" value={member.name} />
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#D7E8DB] text-[10px] font-semibold tracking-[-0.2px] text-[#0F172A]">
                {member.name.slice(0, 2)}
            </span>
            <span>
                <strong className="block text-[13px] leading-[19.5px] font-medium text-[#0F172A]">
                    {member.name}
                </strong>
                <span className="block text-[11px] leading-[16.5px] text-[#64748B]">
                    {member.role}
                </span>
            </span>
        </label>
    )
}