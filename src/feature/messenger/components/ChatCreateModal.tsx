import { Search, X } from "lucide-react";

// 임시로 사용할 더미데이터 입니다. 추후 API 연동을 진행하면서 삭제할 예정입니다.
const members = [
    { name: "김지수", role: "강사", initials: "김지", selected: true },
    { name: "이민준", role: "강사", initials: "이민" },
    { name: "박서연", role: "조교", initials: "박서" },
    { name: "정다은", role: "행정팀", initials: "정다" },
];

export default function ChatCreateModal() {
    return (
        <div className="fixed top-0 left-0 z-999 h-screen w-screen bg-[#162236]/45">
            <form className="fixed top-1/2 left-1/2 z-1000 w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-[12px] bg-white p-6 shadow-[0_8px_12px_rgba(22,34,54,0.12)]">
                <div className="flex h-[27px] w-full items-center">
                    <h2 className="text-[18px] font-bold leading-[27px] text-[#0F172A]">새 채팅</h2>
                    <button
                        aria-label="새 채팅 모달 닫기"
                        className="ml-auto flex size-[18px] items-center justify-center text-[#64748B]"
                        type="button"
                    >
                        <X className="size-[18px]" strokeWidth={1.5} />
                    </button>
                </div>

                <label className="mt-5 flex h-11 w-full items-center rounded-[8px] border border-[#D7E8DB] px-3">
                    <Search className="size-4 text-[#94A3B8]" strokeWidth={1.8} />
                    <input
                        aria-label="소속 인원 검색"
                        className="min-w-0 flex-1 border-0 bg-transparent pl-2 text-[13px] outline-none placeholder:text-[#94A3B8]"
                        placeholder="이름으로 검색"
                    />
                </label>

                <div className="mt-3 max-h-52 w-full overflow-y-auto rounded-[8px] border border-[#D7E8DB]">
                    {members.map((member) => (
                        <button
                            className={`flex w-full items-center gap-3 px-3 py-2.5 text-left ${member.selected ? "bg-[#EEF3F0]" : "bg-white hover:bg-[#F7F9F7]"}`}
                            key={member.name}
                            type="button"
                        >
                            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#E2ECE4] text-[10px] font-semibold text-[#285D3B]">
                                {member.initials}
                            </span>
                            <span className="min-w-0 flex-1">
                                <strong className="block truncate text-[13px] font-semibold text-[#0F172A]">{member.name}</strong>
                                <span className="block truncate text-[11px] text-[#94A3B8]">{member.role}</span>
                            </span>
                            {member.selected && (
                                <span className="shrink-0 text-[11px] font-semibold text-[#2C8D50]">선택됨</span>
                            )}
                        </button>
                    ))}
                </div>

                <div className="mt-5 w-full">
                    <label
                        className="block pb-1.5 text-[13px] font-medium leading-[19.5px] text-[#0F172A]"
                        htmlFor="chat-room-title"
                    >
                        채팅방 제목
                    </label>
                    <input
                        className="h-11 w-full rounded-[8px] border border-[#D7E8DB] px-3 text-[14px] font-normal text-[#0F172A] placeholder:text-[#0F172A]/50 focus:outline-none"
                        id="chat-room-title"
                        name="title"
                        placeholder="예: 수학팀, 8월 신규 강사"
                    />
                </div>

                <div className="mt-5 flex w-full justify-end gap-2">
                    <button
                        className="h-11 rounded-[8px] border border-[#D7E8DB] bg-white px-5 text-[14px] font-normal leading-[21px] text-[#0F172A]"
                        type="button"
                    >
                        취소
                    </button>
                    <button
                        className="h-11 rounded-[8px] bg-[#172033] px-5 text-[14px] font-semibold leading-[21px] text-white"
                        type="submit"
                    >
                        만들기
                    </button>
                </div>
            </form>
        </div>
    );
}
