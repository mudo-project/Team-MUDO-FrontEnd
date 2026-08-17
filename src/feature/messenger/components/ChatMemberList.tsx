import { X } from "lucide-react";
import { getInitials } from "../utils";

export default function ChatMemberList({ members, onClose }: { members: MessengerRoomMemberData[]; onClose: () => void }) {
    return (
        <aside className="absolute top-0 right-0 bottom-0 z-30 flex w-72 max-w-[85vw] flex-col border-l border-[#D7E8DB] bg-white shadow-[-8px_0_18px_rgba(15,23,42,0.05)]">
            <div className="flex h-[51px] shrink-0 items-center justify-between border-b border-[#D7E8DB] px-4">
                <h2 className="text-[13px] font-semibold text-[#0F172A]">참여자 {members.length}명</h2>
                <button aria-label="참여자 목록 닫기" className="text-[#64748B]" onClick={onClose} type="button">
                    <X className="size-4" strokeWidth={1.7} />
                </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">
                {members.map((member) => (
                    <div className="flex items-center gap-2.5 px-4 py-2.5" key={member.userId}>
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#E2ECE4] text-[9px] font-semibold text-[#285D3B]">
                            {getInitials(member.name)}
                        </span>
                        <span className="min-w-0 flex-1">
                            <strong className="block truncate text-[12px] font-semibold text-[#0F172A]">{member.name}</strong>
                        </span>
                    </div>
                ))}
            </div>
        </aside>
    );
}
