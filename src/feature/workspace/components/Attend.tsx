import { WorkspaceActionResult } from "../actions";
import { WorkspaceDetailData, WorkspaceMemberData } from "../type";

export default function Attend({ workspaceData, member, i }: { workspaceData: WorkspaceActionResult<WorkspaceDetailData>, member: WorkspaceMemberData, i: number }) {
    if (workspaceData.data?.memberCount && workspaceData.data?.memberCount > 4) {
        if (i > 4) {
            return;
        } else {
            return (
                <span key={member.userId}>
                    {member.name}{i + 1 !== 5 ? ', ' : ` 외 ${workspaceData.data?.memberCount - i - 1}명`}
                </span>
            )
        }
    } else {
        return (
            <span key={member.userId}>
                {member.name}{i + 1 !== workspaceData.data?.members.length ? ', ' : ' '}
            </span>
        )
    }
}