import Sidebar from "@/components/layout/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <section>
            <Sidebar />
            <div className="pl-70">
                {children}
            </div>
        </section>
    );
}