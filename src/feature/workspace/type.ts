export type WorkspaceListScope = "MINE" | "ALL";

export type WorkspaceTaskStatus =
    | "WAITING"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "DELAYED";

export interface WorkspaceApiResponse<T> {
    status: number;
    code: string;
    message: string;
    data: T;
}

export interface WorkspaceListData {
    workspaceId: number;
    name: string;
    memberCount: number;
}

export type WorkspaceListResponse = WorkspaceApiResponse<WorkspaceListData[]>;

export interface WorkspaceMemberData {
    userId: number;
    name: string;
}

export interface WorkspaceTaskData {
    taskId: number;
    title: string;
    status: WorkspaceTaskStatus;
    creator: WorkspaceMemberData;
    dueAt: string | null;
    completedCommentCount?: number;
    commentCount?: number;
}

export interface WorkspaceDetailData {
    workspaceId: number;
    name: string;
    memberCount: number;
    members: WorkspaceMemberData[];
    taskCount: number;
    tasks: WorkspaceTaskData[];
}

export type WorkspaceDetailResponse = WorkspaceApiResponse<WorkspaceDetailData>;

export interface CreateWorkspaceRequest {
    name: string;
    memberIds?: number[];
}

export interface CreateWorkspaceData {
    workspaceId: number;
}

export type CreateWorkspaceResponse = WorkspaceApiResponse<CreateWorkspaceData>;

export interface ChangeWorkspaceNameRequest {
    name: string;
}

export interface ChangeWorkspaceNameData {
    workspaceId: number;
    name: string;
}

export type ChangeWorkspaceNameResponse =
    WorkspaceApiResponse<ChangeWorkspaceNameData>;

export interface AddWorkspaceMembersRequest {
    memberIds: number[];
}

export interface AddWorkspaceMembersData {
    addedMemberIds: number[];
}

export type AddWorkspaceMembersResponse =
    WorkspaceApiResponse<AddWorkspaceMembersData>;

export interface CreateWorkspaceTaskRequest {
    title: string;
    dueAt: string;
}

export interface CreateWorkspaceTaskData {
    taskId: number;
}

export type CreateWorkspaceTaskResponse =
    WorkspaceApiResponse<CreateWorkspaceTaskData>;

export interface ChangeWorkspaceTaskRequest {
    status?: WorkspaceTaskStatus;
    dueAt?: string;
}

export interface ChangeWorkspaceTaskData {
    taskId: number;
    status: WorkspaceTaskStatus;
    dueAt: string | null;
}

export type ChangeWorkspaceTaskResponse =
    WorkspaceApiResponse<ChangeWorkspaceTaskData>;
