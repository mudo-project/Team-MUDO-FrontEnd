import Header from "@/components/layout/Header";
import QueryProvider from "@/components/layout/QueryProvider";
import Sidebar from "@/components/layout/Sidebar";
import RealtimeProviders from "./RealtimeProviders";
import { getApiBaseUrl } from "@/lib/apiBaseUrl";
import MemoContainer from "@/feature/memo/components/MemoContainer";
import { connection } from "next/server";

export default async function Layout({ children }: { children: React.ReactNode }) {
    await connection();
    const apiBaseUrl = await getApiBaseUrl();

    return (
        <QueryProvider>
            <section className="min-h-full flex overflow-hidden">
                <Sidebar />

                <div className="min-w-0 flex-1">
                    <Header />
                    {children}
                </div>
                <MemoContainer />
                <RealtimeProviders apiBaseUrl={apiBaseUrl} />
            </section>
        </QueryProvider>

    );
}
