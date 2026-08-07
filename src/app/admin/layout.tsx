import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <section className="min-h-full flex overflow-auto scrollbar-hide">
            <Sidebar />

            <div className="min-w-0 flex-1">
                <Header />
                {children}
            </div>
        </section>
    );
}