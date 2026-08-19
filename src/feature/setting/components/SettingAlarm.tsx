import SettingCard from "@/feature/setting/components/SettingCard";
import SectionHeading from "@/feature/setting/components/SectionHeading";

// 임시로 사용할 더미데이터 입니다. 추후 API 연동을 진행하면서 삭제할 예정입니다.
const notificationItems = [
  "새 결재 알림",
  "공지사항 알림",
  "업무 마감 알림",
  "급여 발송 알림",
];

export default function SettingAlarm() {
  return (
    <SettingCard>
      <SectionHeading
        badge={
          <span className="inline-flex items-center rounded-full bg-[#F1F5F9] px-2 py-0.5 text-[10px] font-semibold text-[#64748B]">
            준비중
          </span>
        }
        description="결재, 공지사항 등 알림 수신 여부를 설정합니다."
        title="알림 설정"
      />
      <div className="mt-5 space-y-3 opacity-60">
        {notificationItems.map((item) => (
          <label className="flex cursor-not-allowed items-center gap-2.5 text-[12px] text-[#94A3B8]" key={item}>
            <input className="size-4 accent-[#94A3B8]" defaultChecked disabled type="checkbox" />
            {item}
          </label>
        ))}
      </div>
      <p className="mt-4 text-[11px] text-[#94A3B8]">알림 설정 기능은 빠른 시일 내 제공될 예정입니다.</p>
    </SettingCard>
  );
}
