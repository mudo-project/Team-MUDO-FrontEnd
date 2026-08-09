export default function WorkspaceAttendItem({ member, removeMember }: { member: UserListResponse, removeMember: (userId: number) => void }) {
    return (
        <span
            className="flex h-[26px] items-center gap-1.5 rounded-full bg-[#0F172A] px-2.5 text-[12px] leading-[18px] text-white"
            key={member.userId}
        >
            {member.name}
            <input name="memberIds" type="hidden" value={member.userId} />
            <button
                aria-label={`${member.name} 참여자 제거`}
                className="text-[14px] leading-[14px] text-[#94A3B8]"
                onClick={() => removeMember(member.userId)}
                type="button"
            >
                ×
            </button>
        </span>
    )
}