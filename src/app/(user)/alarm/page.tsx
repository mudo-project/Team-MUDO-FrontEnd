import AlarmHeader from "@/feature/alarm/components/AlarmHeader";
import AlarmList from "@/feature/alarm/components/AlarmList";

const mockAlarms = [
    {
        notificationId: 12,
        message: "결재 문서 [휴가 신청서] 결재 차례가 되었습니다",
        read: false,
        createdAt: "2026-08-13T09:00:00",
    },
    {
        notificationId: 11,
        message: "[상담 일지 작성] 업무에 회원님을 멘션했습니다",
        read: false,
        createdAt: "2026-08-12T17:20:00",
    },
    {
        notificationId: 10,
        message: "결재 문서 [비품 구매 요청서]가 승인되었습니다",
        read: true,
        createdAt: "2026-08-10T11:05:00",
    },
];

export default function AlarmPage() {
    return (
        <main className="mx-auto w-full max-w-[930px] px-5 py-6">
            <AlarmHeader />
            <AlarmList alarms={mockAlarms} />
        </main>
    );
}
