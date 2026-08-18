"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import SettingCard from "@/feature/setting/components/SettingCard";
import SectionHeading from "@/feature/setting/components/SectionHeading";
import SettingToggle from "@/feature/setting/components/SettingToggle";
import SettingTimeSelect from "@/feature/setting/components/SettingTimeSelect";
import { DEFAULT_WEEKDAY_EXCEPTIONS, toWorkingHoursPolicyWeekdays, type WeekdayException } from "@/feature/setting/utils";
import { saveWorkingHoursPolicyAction } from "@/feature/setting/actions";

type SettingWorkingHoursProps = {
  initialStartTime?: string | null;
  initialEndTime?: string | null;
};

export default function SettingWorkingHours({ initialStartTime, initialEndTime }: SettingWorkingHoursProps) {
  const [startTime, setStartTime] = useState(initialStartTime ?? "09:00");
  const [endTime, setEndTime] = useState(initialEndTime ?? "18:00");
  const [hasWeekdayException, setHasWeekdayException] = useState(false);
  const [weekdayExceptions, setWeekdayExceptions] = useState<WeekdayException[]>(DEFAULT_WEEKDAY_EXCEPTIONS);
  const [lateGraceMinutes, setLateGraceMinutes] = useState(10);
  const [isSaving, setIsSaving] = useState(false);

  function updateWeekdayException(day: WeekdayException["day"], patch: Partial<WeekdayException>) {
    setWeekdayExceptions((prev) =>
      prev.map((exception) => (exception.day === day ? { ...exception, ...patch } : exception))
    );
  }

  async function handleSave() {
    setIsSaving(true);

    const result = await saveWorkingHoursPolicyAction({
      defaultStartTime: startTime,
      defaultEndTime: endTime,
      lateGraceMinutes,
      weekdayExceptionEnabled: hasWeekdayException,
      weekdays: toWorkingHoursPolicyWeekdays(weekdayExceptions),
    });

    setIsSaving(false);

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  }

  return (
    <SettingCard>
      <SectionHeading
        title="근무 시간"
        description="설정한 시각을 기준으로 지각·초과근무가 자동 판정됩니다."
      />

      <form className="mt-6 max-w-[760px] space-y-5">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-[86px_172px_minmax(0,1fr)] sm:items-center">
          <label className="text-[12px] font-medium text-[#718096]" htmlFor="start-time">
            출근 시각
          </label>
          <SettingTimeSelect id="start-time" onChange={setStartTime} value={startTime} />
          <p className="text-[11px] text-[#94A3B8]">이 시각 이후 출근하면 지각으로 기록됩니다</p>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-[86px_172px_minmax(0,1fr)] sm:items-center">
          <label className="text-[12px] font-medium text-[#718096]" htmlFor="end-time">
            퇴근 시각
          </label>
          <SettingTimeSelect id="end-time" onChange={setEndTime} value={endTime} />
          <p className="text-[11px] text-[#94A3B8]">이 시각 이후에는 초과근무를 기록할 수 있습니다</p>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-[86px_152px_minmax(0,1fr)] sm:items-center">
          <span className="text-[12px] font-medium text-[#718096]">지각 유예</span>
          <div className="flex h-11 items-center justify-between rounded-lg border border-[#DCE9DF] px-3">
            <button
              aria-label="지각 유예 시간 감소"
              className="text-[#718096] disabled:cursor-not-allowed disabled:opacity-40"
              disabled={lateGraceMinutes <= 0}
              onClick={() => setLateGraceMinutes((prev) => Math.max(0, prev - 10))}
              type="button"
            >
              <Minus className="size-4" />
            </button>
            <span className="text-[13px] font-semibold">{lateGraceMinutes}</span>
            <button
              aria-label="지각 유예 시간 증가"
              className="text-[#718096] disabled:cursor-not-allowed disabled:opacity-40"
              disabled={lateGraceMinutes >= 60}
              onClick={() => setLateGraceMinutes((prev) => Math.min(60, prev + 10))}
              type="button"
            >
              <Plus className="size-4" />
            </button>
          </div>
          <p className="text-[11px] text-[#94A3B8]">분 유예 시간 내 출근은 정상 출근으로 처리됩니다. 이면 유예 없음.</p>
        </div>

        <div className="flex items-center gap-4 pt-1">
          <span className="text-[12px] font-medium text-[#718096]">요일별 예외</span>
          <SettingToggle ariaLabel="요일별 예외 사용" checked={hasWeekdayException} onChange={setHasWeekdayException} />
        </div>

        {hasWeekdayException && (
          <div className="overflow-hidden rounded-lg border border-[#DCE9DF]">
            {weekdayExceptions.map((exception) => (
              <div
                className="flex flex-wrap items-center gap-2 border-b border-[#DCE9DF] px-4 py-3 last:border-b-0 sm:gap-3"
                key={exception.day}
              >
                <span
                  className={`w-4 text-[12px] font-semibold ${
                    exception.day === "일" ? "text-[#DC2626]" : "text-[#172033]"
                  }`}
                >
                  {exception.day}
                </span>
                <SettingToggle
                  ariaLabel={`${exception.day}요일 근무 여부`}
                  checked={exception.enabled}
                  onChange={(enabled) => updateWeekdayException(exception.day, { enabled })}
                />
                {exception.enabled ? (
                  <>
                    <span className="w-8 text-[12px] font-medium text-[#172033]">근무</span>
                    <SettingTimeSelect
                      className="h-9 rounded-lg border border-[#DCE9DF] bg-white px-2 text-[12px] font-medium outline-none"
                      onChange={(value) => updateWeekdayException(exception.day, { startTime: value })}
                      value={exception.startTime}
                    />
                    <span className="text-[12px] text-[#94A3B8]">~</span>
                    <SettingTimeSelect
                      className="h-9 rounded-lg border border-[#DCE9DF] bg-white px-2 text-[12px] font-medium outline-none"
                      onChange={(value) => updateWeekdayException(exception.day, { endTime: value })}
                      value={exception.endTime}
                    />
                  </>
                ) : (
                  <span className="text-[12px] text-[#94A3B8]">휴무</span>
                )}
              </div>
            ))}
          </div>
        )}

        <p className="rounded-lg bg-[#EEF4FA] px-4 py-3 text-[11px] text-[#718096]">
          설정 변경은 저장 시점 이후의 근태 기록에만 적용되며, 지난 기록은 변경되지 않습니다.
        </p>

        <div className="flex justify-end pt-3">
          <button
            className="h-11 rounded-lg bg-[#0F172A] px-6 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isSaving}
            onClick={handleSave}
            type="button"
          >
            {isSaving ? "저장 중..." : "저장"}
          </button>
        </div>
      </form>
    </SettingCard>
  );
}
