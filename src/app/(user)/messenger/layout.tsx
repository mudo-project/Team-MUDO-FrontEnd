import MessengerSidebar from "@/feature/messenger/components/MessengerSidebar";
import MessengerRealtimeProvider from "@/feature/messenger/components/MessengerRealtimeProvider";

export default function MessengerLayout({ children }: { children: React.ReactNode }) {
    return (
        <MessengerRealtimeProvider>
            <main className="flex h-[calc(100dvh-3.25rem)] min-h-0 min-w-0 overflow-hidden bg-[#FCFCFC] text-[#0F172A]">
                <MessengerSidebar />
                {children}
            </main>
        </MessengerRealtimeProvider>
    );
}
