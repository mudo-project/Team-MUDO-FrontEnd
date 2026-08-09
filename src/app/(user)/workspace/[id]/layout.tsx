import WorkspaceHeader from "@/feature/workspace/components/WorkspaceHeader";

interface WorkspaceLayoutProps {
    children: React.ReactNode;
    params: Promise<{
        id: string;
    }>;
}

export default async function Layout({ children, params }: WorkspaceLayoutProps) {
    const { id: workspaceId } = await params;
    return (
        <div className="min-w-0 w-full">
            <WorkspaceHeader workspaceId={workspaceId} />
            <div className="w-full">{children}</div>
        </div>
    );
}
