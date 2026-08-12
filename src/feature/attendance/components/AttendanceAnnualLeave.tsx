import AttendanceCard from "./AttendanceCard";

type AttendanceAnnualLeaveProps = {
  leave: AttendanceLeaveSummaryData;
  employment: AttendanceEmploymentSummaryData;
};

export default function AttendanceAnnualLeave({ leave, employment }: AttendanceAnnualLeaveProps) {
  const usedRatio = leave.totalDays > 0 ? Math.min(100, Math.round((leave.usedDays / leave.totalDays) * 100)) : 0;

  return (
    <AttendanceCard label="잔여 연가">
      <p className="text-[10px] font-semibold">잔여 연가</p>
      <div className="mt-3 flex items-end justify-between">
        <strong className="text-[27px]">
          {leave.remainingDays}
          <span className="ml-1 text-[12px]">일</span>
        </strong>
        <span className="text-[9px] text-[#718096]">
          총 {leave.totalDays}일 중 {leave.usedDays}일 사용
        </span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#E6EEE8]">
        <div className="h-full rounded-full bg-[#4D9560]" style={{ width: `${usedRatio}%` }} />
      </div>
      <p className="mt-2 text-[9px] text-[#718096]">{leave.nextGrantDate} 갱신 예정</p>
      <div className="mt-4 border-t border-[#E2EBE4] pt-3">
        <p className="text-[10px] text-[#718096]">근속일수</p>
        <strong className="mt-1 block text-[17px]">{employment.tenureDays}일</strong>
        <p className="mt-1 text-[9px] text-[#718096]">입사일 {employment.hireDate}</p>
      </div>
    </AttendanceCard>
  );
}
