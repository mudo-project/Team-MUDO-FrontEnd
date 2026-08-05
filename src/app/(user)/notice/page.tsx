import { Paperclip, Plus, Search } from "lucide-react";

// 임시로 사용할 더미데이터 입니다. 추후 API 연동을 진행하면서 삭제할 예정입니다.
const notices = [
    { title: "8월 급여 지급일 안내", category: "인사", author: "김지수", date: "08.01", important: true, attachment: true },
    { title: "2학기 개강 준비 및 교사 회의 일정 안내", category: "업무", author: "김지수", date: "07.30", important: true, attachment: true },
    { title: "강의실 에어컨 정기 점검 안내 (8/7)", category: "시설", author: "정다은", date: "08.03" },
    { title: "하반기 강사 모집 공고", category: "업무", author: "김지수", date: "07.25", attachment: true },
    { title: "8월 전체 회의 일정 변경 안내", category: "업무", author: "정다은", date: "07.22" },
    { title: "원생 개인정보 보호 지침 준수 안내", category: "인사", author: "김지수", date: "07.18", attachment: true },
];

// 임시로 사용할 더미데이터 입니다. 추후 API 연동을 진행하면서 삭제할 예정입니다.
const summaryItems = [
    { value: "6", label: "전체 공지", className: "text-[#0F172A]" },
    { value: "2", label: "인원은 공지", className: "text-[#4D9560]" },
    { value: "2", label: "고정 공지", className: "text-[#B4823D]" },
];

export default function NoticePage() {
    return (
        <main className="mx-auto w-full max-w-[930px] px-5 py-6">
            <section 
                aria-label="공지 요약" 
                className="flex min-h-[58px] items-center rounded-xl border border-[#DCE9DF] bg-white px-5 shadow-[0_1px_2px_rgba(15,23,42,0.02)]"
            >
                <div className="flex items-center divide-x divide-[#DCE9DF]">
                    {summaryItems.map((item) => (
                        <div 
                            className="flex items-baseline gap-1 px-5 first:pl-0" 
                            key={item.label}
                        >
                            <strong className={`text-xl font-bold ${item.className}`}>{item.value}</strong>
                            <span className="text-[11px] text-[#64748B]">{item.label}</span>
                        </div>
                    ))}
                </div>
                <div className="ml-6 flex items-center gap-2 text-[11px]">
                    <span className="rounded-full bg-[#EEF7F0] px-2.5 py-1 text-[#558563]">인사 2건 <b className="ml-1 rounded-full bg-[#568C63] px-1.5 py-0.5 text-[9px] text-white">1</b></span>
                    <span className="rounded-full bg-[#FFF7E9] px-2.5 py-1 text-[#B4823D]">시설 1건</span>
                    <span className="rounded-full bg-[#ECF8EF] px-2.5 py-1 text-[#4D9560]">업무 3건 <b className="ml-1 rounded-full bg-[#568C63] px-1.5 py-0.5 text-[9px] text-white">1</b></span>
                </div>
            </section>

            <section aria-label="공지 목록" className="mt-4">
                <div className="mb-3 flex items-center justify-between gap-4">
                    <div 
                        className="flex items-center gap-1.5" 
                        role="group" 
                        aria-label="공지 분류"
                    >
                        <button 
                            className="rounded-full bg-[#12182B] px-3 py-1.5 text-[11px] font-semibold text-white" 
                            type="button"
                        >
                            전체
                        </button>
                        {['인사', '시설', '업무'].map((category) => (
                            <button 
                                className="rounded-full border border-[#DCE9DF] bg-white px-3 py-1.5 text-[11px] text-[#64748B]" 
                                key={category} 
                                type="button"
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        <form>
                            <label className="flex h-8 w-[175px] items-center rounded-lg border border-[#DCE9DF] bg-white px-3">
                                <Search className="h-3.5 w-3.5 shrink-0 text-[#94A3B8]" strokeWidth={1.8} />
                                <input 
                                    aria-label="공지 검색" 
                                    className="min-w-0 flex-1 border-0 bg-transparent pl-2 text-[11px] outline-none placeholder:text-[#94A3B8]" 
                                    id="notice-search" 
                                    placeholder="검색" 
                                    type="search" 
                                />
                            </label>
                        </form>
                        <button 
                            className="flex h-8 items-center gap-1.5 rounded-md bg-[#12182B] px-3.5 text-[11px] font-semibold text-white" 
                            type="button"
                        >
                            <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
                            공지 작성
                        </button>
                    </div>
                </div>

                <ul className="overflow-hidden rounded-xl border border-[#DCE9DF] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.02)]">
                    {notices.map((notice) => (
                        <li 
                            className="grid min-h-[52px] grid-cols-[minmax(0,1fr)_68px_50px] items-center gap-3 border-b border-[#E5EEE7] px-6 last:border-b-0" 
                            key={notice.title}
                        >
                            <div className="flex min-w-0 items-center gap-3">
                                {notice.important 
                                ? 
                                <span aria-label="중요 공지" className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#4D9560]" /> 
                                : 
                                <span className="w-1.5 shrink-0" />
                                }
                                {notice.important && 
                                    <span className="rounded-md bg-[#12182B] px-1.5 py-1 text-[9px] font-semibold text-white">중요</span>
                                }
                                <span 
                                    className={`min-w-0 text-[13px] 
                                        ${notice.important 
                                        ?
                                        "font-semibold text-[#172033]"
                                        :
                                        "text-[#64748B]"
                                        }
                                    `}>
                                        {notice.title}
                                </span>
                                {notice.attachment && <Paperclip className="ml-auto h-3.5 w-3.5 shrink-0 text-[#64748B]" strokeWidth={1.6} />}
                            </div>
                            <span className="text-[11px] text-[#64748B]">{notice.author}</span>
                            <time className="text-right text-[11px] text-[#64748B]">{notice.date}</time>
                        </li>
                    ))}
                </ul>
            </section>
        </main>
    );
}
