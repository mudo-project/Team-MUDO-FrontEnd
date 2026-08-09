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
  );
}
