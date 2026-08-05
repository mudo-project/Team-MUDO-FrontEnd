import {
    CheckCircle2,
    CheckSquare,
    MessageSquarePlus,
    Plus,
    Search,
    Send,
    UserRoundPlus,
} from "lucide-react";

// 임시로 사용할 더미데이터 입니다. 추후 API 연동을 진행하면서 삭제할 예정입니다.
const conversations = [
    { name: "전체 공지", preview: "설 연휴 근무 일정 공지합니다.", time: "오전 10:23", unread: 2, initials: "전체", active: true },
    { name: "수학팀", preview: "이민준: 내일 수업 자료 공유해요", time: "어제", initials: "수학" },
    { name: "박서연", preview: "연간 처리 됐나요?", time: "어제", unread: 1, initials: "박서" },
    { name: "행정팀", preview: "정다은: 청구서 발송 완료했습니다", time: "월요일", initials: "행정" },
    { name: "강도현", preview: "알겠습니다!", time: "월요일", initials: "강도" },
];

// 임시로 사용할 더미데이터 입니다. 추후 API 연동을 진행하면서 삭제할 예정입니다.
const messages = [
    { sender: "김지수", time: "오전 9:00", initials: "김지", text: "안녕하세요! 이번 주 토요일은 설 연휴 전 마지막 수업일입니다. 모든 강사분들 수업 준비 잘 부탁드립니다." },
    { sender: "이민준", time: "오전 9:15", initials: "이민", text: "네, 알겠습니다. 수업 준비 완료했습니다." },
    { sender: "김지수", time: "오전 10:23", initials: "김지", text: "설 연휴 근무 일정 공지합니다. 1/27(월) ~ 1/29(수) 휴원, 1/30(목)부터 정상 운영입니다." },
    { sender: "박서연", time: "오전 10:30", initials: "박서", text: "알겠습니다, 바로 진행하겠습니다!" },
];

// 임시로 사용할 채팅 아바타입니다. 추후 API 연동을 진행하면서 삭제할 예정입니다.
function Avatar({ initials }: { initials: string }) {
    return (
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#E2ECE4] text-[8px] font-semibold text-[#285D3B]">
            {initials}
        </span>
    );
}

