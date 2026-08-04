const tasks = [
  { title: "1월 원생 청구서 발송", workspace: "1월 학사 운영", author: "정다운", dueDate: "01.17", status: "진행중" },
  { title: "2월 시간표 초안 작성", workspace: "1월 학사 운영", author: "김지수", dueDate: "01.20", status: "대기" },
  { title: "성적 데이터 1월분 엑셀 정리", workspace: "1월 학사 운영", author: "윤예진", dueDate: "01.15", status: "지연" },
  { title: "강의실 환경 점검 체크리스트 작성", workspace: "1월 학사 운영", author: "정다운", dueDate: "01.18", status: "완료" },
  { title: "온보딩 자료 패키지 준비", workspace: "신규 강사 온보딩", author: "김지수", dueDate: "01.19", status: "진행중" },
  { title: "오리엔테이션 일정 확정", workspace: "신규 강사 온보딩", author: "박서연", dueDate: "01.16", status: "완료" },
  { title: "시스템 계정 발급 요청", workspace: "신규 강사 온보딩", author: "김지수", dueDate: "01.22", status: "대기" },
];

const statusClass = {
  진행중: "bg-[#EAF2FC] text-[#72A4D8]",
  대기: "bg-[#F0F1F3] text-[#3F4856]",
  지연: "bg-[#F0F1F3] text-[#3F4856]",
  완료: "bg-[#F0F1F3] text-[#596273]",
};

export default function Page() {
  return (
    <main className="min-h-screen w-full bg-[#FCFDFE] text-[#202A3C]">
      <header className="border-b border-[#E4E8ED] px-6 pt-5 pb-4">
        <h1 className="text-[15px] font-bold tracking-[-0.02em]">내 업무 모아보기</h1>

        <div className="mt-4 flex items-center gap-3">
          <label className="flex h-[30px] w-[192px] items-center rounded-[7px] border border-[#DCE1E7] bg-[#F7F8FA] px-3">
            <svg
              className="h-3.5 w-3.5 shrink-0 text-[#1F293B]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>
            <input
              className="ml-2 w-full bg-transparent text-[12px] text-[#202A3C] placeholder:text-[#9EA7B4] focus:outline-none"
              placeholder="업무 제목 검색"
              aria-label="업무 제목 검색"
            />
          </label>

          <select
            className="h-[30px] w-[101px] rounded-[7px] border border-[#DCE1E7] bg-white px-3 text-[12px] focus:outline-none"
            defaultValue="all"
            aria-label="상태 필터"
          >
            <option value="all">상태: 전체</option>
            <option value="waiting">상태: 대기</option>
            <option value="progress">상태: 진행중</option>
            <option value="done">상태: 완료</option>
          </select>

          <select
            className="h-[30px] w-[147px] rounded-[7px] border border-[#DCE1E7] bg-white px-3 text-[12px] focus:outline-none"
            defaultValue="all"
            aria-label="워크스페이스 필터"
          >
            <option value="all">워크스페이스: 전체</option>
            <option value="school">8월 학사 운영</option>
            <option value="onboarding">신규 강사 온보딩</option>
          </select>

          <span className="text-[12px] text-[#B3BBC6]">7건</span>
        </div>
      </header>

      <section className="px-6 py-5">
        <div className="w-full overflow-hidden rounded-[9px] border border-[#DDE2E8] bg-white">
          <div className="grid h-9 grid-cols-[minmax(0,1fr)_128px_68px_78px_90px] items-center border-b border-[#EBEEF2] px-5 text-[11px] text-[#A8B0BC]">
            <span>업무 제목</span>
            <span>워크스페이스</span>
            <span>등록자</span>
            <span>기한</span>
            <span>상태</span>
          </div>

          {tasks.map((task) => (
            <div
              className="grid h-[46px] grid-cols-[minmax(0,1fr)_128px_68px_78px_90px] items-center border-b border-[#EEF0F3] px-5 text-[12px] last:border-b-0"
              key={task.title}
            >
              <strong className="truncate pr-4 text-[13px] font-medium">{task.title}</strong>
              <span className="text-[#A7B0BD]">{task.workspace}</span>
              <span className="text-[#8F99A8]">{task.author}</span>
              <span className="text-[#98A2B1]">{task.dueDate}</span>
              <span className={`rounded-full px-3 py-1 text-[11px] leading-none ${statusClass[task.status as keyof typeof statusClass]}`}>
                {task.status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
