import WorkspaceHeader from "@/feature/workspace/components/WorkspaceHeader";
import WorkspaceRealtimeProvider from "@/feature/workspace/components/WorkspaceRealtimeProvider";
import { getApiBaseUrl } from "@/lib/apiBaseUrl";
import { connection } from "next/server";

interface WorkspaceLayoutProps {
    children: React.ReactNode;
    params: Promise<{
        id: string;
    }>;
}

export default async function Layout({ children, params }: WorkspaceLayoutProps) {
    await connection();
    const { id: workspaceId } = await params;
    const apiBaseUrl = await getApiBaseUrl();

    return (
        <div className="min-w-0 w-full">
            <WorkspaceRealtimeProvider apiBaseUrl={apiBaseUrl} workspaceId={workspaceId} />
            <WorkspaceHeader workspaceId={workspaceId} />
            <div className="w-full">{children}</div>
        </div>
    );
}
