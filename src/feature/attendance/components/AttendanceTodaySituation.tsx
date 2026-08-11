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

export default function AttendanceTodaySituation() {
  return (
    <section
      aria-labelledby="team-attendance-title"
      className="rounded-xl border border-[#DCE9DF] bg-white px-5 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.02)]"
    >
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h1 id="team-attendance-title" className="text-[14px] font-bold">
            오늘 팀 근태 현황
          </h1>
          <p className="mt-1 text-[10px] text-[#718096]">2026년 8월 3일 (월) · 정규 근무 09:00 ~ 18:00</p>
        </div>
        <div className="flex gap-5 text-right">
          {[["6", "출근", "text-[#4D9560]"], ["1", "연가", "text-[#B4823D]"], ["1", "미출근", "text-[#B45252]"]].map(
            ([count, label, color]) => (
              <span key={label}>
                <b className={`block text-[18px] ${color}`}>{count}</b>
                <small className="text-[9px] text-[#718096]">{label}</small>
              </span>
            ),
          )}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
        {members.map(([initials, name, status, absent]) => (
          <div className="flex min-w-[108px] items-center gap-2 rounded-lg border border-[#E0E9E2] bg-[#FBFCFB] px-2.5 py-2" key={name}>
            <span
              className={`relative flex size-6 items-center justify-center rounded-full text-[8px] font-bold ${
                absent ? "bg-[#E7F0E8] text-[#6B8B74]" : "bg-[#0F172A] text-white"
              }`}
            >
              {initials}
              <i className={`absolute -bottom-0.5 -right-0.5 size-1.5 rounded-full ring-1 ring-white ${absent ? "bg-[#B45252]" : "bg-[#4D9560]"}`} />
            </span>
            <span>
              <strong className="block text-[10px]">{name}</strong>
              <small className="block whitespace-nowrap text-[8px] text-[#718096]">{status}</small>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
