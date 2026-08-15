import AlarmContainer from "@/feature/alarm/components/AlarmContainer";
import { getNotificationListAction } from "@/feature/alarm/actions";

export default async function AlarmPage() {
    let alarms: NotificationItemData[] = [];
    let hasNext = false;
    let loadError = false;

    try {
        const notificationList = await getNotificationListAction();
        alarms = notificationList.content;
        hasNext = notificationList.hasNext;
    } catch {
        loadError = true;
    }

    return (
        <main className="mx-auto w-full max-w-[930px] px-5 py-6">
            <AlarmContainer initialAlarms={alarms} initialHasNext={hasNext} loadError={loadError} />
        </main>
    );
}
