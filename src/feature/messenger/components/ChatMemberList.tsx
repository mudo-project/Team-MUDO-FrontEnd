import { X } from "lucide-react";

// 임시로 사용할 더미데이터 입니다. 추후 API 연동을 진행하면서 삭제할 예정입니다.
const members = [
    { name: "김지수", role: "강사", initials: "김지" },
    { name: "이민준", role: "강사", initials: "이민" },
    { name: "박서연", role: "조교", initials: "박서" },
    { name: "정다은", role: "행정팀", initials: "정다" },
];

export default function ChatMemberList({ onClose }: { onClose: () => void }) {
    return (
        <aside className="absolute top-0 right-0 bottom-0 z-30 flex w-72 flex-col border-l border-[#D7E8DB] bg-white shadow-[-8px_0_18px_rgba(15,23,42,0.05)]">
            <div className="flex h-[51px] shrink-0 items-center justify-between border-b border-[#D7E8DB] px-4">
                <h2 className="text-[13px] font-semibold text-[#0F172A]">참여자 {members.length}명</h2>
                <button aria-label="참여자 목록 닫기" className="text-[#64748B]" onClick={onClose} type="button">
                    <X className="size-4" strokeWidth={1.7} />
                </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">
                {members.map((member) => (
                    <div className="flex items-center gap-2.5 px-4 py-2.5" key={member.name}>
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#E2ECE4] text-[9px] font-semibold text-[#285D3B]">
                            {member.initials}
                        </span>
                        <span className="min-w-0 flex-1">
                            <strong className="block truncate text-[12px] font-semibold text-[#0F172A]">{member.name}</strong>
                            <span className="block truncate text-[10px] text-[#94A3B8]">{member.role}</span>
                        </span>
                    </div>
                ))}
            </div>
        </aside>
    );
}
