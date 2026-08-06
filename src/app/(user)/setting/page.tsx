import { Check, ChevronRight, Minus, Plus, Wifi } from "lucide-react";
import SettingCard from "@/feature/setting/components/SettingCard";

// 임시로 사용할 더미데이터 입니다. 추후 API 연동을 진행하면서 삭제할 예정입니다.
const notificationItems = [
  "새 결재 알림",
  "공지사항 알림",
  "업무 마감 알림",
  "급여 발송 알림",
];

function SectionHeading({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h1 className="text-[15px] font-bold tracking-[-0.02em] text-[#172033]">{title}</h1>
      <p className="mt-1 text-[11px] text-[#718096]">{description}</p>
    </div>
  );
}

export default function SettingPage() {
  return (
    <main className="h-[calc(100dvh-3.25rem)] overflow-hidden bg-[#FCFCFC] px-5 py-6 text-[#172033] lg:px-8">
      <div className="h-full overflow-y-auto scrollbar-hide">
        <div className="mx-auto w-full max-w-[1740px] pb-8">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(520px,1fr)] xl:gap-5">
            <SettingCard className="min-h-[600px]">
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

            <div className="space-y-4 xl:space-y-5">
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

              <SettingCard>
                <SectionHeading title="급여 지급일 설정" description="매월 급여 명세서를 자동 발송할 날짜를 설정합니다." />
                <div className="mt-5 flex items-center gap-3">
                  <label className="sr-only" htmlFor="payday">급여 지급일</label>
                  <select className="h-10 rounded-lg border border-[#DCE9DF] bg-white px-3 text-[12px] font-medium" defaultValue="1일" id="payday">
                    <option>1일</option>
                  </select>
                  <span className="text-[11px] text-[#718096]">에 자동 발송</span>
                </div>
              </SettingCard>

              <SettingCard>
                <SectionHeading title="알림 설정" description="결재, 공지사항 등 알림 수신 여부를 설정합니다." />
                <div className="mt-5 space-y-3">
                  {notificationItems.map((item) => (
                    <label className="flex items-center gap-2.5 text-[12px] text-[#475569]" key={item}>
                      <input className="size-4 accent-[#0F172A]" defaultChecked type="checkbox" />
                      {item}
                    </label>
                  ))}
                </div>
              </SettingCard>

              <SettingCard>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <SectionHeading title="구글 연동" description="학원 명의 구글 계정을 연동하면 드라이브·독스·시트 템플릿 기능에서 사용할 수 있습니다." />
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#EDF5EE] px-2.5 py-1 text-[10px] font-medium text-[#4D9560]"><Check className="size-3" />연결됨</span>
                    <button className="flex h-8 items-center gap-1 rounded-md border border-[#DCE9DF] px-3 text-[11px] text-[#64748B]" type="button">
                      관리 <ChevronRight className="size-3" />
                    </button>
                  </div>
                </div>
              </SettingCard>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
