import {
    ChevronLeft,
    ChevronRight,
    Clock3,
    Pencil,
    Wifi,
} from "lucide-react";

// 임시로 사용할 더미데이터 입니다. 추후 API 연동을 진행하면서 삭제할 예정입니다.
const members = [
    ["KJ", "김지수", "출근 · 08:52", false],
    ["LM", "이민준", "출근 · 09:05", false],
    ["PS", "박서연", "연가", false],
    ["CH", "최현우", "출근 · 09:02", false],
    ["JD", "정다은", "출근 · 08:58", false],
    ["KD", "강도현", "미출근", true],
    ["YY", "윤예진", "출근 · 09:10", false],
    ["LS", "임성훈", "출근 · 09:00", false],
] as const;

// 임시로 사용할 더미데이터 입니다. 추후 API 연동을 진행하면서 삭제할 예정입니다.
const calendarDays = [
    ["26", "muted"], ["27", "muted"], ["28", "muted"], ["29", "muted"], ["30", "muted"], ["31", "muted"], ["1", "sat"],
    ["2", "sun"], ["3", "selected"], ["4", ""], ["5", ""], ["6", ""], ["7", ""], ["8", "sat"],
    ["9", "sun"], ["10", ""], ["11", ""], ["12", ""], ["13", ""], ["14", ""], ["15", "sat"],
    ["16", "sun"], ["17", ""], ["18", ""], ["19", ""], ["20", ""], ["21", ""], ["22", "sat"],
    ["23", "sun"], ["24", ""], ["25", ""], ["26", ""], ["27", ""], ["28", ""], ["29", "sat"],
    ["30", "sun"], ["31", ""], ["1", "muted"], ["2", "muted"], ["3", "muted"], ["4", "muted"], ["5", "muted"],
] as const;

// 임시로 사용할 더미데이터 입니다. 추후 API 연동을 진행하면서 삭제할 예정입니다.
const dayClassName: Record<string, string> = {
    muted: "text-[#718096]",
    sat: "text-[#4D9560]",
    selected: "bg-[#4D9560] font-bold text-white",
    sun: "text-[#B45252]",
};

function Card({ children, label }: { children: React.ReactNode; label: string }) {
    return <section 
                aria-label={label} 
                className="rounded-xl border border-[#DCE9DF] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.02)]"
            >
                {children}
            </section>;
}

