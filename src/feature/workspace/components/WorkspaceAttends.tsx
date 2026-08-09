interface WorkspaceAttendsProps {
    member: UserListResponse;
    onSelect: (member: UserListResponse) => void;
}

export default function WorkspaceAttends({
    member,
    onSelect,
}: WorkspaceAttendsProps) {
    return (
        <button
            className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left hover:bg-[#F7F9F8]"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => onSelect(member)}
            type="button"
        >
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#D7E8DB] text-[10px] font-semibold tracking-[-0.2px] text-[#0F172A]">
                {member.name.slice(0, 2)}
            </span>
            <span>
                <strong className="block text-[13px] leading-[19.5px] font-medium text-[#0F172A]">
                    {member.name}
                </strong>
                <span className="block text-[11px] leading-[16.5px] text-[#64748B]">
                    {member.username}
                </span>
            </span>
        </button>
    );
}
