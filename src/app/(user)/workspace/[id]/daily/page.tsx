import WorkspaceCt from "@/feature/workspace/components/WorkspaceCt";


interface WorkspaceProps {
    params: Promise<{
        id: string;
    }>;
    searchParams: Promise<{
        date: string;
    }>
}

export default async function Page({ params, searchParams }: WorkspaceProps) {

    const { id: workspaceId } = await params;
    const { date } = await searchParams;

    return (
        <main className="min-h-screen bg-[#FCFDFE] text-[#202A3C]">
            <WorkspaceCt workspaceId={workspaceId} date={date} />
        </main>
    );
}
