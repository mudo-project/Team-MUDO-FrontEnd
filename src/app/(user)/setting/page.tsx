import SettingWorkingHours from "@/feature/setting/components/SettingWorkingHours";
import SettingWifi from "@/feature/setting/components/SettingWifi";
import SettingPayday from "@/feature/setting/components/SettingPayday";
import SettingAlarm from "@/feature/setting/components/SettingAlarm";
import SettingGoogle from "@/feature/setting/components/SettingGoogle";

export default function SettingPage() {
  return (
    <main className="h-[calc(100dvh-3.25rem)] overflow-hidden bg-[#FCFCFC] px-4 py-6 text-[#172033] sm:px-5 lg:px-8">
      <div className="h-full overflow-y-auto scrollbar-hide">
        <div className="mx-auto w-full max-w-[1740px] pb-8">
          <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(520px,1fr)] xl:gap-5">
            <SettingWorkingHours />

            <div className="space-y-4 xl:space-y-5">
              <SettingWifi />
              <SettingPayday />
              <SettingAlarm />
              <SettingGoogle />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
