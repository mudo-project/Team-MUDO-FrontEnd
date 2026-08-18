'use client'

import dynamic from "next/dynamic";

const AlarmRealtimeProvider = dynamic(() => import("@/feature/alarm/components/AlarmRealtimeProvider"), {
    ssr: false,
});
const MessengerUnreadRealtimeProvider = dynamic(
    () => import("@/feature/messenger/components/MessengerUnreadRealtimeProvider"),
    { ssr: false }
);

export default function RealtimeProviders({ apiBaseUrl }: { apiBaseUrl: string }) {
    return (
        <>
            <AlarmRealtimeProvider apiBaseUrl={apiBaseUrl} />
            <MessengerUnreadRealtimeProvider apiBaseUrl={apiBaseUrl} />
        </>
    );
}
