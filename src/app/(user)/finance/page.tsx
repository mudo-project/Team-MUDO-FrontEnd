import {
  ChevronLeft,
  ChevronRight,
  Clock3,
  Ellipsis,
  Search,
  Send,
  ShieldCheck,
} from "lucide-react";

// 임시로 사용할 더미데이터 입니다. 추후 API 연동을 진행하면서 삭제할 예정입니다.
const payrollMembers = [
  { initials: "LM", name: "이민준", email: "lee@academy.kr", type: "정규직", base: "3,200,000", allowance: "+180,000", deduction: "-382,980", net: "2,997,020", status: "발송완료", sentAt: "08.05 10:00" },
  { initials: "PS", name: "박서연", email: "park@academy.kr", type: "정규직", base: "2,800,000", allowance: "-", deduction: "-335,320", net: "2,464,680", status: "발송완료", sentAt: "08.05 10:00" },
  { initials: "CH", name: "최현우", email: "choi@academy.kr", type: "정규직", base: "2,900,000", allowance: "+90,000", deduction: "-351,860", net: "2,638,140", status: "발송완료", sentAt: "08.05 10:00" },
  { initials: "JD", name: "정다운", email: "jung@academy.kr", type: "정규직", base: "2,400,000", allowance: "-", deduction: "-287,950", net: "2,112,050", status: "발송완료", sentAt: "08.05 10:00" },
  { initials: "KD", name: "강도현", email: "kang@academy.kr", type: "정규직", base: "2,600,000", allowance: "+60,000", deduction: "-313,406", net: "2,346,594", status: "미발송", sentAt: "-" },
  { initials: "YY", name: "윤예진", email: "yoon@academy.kr", type: "기간제", base: "-", allowance: "-", deduction: "-", net: "-", status: "미작성", sentAt: "-" },
  { initials: "LS", name: "임성훈", email: "이메일 미등록", type: "기간제", base: "-", allowance: "-", deduction: "-", net: "-", status: "미작성", sentAt: "-" },
] as const;

// 임시로 사용할 더미데이터 입니다. 추후 API 연동을 진행하면서 삭제할 예정입니다.
const statusClassNames = {
  발송완료: "bg-[#EEF4FA] text-[#334155]",
  미발송: "bg-[#F1F5F9] text-[#64748B]",
  미작성: "bg-[#FAF4E9] text-[#B78236]",
} as const;

