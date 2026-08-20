import WorkspaceHeader from "@/feature/workspace/components/WorkspaceHeader";
import { getApiBaseUrl } from "@/lib/apiBaseUrl";
import dynamic from "next/dynamic";
import { connection } from "next/server";

interface WorkspaceLayoutProps {
    children: React.ReactNode;
    params: Promise<{
        id: string;
    }>;
}

const WorkspaceRealtimeProvider = dynamic(
    () => import("@/feature/workspace/components/WorkspaceRealtimeProvider"),
);


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