export default function AttendancePage() {
    return (
        <main className="h-[calc(100dvh-3.25rem)] overflow-hidden bg-[#FCFCFC] px-5 py-6 text-[#172033] lg:px-6">
            <div className="h-full overflow-y-auto scrollbar-hide">
                <div className="mx-auto w-full max-w-[1360px]">
                <section 
                    aria-labelledby="team-attendance-title" 
                    className="rounded-xl border border-[#DCE9DF] bg-white px-5 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.02)]"
                >
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                        <div>
                            <h1 
                                id="team-attendance-title" 
                                className="text-[14px] font-bold"
                            >
                                오늘 팀 근태 현황
                            </h1>
                            <p className="mt-1 text-[10px] text-[#718096]">2026년 8월 3일 (월) · 정규 근무 09:00 ~ 18:00</p>
                        </div>
                        <div className="flex gap-5 text-right">
                            {[['6', '출근', 'text-[#4D9560]'], ['1', '연가', 'text-[#B4823D]'], ['1', '미출근', 'text-[#B45252]']].map(([count, label, color]) => 
                            <span key={label}>
                                <b className={`block text-[18px] ${color}`}>{count}</b>
                                <small className="text-[9px] text-[#718096]">{label}</small>
                            </span>
                            )}
                        </div>
                    </div>
                    <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
                        {members.map(([initials, name, status, absent]) => (
                            <div 
                                className="flex min-w-[108px] items-center gap-2 rounded-lg border border-[#E0E9E2] bg-[#FBFCFB] px-2.5 py-2" 
                                key={name}
                            >
                                <span 
                                    className={`relative flex size-6 items-center justify-center rounded-full text-[8px] font-bold 
                                        ${absent 
                                        ?
                                        "bg-[#E7F0E8] text-[#6B8B74]"
                                        :
                                        "bg-[#0F172A] text-white"
                                        }
                                    `}>
                                        {initials}
                                        <i 
                                            className={`absolute -bottom-0.5 -right-0.5 size-1.5 rounded-full ring-1 ring-white 
                                            ${absent 
                                            ?
                                            "bg-[#B45252]"
                                            :
                                            "bg-[#4D9560]"
                                            }
                                            `} 
                                        />
                                </span>
                                <span>
                                    <strong className="block text-[10px]">{name}</strong>
                                    <small className="block whitespace-nowrap text-[8px] text-[#718096]">{status}</small>
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mt-6">
                    <nav aria-label="근태 메뉴" className="flex gap-7 border-b border-[#DCE9DF] text-[12px]">
                        <button type="button" className="border-b-2 border-[#4D9560] px-1 pb-3 font-semibold">내 근태</button>
                        <button type="button" className="pb-3 text-[#718096]">전직원 현황</button>
                        <button type="button" className="pb-3 text-[#718096]">
                            수정 요청 관리 
                            <span className="ml-1 rounded-full bg-[#172033] px-1.5 py-0.5 text-[8px] text-white">3</span>
                        </button>
                    </nav>

                    <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_250px]">
                        <section aria-labelledby="calendar-title" className="min-w-0">
                            <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                                <div className="flex items-center gap-3">
                                    <button 
                                        aria-label="이전 달"
                                        type="button"
                                    >
                                        <ChevronLeft className="size-4 text-[#718096]" />
                                    </button>
                                    <h2 id="calendar-title" className="text-[17px] font-bold">2026년 8월</h2>
                                    <button 
                                        aria-label="다음 달" 
                                        type="button"
                                    >
                                        <ChevronRight className="size-4 text-[#718096]" />
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-x-2 gap-y-1 text-[9px] text-[#718096]">
                                    {['출근', '지각', '연가', '결근', '출근', '지각', '연가', '결근', '미기록'].map((label, index) => 
                                        <span 
                                            className="flex items-center gap-1"
                                            key={`${label}-${index}`}
                                        >
                                            <i className={`size-1 rounded-full 
                                                ${index % 4 === 0 
                                                ?
                                                'bg-[#0F172A]'
                                                :
                                                index % 4 === 1
                                                ?
                                                'bg-[#B78236]'
                                                :
                                                index % 4 === 2
                                                ?
                                                'bg-[#4D9560]'
                                                :
                                                'bg-[#B45252]'
                                                }
                                            `}/>
                                                {label}
                                            </span>
                                        )}
                                    </div>
                            </div>
                            <div className="overflow-hidden rounded-xl border border-[#DCE9DF] bg-white">
                                <div className="grid grid-cols-7 border-b border-[#DCE9DF] text-center text-[10px] font-medium text-[#64748B]">
                                    {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => 
                                        <span className={`py-2.5 
                                            ${index === 0
                                            ?
                                            'text-[#B45252]'
                                            :
                                            index === 6
                                            ?
                                            'text-[#4D9560]'
                                            :
                                            ''}
                                            `} 
                                            key={day}
                                        >
                                            {day}
                                        </span>
                                    )}
                                </div>
                                <div className="grid grid-cols-7">
                                    {calendarDays.map(([day, state], index) => 
                                        <div 
                                            className="relative min-h-[82px] border-b border-r border-[#E5EEE7] p-2 [&:nth-child(7n)]:border-r-0 [&:nth-last-child(-n+7)]:border-b-0 sm:min-h-[100px]" 
                                            key={`${day}-${index}`}
                                        >
                                            <span 
                                                className={`flex size-5 items-center justify-center rounded-full text-[10px] 
                                                ${dayClassName[state] ?? ''}`}
                                            >
                                                {day}
                                            </span>
                                            <i className="absolute right-2 top-3 size-1 rounded-full border border-[#DCE9DF]" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>

                        <aside className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1">
                            <Card label="근무 중 상태">
                                <p className="text-[10px] font-medium text-[#4D9560]">근무 중 05:52 경과</p>
                                <strong className="mt-4 block text-[28px] tracking-[-0.04em]">14:57:21</strong>
                                <p className="mt-1 text-[10px] text-[#718096]">2026년 8월 3일 (월)</p>
                                <p className="mt-4 flex items-center gap-1 text-[10px] text-[#718096]">
                                    <Clock3 className="size-3" />
                                    근무 09:00 ~ 18:00
                                </p>
                                <dl className="mt-4 space-y-2 text-[11px]">
                                    <div className="flex justify-between">
                                        <dt className="text-[#718096]">출근</dt>
                                        <dd>09:05</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-[#718096]">퇴근</dt>
                                        <dd>--:--</dd>
                                    </div>
                                </dl>
                                <button 
                                    type="button"
                                    className="mt-4 h-10 w-full rounded-md border border-[#172033] text-[11px] font-semibold"
                                >
                                    퇴근하기
                                </button>
                                <p className="mt-3 flex items-center gap-1 text-[9px] text-[#718096]">
                                    <Wifi className="size-3" />
                                    학원 와이파이 연결됨
                                </p>
                            </Card>
                            <Card label="잔여 연가">
                                <p className="text-[10px] font-semibold">잔여 연가</p>
                                <div className="mt-3 flex items-end justify-between">
                                    <strong className="text-[27px]">
                                        7
                                        <span className="ml-1 text-[12px]">일</span>
                                    </strong>
                                    <span className="text-[9px] text-[#718096]">총 12일 중 5일 사용</span>
                                </div>
                                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#E6EEE8]">
                                    <div className="h-full w-[58%] rounded-full bg-[#4D9560]" /></div>
                                    <p className="mt-2 text-[9px] text-[#718096]">2027.03.01 갱신 예정</p>
                                    <div className="mt-4 border-t border-[#E2EBE4] pt-3">
                                        <p className="text-[10px] text-[#718096]">근속일수</p>
                                        <strong className="mt-1 block text-[17px]">412일</strong>
                                        <p className="mt-1 text-[9px] text-[#718096]">입사일 2025.06.17</p>
                                    </div>
                                </Card>
                            <Card label="내 수정 요청">
                                <div className="flex items-center justify-between">
                                    <p className="text-[10px] font-semibold">내 수정 요청</p>
                                    <button type="button" className="text-[9px] text-[#718096]">전체 보기</button>
                                </div>
                                <p className="py-7 text-center text-[10px] text-[#718096]">처리할 요청이 없습니다</p>
                            </Card>
                        </aside>
                    </div>
                </section>
                </div>
            </div>
            <button 
                aria-label="수정 요청 작성"
                type="button"
                className="fixed bottom-6 right-6 flex size-12 items-center justify-center rounded-full bg-[#0F172A] text-white shadow-lg"
            >
                <Pencil className="size-5"/>
            </button>
        </main>
    );
}
