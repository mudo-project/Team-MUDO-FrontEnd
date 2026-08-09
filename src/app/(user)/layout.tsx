import Header from "@/components/layout/Header";
import QueryProvider from "@/components/layout/QueryProvider";
import Sidebar from "@/components/layout/Sidebar";
import MemoContainer from "@/feature/memo/components/MemoContainer";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <QueryProvider>
            <section className="min-h-full flex overflow-auto scrollbar-hide">
                <Sidebar />

                <div className="min-w-0 flex-1">
                    <Header />
                    {children}
                </div>
                <MemoContainer />
            </section>
        </QueryProvider>

    );
}