function StatusBadge({ status }: { status: keyof typeof statusClassNames }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-1 text-[11px] font-semibold ${statusClassNames[status]}`}>
      {status === "발송완료" && <span className="mr-1 size-1.5 rounded-full bg-[#4D9560]" />}
      {status}
    </span>
  );
}

export default function FinancePage() {
  return (
    <main className="h-[calc(100dvh-3.25rem)] overflow-hidden bg-[#FCFCFC] px-5 py-5 text-[#172033] lg:px-6">
      <div className="h-full overflow-y-auto scrollbar-hide">
        <div className="mx-auto w-full max-w-[1360px] pb-8">
          <header className="flex items-start justify-between">
            <div>
              <h1 className="text-[22px] font-bold tracking-[-0.04em]">재무</h1>
              <nav 
                aria-label="재무 메뉴"
                className="mt-7 flex gap-8 border-b border-[#E1EBE3] text-[15px] font-semibold"
              >
                <button 
                  className="pb-3 text-[#94A3B8]" 
                  type="button"
                >
                  법인카드
                </button>
                <button 
                  className="border-b-2 border-[#4D9560] pb-3 text-[#172033]" 
                  type="button"
                >
                  급여명세서
                </button>
              </nav>
            </div>
            <p className="flex items-center gap-1 pt-1 text-[11px] text-[#94A3B8]">
              <ShieldCheck className="size-3.5" /> 민감정보 화면입니다. 화면 공유에 주의하세요
            </p>
          </header>

          <section 
            aria-label="급여명세서 발송 현황"
            className="mt-4 grid grid-cols-[repeat(4,minmax(0,1fr))_minmax(280px,1.65fr)] overflow-hidden rounded-xl border border-[#DCE9DF] bg-white px-6 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.02)]"
          >
            {[
              ["7명", "이달 급여 대상", "text-[#172033]"],
              ["4명", "발송 완료", "text-[#4D9560]"],
              ["3명", "미작성", "text-[#B78236]"],
              ["0명", "미발송", "text-[#718096]"],
            ].map(([value, label, color]) => (
              <div className="border-r border-[#E1EBE3] px-4 first:pl-0" key={label}>
                <strong className={`block text-[23px] leading-none ${color}`}>{value}</strong>
                <span className="mt-2 block text-[11px] text-[#718096]">{label}</span>
              </div>
            ))}
            <div className="flex items-center gap-2 pl-5">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#DFEADF]">
                <div className="h-full w-[57%] rounded-full bg-[#4D9560]" /></div>
                <span className="text-[11px] font-semibold text-[#4D9560]">57% 발송</span>
            </div>
          </section>

          <section className="mt-4 flex items-center justify-between" aria-label="급여명세서 기간 및 발송 설정">
            <div className="flex items-center gap-1.5">
              <button 
                aria-label="이전 달" 
                className="flex size-9 items-center justify-center rounded-lg border border-[#DCE9DF] bg-white text-[#718096]" 
                type="button"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button 
                className="h-9 rounded-lg border border-[#DCE9DF] bg-white px-4 text-[13px] font-semibold"
                type="button"
              >
                2026년 8월
              </button>
              <button 
                aria-label="다음 달"
                className="flex size-9 items-center justify-center rounded-lg border border-[#DCE9DF] bg-white text-[#718096]" 
                type="button"
              >
                <ChevronRight className="size-4" />
              </button>
              <button 
                className="ml-1 h-9 rounded-lg border border-[#DCE9DF] bg-white px-3 text-[12px] text-[#718096]"
                type="button"
              >
                이번 달
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button 
                className="flex h-9 items-center gap-1.5 rounded-lg border border-[#DCE9DF] bg-white px-3 text-[12px] text-[#718096]" 
                type="button"
              >
                <Clock3 className="size-3.5"/>
                자동 발송 설정
              </button>
              <button 
                className="flex h-9 items-center gap-1.5 rounded-lg bg-[#CBD2DC] px-4 text-[12px] font-semibold text-white"
                type="button"
              >
                <Send className="size-3.5"/>
                일괄 발송
              </button>
            </div>
          </section>

          <section 
            aria-label="2026년 8월 급여 요약"
            className="mt-4 grid grid-cols-4 overflow-hidden rounded-xl border border-[#DCE9DF] bg-white"
          >
            <div className="col-span-1 border-r border-[#E1EBE3] p-5">
              <span className="text-[11px] text-[#718096]">총 지급액</span>
              <strong className="mt-1 block text-[31px] leading-none tracking-[-0.05em]">15,327,724원</strong>
            </div>
            <div className="border-r border-[#E1EBE3] p-5">
              <span className="text-[11px] text-[#718096]">대상 인원</span>
              <strong className="mt-1 block text-[19px]">7명</strong>
              <p className="mt-1 text-[11px] text-[#94A3B8]">정규직 5 · 기간제 2</p>
            </div>
            <div className="border-r border-[#E1EBE3] p-5">
              <span className="text-[11px] text-[#718096]">작성 상태</span>
              <strong className="mt-1 block text-[19px]">5 / 7 작성</strong>
              <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-[#E9EEF1]">
                <div className="h-full w-[71%] rounded-full bg-[#172033]" />
              </div>
            </div>
            <div className="p-5">
              <span className="text-[11px] text-[#718096]">발송 상태</span>
              <strong className="mt-1 block text-[19px]">발송 4 · 미발송 3</strong>
            </div>
          </section>

          <section className="mt-4" aria-label="급여명세서 목록">
            <div className="flex items-center gap-2">
              <label className="flex h-9 w-[298px] items-center gap-2 rounded-lg border border-[#DCE9DF] bg-white px-3 text-[12px] text-[#94A3B8]">
                <Search className="size-3.5" />
                <span className="sr-only">이름 검색</span>
                <input 
                  className="w-full outline-none placeholder:text-[#94A3B8]"
                  placeholder="이름 검색"/>
              </label>
              {["전체", "정규직", "기간제"].map((item, index) => 
                <button 
                  className={`h-9 rounded-full border px-4 text-[12px] 
                  ${index === 0 
                  ?
                  "border-[#172033] bg-[#172033] text-white"
                  :
                  "border-[#DCE9DF] bg-white text-[#94A3B8]"
                  }
                `} 
                type="button"
                key={item}>
                  {item}
                </button>
              )}
              <span className="mx-1 h-4 border-l border-[#DCE9DF]" />
              {["전체", "미작성", "미발송", "발송완료", "발송실패"].map((item, index) => 
                <button 
                  className={`h-9 rounded-full border px-4 text-[12px] 
                  ${index === 0
                  ?
                  "border-[#172033] bg-[#172033] text-white"
                  :
                  "border-[#DCE9DF] bg-white text-[#94A3B8]"
                  }
                `} 
                type="button"
                key={item}
                >
                  {item}
                </button>
              )}
            </div>

            <div className="mt-4 overflow-hidden rounded-xl border border-[#DCE9DF] bg-white">
              <table aria-label="2026년 8월 급여명세서" className="w-full table-fixed text-left">
                <thead className="border-b border-[#E1EBE3] text-[11px] font-medium text-[#94A3B8]">
                  <tr>
                    <th className="w-[54px] px-5 py-4">
                      <input aria-label="전체 선택" type="checkbox" />
                    </th>
                    <th className="w-[220px]">이름</th>
                    <th>유형</th>
                    <th className="text-right">기본급</th>
                    <th className="text-right">수당</th>
                    <th className="text-right">공제</th>
                    <th className="text-right">차인지급액</th>
                    <th className="text-center">발송 상태</th>
                    <th className="text-center">발송일시</th>
                    <th className="w-[64px] text-center">액션</th>
                  </tr>
                </thead>
                <tbody className="text-[12px]">
                  {payrollMembers.map((member) => 
                    <tr className="h-[68px]" key={member.name}>
                      <td className="px-5"><input aria-label={`${member.name} 선택`} type="checkbox" /></td>
                      <td>
                        <div className="flex items-center gap-2">
                          <span className="flex size-7 items-center justify-center rounded-full bg-[#E5EEE7] text-[9px] font-bold text-[#46624F]">{member.initials}</span>
                          <span>
                            <strong className="block font-semibold">{member.name}</strong>
                            <small className="mt-0.5 block text-[10px] text-[#94A3B8]">{member.email}</small>
                          </span>
                        </div>
                      </td>
                      <td className="text-[#718096]">{member.type}</td>
                      <td className="text-right font-medium">{member.base}</td>
                      <td className="text-right font-medium">{member.allowance}</td>
                      <td className="text-right text-[#94A3B8]">{member.deduction}</td>
                      <td className="text-right font-bold">{member.net}</td>
                      <td className="text-center">
                        <StatusBadge status={member.status} />
                      </td>
                      <td className="text-center text-[#718096]">{member.sentAt}</td>
                      <td className="text-center">
                        {member.status === "미작성"
                        ?
                        <button className="font-semibold" type="button">작성</button>
                        :
                        <button 
                          aria-label={`${member.name} 더보기`}
                          className="rounded-lg border border-[#E1EBE3] p-1.5 text-[#94A3B8]"
                          type="button"
                        >
                          <Ellipsis className="size-3.5" />
                        </button>
                        }
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot className="border-t border-[#DCE9DF] bg-[#EEF1F5] text-[12px] font-bold">
                  <tr>
                    <td />
                    <td colSpan={2} className="py-4">합계 7명</td>
                    <td className="text-right">16,750,000</td>
                    <td className="text-right">+330,000</td>
                    <td className="text-right">-1,752,276</td>
                    <td className="text-right">15,327,724</td>
                    <td colSpan={3} />
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
