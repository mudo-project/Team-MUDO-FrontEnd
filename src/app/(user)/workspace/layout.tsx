import WorkspaceSidebar from "@/feature/workspace/components/WorkspaceSidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex bg-[#FCFDFE] text-[#202A3C]">
            <WorkspaceSidebar />
            <div className="w-full">{children}</div>
        </div>
    );
}
