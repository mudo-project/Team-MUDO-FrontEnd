import { EllipsisVertical } from "lucide-react";

// 임시로 사용할 더미데이터 입니다. 추후 API 연동을 진행하면서 삭제할 예정입니다.
type Memo = {
  id: number;
  title: string;
  content: string[];
  time: string;
  accent: string;
  background: string;
};

const memos: Memo[] = [
  {
    id: 1,
    title: "9월 시간표 초안",
    content: ["수학A반 월·수·목", "영어B반 화·목 5시", "과학D반 토 오전"],
    time: "08.04",
    accent: "#6F9B7B",
    background: "#EDF4EE",
  },
  {
    id: 2,
    title: "8월 강사 회의 준비",
    content: ["- PPT 슬라이드 최종 확인", "- 참석자 명단 출력", "- 음료·다과 주문 (8/16 마감)"],
    time: "08.03",
    accent: "#B29A57",
    background: "#F7F2E2",
  },
  {
    id: 3,
    title: "비품 구매 요청",
    content: ["화이트보드 마커 × 20", "지우개 × 5", "출석부 × 3", "→ 정다운 행정팀 전달"],
    time: "08.02",
    accent: "#B7837C",
    background: "#F8EEEE",
  },
  {
    id: 4,
    title: "수강생 오리엔테이션 체크리스트",
    content: ["입학 안내문 발송 완료", "교재 배부 8/17", "반 배정표 게시판 부착 필요"],
    time: "07.31",
    accent: "#7890B8",
    background: "#EEF2FA",
  },
  {
    id: 5,
    title: "개인 메모",
    content: ["김도현 강사 면담 일정 잡기 (8월 중)", "박선연 연구 복귀 확인"],
    time: "07.29",
    accent: "#8977AE",
    background: "#F2EFF8",
  },
];

export default function MemoCard() {
    return (
        <div className="grid grid-cols-1 content-start gap-2 overflow-y-auto p-3 sm:grid-cols-2">
          {memos.map((memo) => (
            <article 
              className="relative min-h-[130px] rounded-md px-3 pb-3 pt-2.5"
              key={memo.id}
              style={{ backgroundColor: memo.background, borderTop: `2px solid ${memo.accent}` }}
            >
              <button aria-label={`${memo.title} 더보기`} className="absolute right-2 top-2 text-[#53606E]" type="button">
                <EllipsisVertical className="size-3.5" strokeWidth={1.8} />
              </button>
              <h2 className="pr-5 text-[12px] font-bold leading-5 tracking-[-0.02em]">{memo.title}</h2>
              <div className="mt-1.5 space-y-0.5 text-[10px] leading-4 text-[#425466]">
                {memo.content.map((line) => <p key={line}>{line}</p>)}
              </div>
              <time className="absolute bottom-3 left-3 text-[9px] text-[#718096]">{memo.time}</time>
            </article>
          ))}
        </div>
    )
}
