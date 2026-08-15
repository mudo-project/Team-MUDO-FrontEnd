"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
    deleteNotificationAction,
    deleteReadNotificationsAction,
    getNotificationListAction,
    readNotificationAction,
} from "../actions";
import { useAlarmStore } from "@/store/useAlarmStore";
import AlarmHeader from "./AlarmHeader";
import AlarmList from "./AlarmList";

interface AlarmContainerProps {
    initialAlarms: NotificationItemData[];
    initialHasNext: boolean;
    loadError: boolean;
}

export default function AlarmContainer({ initialAlarms, initialHasNext, loadError }: AlarmContainerProps) {
    const [alarms, setAlarms] = useState(initialAlarms);
    const [page, setPage] = useState(0);
    const [hasNext, setHasNext] = useState(initialHasNext);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const decrementUnreadCount = useAlarmStore((state) => state.decrementUnreadCount);

    const handleItemClick = async (notificationId: number) => {
        const target = alarms.find((alarm) => alarm.notificationId === notificationId);
        if (!target || target.read) return;

        const result = await readNotificationAction(notificationId);

        if (result.success) {
            setAlarms((current) =>
                current.map((alarm) =>
                    alarm.notificationId === notificationId ? { ...alarm, read: true } : alarm
                )
            );
            decrementUnreadCount();
        } else {
            toast.error(result.message);
        }
    };

    const handleDelete = async (notificationId: number) => {
        const target = alarms.find((alarm) => alarm.notificationId === notificationId);
        const result = await deleteNotificationAction(notificationId);

        if (result.success) {
            setAlarms((current) => current.filter((alarm) => alarm.notificationId !== notificationId));
            if (target && !target.read) {
                decrementUnreadCount();
            }
        } else {
            toast.error(result.message);
        }
    };

    const handleDeleteRead = async () => {
        const result = await deleteReadNotificationsAction();

        if (result.success) {
            setAlarms((current) => current.filter((alarm) => !alarm.read));
        } else {
            toast.error(result.message);
        }
    };

    const handleLoadMore = async () => {
        if (!hasNext || isLoadingMore) return;

        setIsLoadingMore(true);
        try {
            const nextPage = page + 1;
            const data = await getNotificationListAction({ page: nextPage });

            setAlarms((current) => [...current, ...data.content]);
            setHasNext(data.hasNext);
            setPage(nextPage);
        } catch {
            toast.error("알림을 더 불러오지 못했습니다.");
        } finally {
            setIsLoadingMore(false);
        }
    };

    return (
        <>
            <AlarmHeader onDeleteRead={handleDeleteRead} />
            {loadError ? (
                <div className="flex h-[200px] items-center justify-center rounded-xl border border-[#DCE9DF] bg-white text-[13px] text-[#64748B] shadow-[0_1px_2px_rgba(15,23,42,0.02)]">
                    알림을 불러오지 못했습니다.
                </div>
            ) : (
                <AlarmList
                    alarms={alarms}
                    hasNext={hasNext}
                    onDelete={handleDelete}
                    onItemClick={handleItemClick}
                    onLoadMore={handleLoadMore}
                />
            )}
        </>
    );
}
