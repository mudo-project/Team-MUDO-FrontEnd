import { TEAM_TODAY_STATUS_LABEL } from "../attendanceFormat";

type AttendanceTodaySituationProps = {
  team: AttendanceTeamTodayData;
};

export default function AttendanceTodaySituation({ team }: AttendanceTodaySituationProps) {
  const summaryItems = [
    [team.summary.presentCount, "출근", "text-[#4D9560]"],
    [team.summary.leaveCount, "연가", "text-[#B4823D]"],
    [team.summary.absentCount, "결근", "text-[#B45252]"],
    [team.summary.offCount, "휴무", "text-[#718096]"],
  ] as const;

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
          <p className="mt-1 text-[10px] text-[#718096]">
            {team.date} ({team.dayOfWeek}) · 정규 근무 {team.regularWorkStartTime} ~ {team.regularWorkEndTime}
          </p>
        </div>
        <div className="flex gap-5 text-right">
          {summaryItems.map(([count, label, color]) => (
            <span key={label}>
              <b className={`block text-[18px] ${color}`}>{count}</b>
              <small className="text-[9px] text-[#718096]">{label}</small>
            </span>
          ))}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
        {team.employees.map((employee) => {
          const isAbsent = employee.status === "ABSENT" || employee.status === "OFF";

          return (
            <div className="flex min-w-[108px] items-center gap-2 rounded-lg border border-[#E0E9E2] bg-[#FBFCFB] px-2.5 py-2" key={employee.userId}>
              <span
                className={`relative flex size-6 items-center justify-center rounded-full text-[8px] font-bold ${
                  isAbsent ? "bg-[#E7F0E8] text-[#6B8B74]" : "bg-[#0F172A] text-white"
                }`}
              >
                {employee.name.slice(0, 1)}
                <i className={`absolute -bottom-0.5 -right-0.5 size-1.5 rounded-full ring-1 ring-white ${isAbsent ? "bg-[#B45252]" : "bg-[#4D9560]"}`} />
              </span>
              <span>
                <strong className="block text-[10px]">{employee.name}</strong>
                <small className="block whitespace-nowrap text-[8px] text-[#718096]">
                  {TEAM_TODAY_STATUS_LABEL[employee.status] ?? employee.status}
                  {employee.status === "PRESENT" && employee.checkInTime ? ` · ${employee.checkInTime}` : ""}
                </small>
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
