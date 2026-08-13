import MyWorkHeader from "@/feature/workspace/components/MyWorkHeader";
import MyWorkList from "@/feature/workspace/components/MyWorkList";
import { MyWorkspaceTaskStatus } from "@/feature/workspace/type";

interface WorkProps {
    searchParams: Promise<{
        status?: MyWorkspaceTaskStatus;
        workspaceId?: number;
    }>
}

export default async function Page({ searchParams }: WorkProps) {
    const { status, workspaceId } = await searchParams;


    return (
        <main className="min-h-screen w-full bg-[#FCFDFE] text-[#202A3C]">
            <MyWorkHeader workspaceId={workspaceId} />

            <section className="px-2 py-4 sm:px-3 md:px-4 md:py-5 lg:px-6">
                <MyWorkList status={status} workspaceId={workspaceId} />
            </section>
        </main>
    );
}
