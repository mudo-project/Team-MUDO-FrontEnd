"use client";

import { useEffect, useState } from "react";
import { Clock3, Wifi } from "lucide-react";
import AttendanceCard from "./AttendanceCard";
import { ATTENDANCE_STATUS_LABEL, formatClockNow, formatClockTime, formatElapsed } from "../attendanceFormat";
import { getCurrentIpAction, getWifiIpListAction } from "@/feature/setting/actions";

type AttendanceCommuteInformationProps = {
  now: Date;
  today: AttendanceTodayData;
  canOvertime: boolean;
  onClockIn: () => void;
  onClockOut: () => void;
  onOvertime: () => void;
};

export default function AttendanceCommuteInformation({ now, today, canOvertime, onClockIn, onClockOut, onOvertime }: AttendanceCommuteInformationProps) {
  const hasClockedIn = today.clockInAt !== null;
  const hasClockedOut = today.clockOutAt !== null;
  const [isWifiConnected, setIsWifiConnected] = useState(false);

  useEffect(() => {
    Promise.all([getCurrentIpAction(), getWifiIpListAction()])
      .then(([currentIp, wifiIps]) => {
        setIsWifiConnected(wifiIps.some((wifiIp) => wifiIp.ipAddress === currentIp));
      })
      .catch(() => setIsWifiConnected(false));
  }, []);

  let statusLabel = "출근 전입니다";
  let statusColor = "text-[#718096]";

  if (hasClockedIn && !hasClockedOut) {
    statusLabel = `근무 중 ${formatElapsed(new Date(today.clockInAt as string).getTime(), now.getTime())} 경과`;
    statusColor = "text-[#4D9560]";
  } else if (hasClockedOut) {
    statusLabel = "근무를 종료했습니다";
  }

  return (
    <AttendanceCard label="근무 중 상태">
      <p className={`text-[10px] font-medium ${statusColor}`}>{statusLabel}</p>
      <strong className="mt-4 block text-[28px] tracking-[-0.04em]">{formatClockNow(now)}</strong>
      <p className="mt-1 text-[10px] text-[#718096]">{today.date}</p>
      <p className="mt-4 flex items-center gap-1 text-[10px] text-[#718096]">
        <Clock3 className="size-3" />
        근무 {formatClockTime(today.workStartTime)} ~ {formatClockTime(today.workEndTime)}
      </p>
      <dl className="mt-4 space-y-2 text-[11px]">
        <div className="flex justify-between">
          <dt className="text-[#718096]">출근</dt>
          <dd className="flex items-center gap-1">
            {formatClockTime(today.clockInAt)}
            {today.status === "LATE" && <span className="text-[9px] font-semibold text-[#B78236]">{ATTENDANCE_STATUS_LABEL.LATE}</span>}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-[#718096]">퇴근</dt>
          <dd>{formatClockTime(today.clockOutAt)}</dd>
        </div>
      </dl>

      {canOvertime && <p className="mt-3 text-[10px] text-[#718096]">정규 근무 종료 · {formatClockTime(today.workEndTime)}</p>}

      {!hasClockedIn && (
        <button type="button" className="mt-4 h-10 w-full rounded-md bg-[#172033] text-[11px] font-semibold text-white" onClick={onClockIn}>
          출근하기
        </button>
      )}

      {hasClockedIn && !hasClockedOut && (
        <div className="mt-4 flex gap-2">
          <button type="button" className="h-10 flex-1 rounded-md bg-[#172033] text-[11px] font-semibold text-white" onClick={onClockOut}>
            퇴근하기
          </button>
          {canOvertime && (
            <button type="button" className="h-10 flex-1 rounded-md border border-[#172033] text-[11px] font-semibold" onClick={onOvertime}>
              초과근무
            </button>
          )}
        </div>
      )}

      <p className="mt-3 flex items-center gap-1 text-[9px] text-[#718096]">
        <Wifi className="size-3" />
        {isWifiConnected ? "학원 와이파이 연결됨" : "학원 와이파이 연결되지 않음"}
      </p>
    </AttendanceCard>
  );
}
