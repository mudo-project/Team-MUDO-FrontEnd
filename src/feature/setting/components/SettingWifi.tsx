import { Wifi } from "lucide-react";
import SettingCard from "@/feature/setting/components/SettingCard";
import SectionHeading from "@/feature/setting/components/SectionHeading";

export default function SettingWifi() {
  return (
    <SettingCard>
      <SectionHeading
        title="와이파이 IP 등록"
        description="출퇴근 기록이 허용되는 와이파이 IP 주소를 등록합니다."
      />
      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <label className="sr-only" htmlFor="wifi-ip">와이파이 IP 주소</label>
        <input
          className="h-11 min-w-0 flex-1 rounded-lg border border-[#DCE9DF] px-3 text-[13px] font-medium outline-none"
          defaultValue="192.168.1.1"
          id="wifi-ip"
        />
        <button className="h-11 rounded-lg bg-[#0F172A] px-5 text-[13px] font-semibold text-white" type="button">
          저장
        </button>
      </div>
      <div className="mt-3 flex flex-col gap-3 rounded-lg bg-[#F6F8FA] px-4 py-3 text-[11px] text-[#718096] sm:flex-row sm:items-center">
        <p className="flex items-center gap-2"><Wifi className="size-3.5" />현재 연결된 네트워크의 IP를 자동으로 가져옵니다</p>
        <button className="h-8 rounded-md border border-[#DCE9DF] bg-white px-3 text-[11px] font-medium text-[#475569] sm:ml-auto" type="button">
          내 IP 확인
        </button>
      </div>
    </SettingCard>
  );
}
