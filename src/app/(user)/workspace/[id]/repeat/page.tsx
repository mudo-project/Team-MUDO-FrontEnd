import WorkspaceRepeatCt from "@/feature/workspace/components/WorkspaceRepeatCt";

interface WorkspaceRepeatPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function Page({ params }: WorkspaceRepeatPageProps) {
    const { id: workspaceId } = await params;

    return (
        <WorkspaceRepeatCt workspaceId={workspaceId} />
    );
}
