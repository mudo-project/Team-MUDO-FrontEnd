import { Paperclip } from "lucide-react";

// 임시로 사용할 더미데이터 입니다. 추후 API 연동을 진행하면서 삭제할 예정입니다.
const notices = [
    { title: "8월 급여 지급일 안내", category: "인사", author: "김지수", date: "08.01", important: true, attachment: true },
    { title: "2학기 개강 준비 및 교사 회의 일정 안내", category: "업무", author: "김지수", date: "07.30", important: true, attachment: true },
    { title: "강의실 에어컨 정기 점검 안내 (8/7)", category: "시설", author: "정다은", date: "08.03" },
    { title: "하반기 강사 모집 공고", category: "업무", author: "김지수", date: "07.25", attachment: true },
    { title: "8월 전체 회의 일정 변경 안내", category: "업무", author: "정다은", date: "07.22" },
    { title: "원생 개인정보 보호 지침 준수 안내", category: "인사", author: "김지수", date: "07.18", attachment: true },
];

export default function NoticeList() {
    return (
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
    );
}
