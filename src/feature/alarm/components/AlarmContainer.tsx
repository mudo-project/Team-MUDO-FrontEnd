"use client";

import { useState } from "react";
import AlarmHeader from "./AlarmHeader";
import AlarmList from "./AlarmList";

interface AlarmListItem {
    notificationId: number;
    message: string;
    read: boolean;
    createdAt: string;
}

export default function AlarmContainer({ initialAlarms }: { initialAlarms: AlarmListItem[] }) {
    const [alarms, setAlarms] = useState(initialAlarms);

    const handleItemClick = (notificationId: number) => {
        setAlarms((current) =>
            current.map((alarm) =>
                alarm.notificationId === notificationId ? { ...alarm, read: true } : alarm
            )
        );
    };

    const handleDelete = (notificationId: number) => {
        setAlarms((current) => current.filter((alarm) => alarm.notificationId !== notificationId));
    };

    const handleDeleteRead = () => {
        setAlarms((current) => current.filter((alarm) => !alarm.read));
    };

    return (
        <>
            <AlarmHeader onDeleteRead={handleDeleteRead} />
            <AlarmList alarms={alarms} onDelete={handleDelete} onItemClick={handleItemClick} />
        </>
    );
}
