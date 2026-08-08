// 임시로 사용할 타입입니다. 추후 API 연동을 진행하면서 삭제할 예정입니다.
export type ScheduleEvent = {
  id: number;
  date: Date;
  title: string;
  detail: string;
  color: string;
  background: string;
  // 광복절/급여지급일/개학식/방학종료처럼 캘린더 칸에 색 배경 박스(pill)로 강조 표시되는 일정인지 여부.
  // 실제로는 "종일 일정" 등 명확한 기준이 정해지면 그 값으로 대체될 임시 플래그입니다.
  emphasis?: boolean;
};

// 임시로 사용할 더미데이터 입니다. 추후 API 연동을 진행하면서 삭제할 예정입니다.
export const scheduleEvents: ScheduleEvent[] = [
  { id: 1, date: new Date(2026, 7, 3), title: "2학기 수업 준비 회의", detail: "8월 3일 (월) · 오전 10:00 - 오전 11:30", color: "#4D9560", background: "#EAF3EC" },
  { id: 2, date: new Date(2026, 7, 3), title: "원생 출석 점검", detail: "8월 3일 (월) · 오전 9:00 - 오전 9:30", color: "#D7A83D", background: "#FFF7E7" },
  { id: 3, date: new Date(2026, 7, 10), title: "월간 수납 현황 보고", detail: "8월 10일 (월) · 오후 2:00 - 오후 3:00", color: "#74675F", background: "#F1EEEE" },
  { id: 4, date: new Date(2026, 7, 15), title: "광복절", detail: "8월 15일 (토) · 종일", color: "#B45252", background: "#F9EBE8", emphasis: true },
  { id: 5, date: new Date(2026, 7, 17), title: "전체 교직원 회의", detail: "8월 17일 (월) · 오전 9:00 - 오전 10:00", color: "#172033", background: "#E9EBEF" },
  { id: 6, date: new Date(2026, 7, 18), title: "수학A반 모의고사", detail: "8월 18일 (화) · 오후 2:00 - 오후 4:00", color: "#4D9560", background: "#EAF3EC" },
  { id: 7, date: new Date(2026, 7, 18), title: "영어B반 단어시험", detail: "8월 18일 (화) · 오전 10:00 - 오전 11:00", color: "#D7A83D", background: "#FFF7E7" },
  { id: 8, date: new Date(2026, 7, 20), title: "학부모 상담 주간 시작", detail: "8월 20일 (목) · 오후 1:00 - 오후 6:00", color: "#9A67B6", background: "#F3EAF8" },
  { id: 9, date: new Date(2026, 7, 20), title: "직원 워크샵", detail: "8월 20일 (목) · 오전 9:00 - 오후 5:00", color: "#5B8C6B", background: "#EAF3EC" },
  { id: 10, date: new Date(2026, 7, 20), title: "과학D반 실험수업", detail: "8월 20일 (목) · 오후 3:00 - 오후 5:00", color: "#56A8A8", background: "#E7F5F5" },
  { id: 11, date: new Date(2026, 7, 20), title: "국어C반 논술특강", detail: "8월 20일 (목) · 오후 7:00 - 오후 9:00", color: "#D67F35", background: "#FFF1E6" },
  { id: 12, date: new Date(2026, 7, 21), title: "신규 강사 오리엔테이션", detail: "8월 21일 (금) · 오전 9:00 - 오후 12:00", color: "#DB4B98", background: "#FCEAF4" },
  { id: 13, date: new Date(2026, 7, 25), title: "급여 지급일", detail: "8월 25일 (화) · 종일", color: "#5B8C6B", background: "#EAF3EC", emphasis: true },
  { id: 14, date: new Date(2026, 7, 25), title: "개학식", detail: "8월 25일 (화) · 오전 10:00 - 오전 11:00", color: "#172033", background: "#E9EBEF", emphasis: true },
  { id: 15, date: new Date(2026, 7, 31), title: "방학 종료", detail: "8월 31일 (월) · 종일", color: "#B45252", background: "#F9EBE8", emphasis: true },
];
