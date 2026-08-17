import MessengerShell from "@/feature/messenger/components/MessengerShell";
import { MessengerMobileNavProvider } from "@/feature/messenger/components/MessengerMobileNavContext";
import MessengerRealtimeProvider from "@/feature/messenger/components/MessengerRealtimeProvider";
import { getApiBaseUrl } from "@/lib/apiBaseUrl";
import { connection } from "next/server";

export default async function MessengerLayout({ children }: { children: React.ReactNode }) {
    await connection();
    const apiBaseUrl = await getApiBaseUrl();

    return (
        <MessengerRealtimeProvider apiBaseUrl={apiBaseUrl}>
            <MessengerMobileNavProvider>
                <main className="relative flex h-[calc(100dvh-3.25rem)] min-h-0 min-w-0 overflow-hidden bg-[#FCFCFC] text-[#0F172A]">
                    <MessengerShell>{children}</MessengerShell>
                </main>
            </MessengerMobileNavProvider>
        </MessengerRealtimeProvider>
    );
}
