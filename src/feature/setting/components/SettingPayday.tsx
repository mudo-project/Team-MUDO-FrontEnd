import SettingCard from "@/feature/setting/components/SettingCard";
import SectionHeading from "@/feature/setting/components/SectionHeading";
import { generatePaydayOptions } from "@/feature/setting/utils";

const PAYDAY_OPTIONS = generatePaydayOptions();

export default function SettingPayday() {
  return (
    <SettingCard>
      <SectionHeading title="급여 지급일 설정" description="매월 급여 명세서를 자동 발송할 날짜를 설정합니다." />
      <div className="mt-5 flex items-center gap-3">
        <label className="sr-only" htmlFor="payday">급여 지급일</label>
        <select className="h-10 rounded-lg border border-[#DCE9DF] bg-white px-3 text-[12px] font-medium" defaultValue="1일" id="payday">
          {PAYDAY_OPTIONS.map((day) => (
            <option key={day}>{day}</option>
          ))}
        </select>
        <span className="text-[11px] text-[#718096]">에 자동 발송</span>
      </div>
    </SettingCard>
  );
}
