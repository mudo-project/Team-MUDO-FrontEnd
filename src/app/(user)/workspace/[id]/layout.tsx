import WorkspaceAttendAddButton from "@/feature/workspace/components/WorkspaceAttendAddButton";
import WorkspaceDeleteButton from "@/feature/workspace/components/WorkspaceDeleteButton";
import WorkspaceEditButton from "@/feature/workspace/components/WorkspaceEditButton";
import WorkspaceHeader from "@/feature/workspace/components/WorkspaceHeader";
import Link from "next/link";

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