export default function MessengetPage() {
    return (
        <main className="flex h-[calc(100dvh-3.25rem)] min-h-0 min-w-0 overflow-hidden bg-[#FCFCFC] text-[#0F172A]">
            <section 
                className="flex min-h-0 w-[282px] shrink-0 flex-col border-r border-[#D7E8DB] bg-white" 
                aria-label="대화 목록"
            >
                <div className="flex h-11 shrink-0 border-b border-[#D7E8DB]">
                    <button 
                        className="flex-1 border-b-2 border-[#2C8D50] text-[13px] font-semibold text-[#0F172A]" 
                        type="button"
                    >
                        채팅
                    </button>
                    <button 
                        className="flex-1 text-[13px] text-[#64748B]" 
                        type="button"
                    >
                        업무
                    </button>
                    <button 
                        className="flex w-11 items-center justify-center text-[#64748B]" 
                        type="button" 
                        aria-label="새 대화 만들기"
                    >
                        <MessageSquarePlus className="size-4" strokeWidth={1.7} />
                    </button>
                </div>

                <div className="flex h-8 shrink-0 items-center gap-3 border-b border-[#E7EFE9] px-3 text-[10px] text-[#64748B]">
                    <span>
                        <strong className="mr-1 text-[#0F172A]">5</strong>
                        대화방
                    </span>
                    <span>
                        <strong className="mr-1 text-[#2C8D50]">3</strong>
                        안읽음
                    </span>
                    <span>
                        <strong className="mr-1 text-[#0F172A]">3</strong>
                        그룹
                    </span>
                    <span>
                        <strong className="mr-1 text-[#0F172A]">2</strong>
                        DM
                    </span>
                </div>

                <div className="shrink-0 border-b border-[#E7EFE9] p-3">
                    <label className="flex h-8 w-full min-w-44 items-center rounded-md border border-[#DCE8DE] bg-white px-3">
                        <Search className="h-3.5 w-3.5 text-[#718096]" strokeWidth={1.8} />
                        <input
                            id="conversation-search"
                            aria-label="채팅방 검색"
                            className="min-w-0 flex-1 border-0 bg-transparent pl-2 text-[11px] outline-none placeholder:text-[#94A3B8]"
                            placeholder="채팅방 검색"
                        />
                    </label>
                </div>

                <nav className="min-h-0 flex-1 overflow-y-auto" aria-label="채팅방">
                    {conversations.map((conversation) => (
                        <button
                            className=
                                {
                                `flex w-full items-center gap-2.5 px-3 py-3 text-left 
                                ${conversation.active 
                                ?
                                "bg-[#EEF3F0]"
                                :
                                "bg-white hover:bg-[#F7F9F7]"
                                }
                                `
                            }
                            key={conversation.name}
                            type="button"
                        >
                            <Avatar initials={conversation.initials} />
                            <span className="min-w-0 flex-1">
                                <span className="flex items-center justify-between gap-2">
                                    <strong className="truncate text-[12px] font-semibold text-[#0F172A]">{conversation.name}</strong>
                                    <span className="shrink-0 text-[9px] text-[#64748B]">{conversation.time}</span>
                                </span>
                                <span className="mt-1 flex items-center gap-2">
                                    <span className="truncate text-[10px] text-[#64748B]">{conversation.preview}</span>
                                    {conversation.unread
                                    ?
                                    <span className="ml-auto flex size-4 shrink-0 items-center justify-center rounded-full bg-[#2C8D50] text-[8px] font-semibold text-white">
                                        {conversation.unread}
                                    </span>
                                    :
                                    null
                                    }
                                </span>
                            </span>
                        </button>
                    ))}
                </nav>
            </section>

            <section className="flex min-h-0 min-w-0 flex-1 flex-col bg-[#FCFCFC]" aria-label="전체 공지 대화">
                <header className="flex h-[51px] shrink-0 items-center border-b border-[#D7E8DB] bg-white px-6">
                    <h1 className="text-[16px] font-bold tracking-[-0.02em]">전체 공지</h1>
                    <span className="ml-2 text-[10px] text-[#64748B]">참여자 8명</span>
                    <div className="ml-auto flex items-center gap-3 text-[#64748B]">
                        <button 
                            type="button"
                            aria-label="대화 검색"
                        >
                            <Search className="size-4" strokeWidth={1.7} />
                        </button>
                        <button 
                            type="button"
                            aria-label="참여자 관리"
                        >
                            <UserRoundPlus className="size-4" strokeWidth={1.7} />
                        </button>
                    </div>
                </header>

                <div className="min-h-0 flex-1 overflow-y-auto px-10 py-4">
                    <div className="mx-auto flex w-full max-w-[754px] flex-col gap-3">
                        {messages.slice(0, 3).map((message) => (
                            <article 
                                className="flex max-w-[620px] items-end gap-2"
                                key={`${message.sender}-${message.time}`}
                            >
                                <Avatar initials={message.initials} />
                                <div>
                                    <p className="mb-1 text-[9px] text-[#64748B]">{message.sender}</p>
                                    <div className="rounded-[11px] bg-[#E9EDF1] px-3 py-2 text-[11px] leading-[1.5] text-[#1E293B]">{message.text}</div>
                                    <p className="mt-1 text-[9px] text-[#64748B]">{message.time}</p>
                                </div>
                            </article>
                        ))}

                        <article className="ml-auto mt-5 w-full max-w-[320px] rounded-[10px] border border-[#2C8D50] bg-white p-3">
                            <div className="flex items-center justify-between text-[9px] text-[#64748B]">
                                <span className="flex items-center gap-1 text-[#2C8D50]">
                                    <CheckSquare className="size-3" /> 
                                    업무지시
                                </span>
                                <span>
                                    김지수 · 07/15 10:25
                                </span>
                            </div>
                            <p className="mt-2 text-[11px] leading-5">금요일 보강 교실 변경 안내 메시지를 원생 전체에 발송해주세요.</p>
                            <div className="mt-2 flex justify-between text-[9px] text-[#64748B]">
                                <span>확인 1/2</span>
                                <span>담당자 2명</span>
                            </div>
                        </article>

                        <article className="mt-3 flex max-w-[620px] items-end gap-2">
                            <Avatar initials={messages[3].initials} />
                            <div>
                                <p className="mb-1 text-[9px] text-[#64748B]">{messages[3].sender}</p>
                                <div className="rounded-[11px] bg-[#E9EDF1] px-3 py-2 text-[11px] text-[#1E293B]">{messages[3].text}</div>
                                <p className="mt-1 text-[9px] text-[#64748B]">{messages[3].time}</p>
                            </div>
                        </article>

                        {["이민준", "박서연"].map((name, index) => (
                            <article 
                                className="ml-auto w-full max-w-[378px] rounded-[9px] border border-[#528466] bg-white p-3" 
                                key={name}
                            >
                                <div className="flex items-center gap-1.5 text-[10px] text-[#64748B]">
                                    <CheckCircle2 className="size-4 fill-[#528466] text-white" />
                                    <strong className="text-[#0F172A]">{name}</strong>님이 업무를 완료했습니다 
                                    <span className="ml-auto text-[9px]">
                                        오후 {index ? "1:12" : "11:45"}
                                    </span>
                                </div>
                                <p className="mt-2 rounded bg-[#F7F9F7] px-2 py-1.5 text-[9px] text-[#64748B]">금요일 보강 교실 변경 안내 메시지를 원생 전체에 발송해주세요.</p>
                                <div className="mt-2 flex items-center gap-2">
                                    <span className="h-[3px] flex-1 rounded bg-[#E7ECE8]">
                                        <span 
                                            className="block h-full rounded bg-[#2C8D50]"
                                            style={{ width: index ? "100%" : "50%" }} />
                                        </span>
                                    <span className="text-[9px] text-[#2C8D50]">
                                    {index ? "2/2 완료 · 전원 완료!" : "1/2 완료"}
                                    </span>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>

                <form className="flex h-[70px] shrink-0 items-center gap-3 border-t border-[#D7E8DB] bg-white px-6">
                    <button 
                        type="button" 
                        className="text-[#64748B]"  
                        aria-label="첨부 추가"
                    >
                        <Plus className="size-4" strokeWidth={1.7} />
                    </button>
                    <label 
                        className="sr-only" 
                        htmlFor="message"
                    >
                        메시지 입력
                    </label>
                    <input 
                        id="message"
                        className="h-11 min-w-0 flex-1 rounded-[7px] border border-[#D7E8DB] bg-white px-3 text-[11px] outline-none placeholder:text-[#94A3B8]" 
                        placeholder="메시지를 입력하세요" 
                    />
                    <button 
                        type="submit"
                        className="flex size-9 items-center justify-center text-[#64748B]"
                        aria-label="메시지 전송"
                    >
                        <Send className="size-4" strokeWidth={1.7} />
                    </button>
                </form>
            </section>
        </main>
    );
}
