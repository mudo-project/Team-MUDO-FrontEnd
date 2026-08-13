export type WorkspaceListScope = "MINE" | "ALL";

export type WorkspaceTaskStatus =
    | "WAITING"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "DELAYED";

export type MyWorkspaceTaskStatus = Exclude<
    WorkspaceTaskStatus,
    "COMPLETED"
>;

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

export interface GetMyWorkspaceTaskListRequest {
    status?: MyWorkspaceTaskStatus;
    workspaceId?: number;
    page?: number;
    size?: number;
}

export interface MyWorkspaceTaskData {
    taskId: number;
    workspaceId: number;
    workspaceName: string;
    title: string;
    dueAt: string;
    status: MyWorkspaceTaskStatus;
}

export interface MyWorkspaceTaskListData {
    content: MyWorkspaceTaskData[];
    page: number;
    size: number;
    hasNext: boolean;
}

export type MyWorkspaceTaskListResponse =
    WorkspaceApiResponse<MyWorkspaceTaskListData>;

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

export interface WorkspaceTaskDetailData {
    taskId: number;
    title: string;
    creator: WorkspaceMemberData;
    createdAt: string;
    status: WorkspaceTaskStatus;
    dueAt: string | null;
    lastStatusChangedAt?: string;
}

export type WorkspaceTaskDetailResponse =
    WorkspaceApiResponse<WorkspaceTaskDetailData>;

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

export interface WorkspaceTaskCommentRequest {
    content: string;
    mentionedUserIds?: number[];
}

export interface WorkspaceTaskCommentData {
    commentId: number;
    taskId: number;
    authorId: number;
    content: string;
    completed: boolean;
    completedBy: number | null;
    completedAt: string | null;
    mentionedUserIds: number[];
    createdAt: string;
    updatedAt: string;
}

export type WorkspaceTaskCommentResponse =
    WorkspaceApiResponse<WorkspaceTaskCommentData>;

export interface WorkspaceTaskCommentListItemData {
    commentId: number;
    content: string;
    author: WorkspaceMemberData;
    completed: boolean;
    mentionedUserIds?: number[];
    createdAt: string;
}

export interface WorkspaceTaskCommentListData {
    content: WorkspaceTaskCommentListItemData[];
    page: number;
    size: number;
    hasNext: boolean;
}

export type WorkspaceTaskCommentListResponse =
    WorkspaceApiResponse<WorkspaceTaskCommentListData>;

export type WorkspaceRecurrenceType = "WEEKLY" | "MONTHLY";

export type WorkspaceRecurrenceRule =
    | { daysOfWeek: number[] }
    | { dayOfMonth: 1 };

export interface CreateWorkspaceRecurringTemplateRequest {
    title: string;
    recurrenceType: WorkspaceRecurrenceType;
    recurrenceRule: WorkspaceRecurrenceRule;
}

export interface CreateWorkspaceRecurringTemplateData {
    templateId: number;
}

export type CreateWorkspaceRecurringTemplateResponse =
    WorkspaceApiResponse<CreateWorkspaceRecurringTemplateData>;

export interface WorkspaceRecurringTemplateData {
    templateId: number;
    title: string;
    recurrenceType: WorkspaceRecurrenceType;
    recurrenceRule: WorkspaceRecurrenceRule;
    createdBy: number;
}

export interface WorkspaceRecurringTemplateListData {
    content: WorkspaceRecurringTemplateData[];
    page: number;
    size: number;
    hasNext: boolean;
}

export type WorkspaceRecurringTemplateListResponse =
    WorkspaceApiResponse<WorkspaceRecurringTemplateListData>;

export interface ChangeWorkspaceRecurringTemplateRequest {
    title?: string;
    recurrenceType?: WorkspaceRecurrenceType;
    recurrenceRule?: WorkspaceRecurrenceRule;
}

export interface ChangeWorkspaceRecurringTemplateData {
    templateId: number;
    title: string;
    recurrenceType: WorkspaceRecurrenceType;
    recurrenceRule: WorkspaceRecurrenceRule;
}

export type ChangeWorkspaceRecurringTemplateResponse =
    WorkspaceApiResponse<ChangeWorkspaceRecurringTemplateData>;

export type DeleteWorkspaceRecurringTemplateResponse =
    WorkspaceApiResponse<null>;
