import { Minus, Plus } from "lucide-react";
import SettingCard from "@/feature/setting/components/SettingCard";
import SectionHeading from "@/feature/setting/components/SectionHeading";

export default function SettingWorkingHours() {
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
          <select
            className="h-11 rounded-lg border border-[#DCE9DF] bg-white px-3 text-[13px] font-medium outline-none"
            defaultValue="09:00"
            id="start-time"
          >
            <option>09:00</option>
          </select>
          <p className="text-[11px] text-[#94A3B8]">이 시각 이후 출근하면 지각으로 기록됩니다</p>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-[86px_172px_minmax(0,1fr)] sm:items-center">
          <label className="text-[12px] font-medium text-[#718096]" htmlFor="end-time">
            퇴근 시각
          </label>
          <select
            className="h-11 rounded-lg border border-[#DCE9DF] bg-white px-3 text-[13px] font-medium outline-none"
            defaultValue="18:00"
            id="end-time"
          >
            <option>18:00</option>
          </select>
          <p className="text-[11px] text-[#94A3B8]">이 시각 이후에는 초과근무를 기록할 수 있습니다</p>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-[86px_152px_minmax(0,1fr)] sm:items-center">
          <span className="text-[12px] font-medium text-[#718096]">지각 유예</span>
          <div className="flex h-11 items-center justify-between rounded-lg border border-[#DCE9DF] px-3">
            <button aria-label="지각 유예 시간 감소" className="text-[#718096]" type="button">
              <Minus className="size-4" />
            </button>
            <span className="text-[13px] font-semibold">10</span>
            <button aria-label="지각 유예 시간 증가" className="text-[#718096]" type="button">
              <Plus className="size-4" />
            </button>
          </div>
          <p className="text-[11px] text-[#94A3B8]">분 유예 시간 내 출근은 정상 출근으로 처리됩니다. 이면 유예 없음.</p>
        </div>

        <div className="flex items-center gap-4 pt-1">
          <span className="text-[12px] font-medium text-[#718096]">요일별 예외</span>
          <label className="relative inline-flex cursor-pointer items-center">
            <input className="peer sr-only" type="checkbox" />
            <span className="h-7 w-12 rounded-full bg-[#DCE9DF] transition peer-checked:bg-[#4D9560]" />
            <span className="absolute left-1 size-5 rounded-full bg-white shadow-sm transition peer-checked:translate-x-5" />
          </label>
        </div>

        <p className="rounded-lg bg-[#EEF4FA] px-4 py-3 text-[11px] text-[#718096]">
          설정 변경은 저장 시점 이후의 근태 기록에만 적용되며, 지난 기록은 변경되지 않습니다.
        </p>

        <div className="flex justify-end pt-3">
          <button
            className="h-11 rounded-lg bg-[#0F172A] px-6 text-[13px] font-semibold text-white"
            type="button"
          >
            저장
          </button>
        </div>
      </form>
    </SettingCard>
  );
}
