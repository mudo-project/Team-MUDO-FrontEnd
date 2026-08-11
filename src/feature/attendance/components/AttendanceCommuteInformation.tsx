"use client";

import { Clock3, Wifi } from "lucide-react";
import AttendanceCard from "./AttendanceCard";
import {
  formatClock,
  formatDateWithWeekday,
  formatElapsed,
  formatTime,
  type AttendanceRecordState,
} from "../attendanceDemo";

type AttendanceCommuteInformationProps = {
  now: Date;
  record: AttendanceRecordState;
  standardStart: Date;
  standardEnd: Date;
  canOvertime: boolean;
  onClockIn: () => void;
  onClockOut: () => void;
  onOvertime: () => void;
};

export default function AttendanceCommuteInformation({
  now,
  record,
  standardStart,
  standardEnd,
  canOvertime,
  onClockIn,
  onClockOut,
  onOvertime,
}: AttendanceCommuteInformationProps) {
  const hasClockedIn = record.clockInAt !== null;
  const hasClockedOut = record.clockOutAt !== null;

  let statusLabel = "출근 전입니다";
  let statusColor = "text-[#718096]";

  if (hasClockedIn && !hasClockedOut) {
    statusLabel = `근무 중 ${formatElapsed(record.clockInAt!.getTime(), now.getTime())} 경과`;
    statusColor = "text-[#4D9560]";
  } else if (hasClockedOut) {
    statusLabel = "근무를 종료했습니다";
  }

  return (
    <AttendanceCard label="근무 중 상태">
      <p className={`text-[10px] font-medium ${statusColor}`}>{statusLabel}</p>
      <strong className="mt-4 block text-[28px] tracking-[-0.04em]">{formatClock(now)}</strong>
      <p className="mt-1 text-[10px] text-[#718096]">{formatDateWithWeekday(now)}</p>
      <p className="mt-4 flex items-center gap-1 text-[10px] text-[#718096]">
        <Clock3 className="size-3" />
        근무 {formatTime(standardStart)} ~ {formatTime(standardEnd)}
      </p>
      <dl className="mt-4 space-y-2 text-[11px]">
        <div className="flex justify-between">
          <dt className="text-[#718096]">출근</dt>
          <dd className="flex items-center gap-1">
            {record.clockInAt ? formatTime(record.clockInAt) : "--:--"}
            {record.isLate && <span className="text-[9px] font-semibold text-[#B78236]">지각</span>}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-[#718096]">퇴근</dt>
          <dd>{record.clockOutAt ? formatTime(record.clockOutAt) : "--:--"}</dd>
        </div>
      </dl>

      {canOvertime && <p className="mt-3 text-[10px] text-[#718096]">정규 근무 종료 · {formatTime(standardEnd)}</p>}
      {record.overtimeStartedAt && (
        <p className="mt-3 text-[10px] font-medium text-[#B78236]">초과근무 기록됨 · {formatTime(record.overtimeStartedAt)}부터</p>
      )}

      {!hasClockedIn && (
        <button 
          type="button" 
          className="mt-4 h-10 w-full rounded-md bg-[#172033] text-[11px] font-semibold text-white" 
          onClick={onClockIn}
        >
          출근하기
        </button>
      )}

      {hasClockedIn && !hasClockedOut && (
        <div className="mt-4 flex gap-2">
          <button 
            type="button" 
            className="h-10 flex-1 rounded-md bg-[#172033] text-[11px] font-semibold text-white" 
            onClick={onClockOut}
          >
            퇴근하기
          </button>
          {canOvertime && (
            <button 
              type="button"
              className="h-10 flex-1 rounded-md border border-[#172033] text-[11px] font-semibold"
              onClick={onOvertime}
            >
              초과근무
            </button>
          )}
        </div>
      )}

      <p className="mt-3 flex items-center gap-1 text-[9px] text-[#718096]">
        <Wifi className="size-3" />
        학원 와이파이 연결됨
      </p>
    </AttendanceCard>
  );
}
