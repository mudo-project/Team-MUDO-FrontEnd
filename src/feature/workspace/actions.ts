"use server";

import {
    addWorkspaceMembers,
    changeWorkspaceRecurringTemplate,
    changeWorkspaceName,
    changeWorkspaceTask,
    changeWorkspaceTaskComment,
    createWorkspace,
    createWorkspaceRecurringTemplate,
    createWorkspaceTask,
    createWorkspaceTaskComment,
    deleteWorkspace,
    deleteWorkspaceRecurringTemplate,
    deleteWorkspaceTask,
    deleteWorkspaceTaskComment,
    getWorkspaceRecurringTemplateList,
    getWorkspaceDetail,
    getWorkspaceList,
    getWorkspaceTaskCommentList,
    getWorkspaceTaskDetail,
    recordWorkspaceRecentAccess,
    recoverWorkspace,
    removeWorkspaceMember,
    toggleWorkspaceTaskCommentComplete,
} from "@/service/workspace.service";
import {
    AddWorkspaceMembersData,
    ChangeWorkspaceNameData,
    ChangeWorkspaceTaskData,
    ChangeWorkspaceTaskRequest,
    ChangeWorkspaceRecurringTemplateData,
    ChangeWorkspaceRecurringTemplateRequest,
    CreateWorkspaceData,
    CreateWorkspaceRecurringTemplateData,
    CreateWorkspaceRecurringTemplateRequest,
    CreateWorkspaceTaskData,
    CreateWorkspaceTaskRequest,
    WorkspaceDetailData,
    WorkspaceListData,
    WorkspaceListScope,
    WorkspaceRecurringTemplateListData,
    WorkspaceTaskCommentData,
    WorkspaceTaskCommentListData,
    WorkspaceTaskCommentRequest,
    WorkspaceTaskDetailData,
    WorkspaceRecurrenceRule,
} from "./type";

export interface WorkspaceActionResult<T = undefined> {
    success: boolean;
    message: string;
    data?: T;
}

const isPositiveInteger = (value: number) =>
    Number.isInteger(value) && value > 0;

const isValidDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value);

const getActionErrorMessage = (error: unknown, fallbackMessage: string) =>
    error instanceof Error ? error.message : fallbackMessage;

export const getWorkspaceListAction = async (scope: WorkspaceListScope = "MINE"): Promise<WorkspaceActionResult<WorkspaceListData[]>> => {
    try {
        const response = await getWorkspaceList(scope);

        return {
            success: true,
            message: response.message,
            data: response.data,
        };
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(
                error,
                "워크스페이스 목록 조회에 실패했습니다.",
            ),
        };
    }
};

export const getWorkspaceDetailAction = async (
    workspaceId: number,
    date?: string,
): Promise<WorkspaceActionResult<WorkspaceDetailData>> => {
    if (!isPositiveInteger(workspaceId)) {
        return {
            success: false,
            message: "워크스페이스 번호가 올바르지 않습니다.",
        };
    }

    if (date !== undefined && !isValidDate(date)) {
        return {
            success: false,
            message: "조회 날짜 형식이 올바르지 않습니다.",
        };
    }

    try {
        const response = await getWorkspaceDetail(workspaceId, date);

        return {
            success: true,
            message: response.message,
            data: response.data,
        };
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(
                error,
                "워크스페이스 상세 조회에 실패했습니다.",
            ),
        };
    }
};

export const createWorkspaceAction = async (prevState: WorkspaceActionResult<CreateWorkspaceData>, formData: FormData): Promise<WorkspaceActionResult<CreateWorkspaceData>> => {
    const name = String(formData.get('name') ?? '').trim();
    const memberIds = formData.getAll('memberIds').map(Number);

    if (!name || name.length > 100) {
        return {
            success: false,
            message: "워크스페이스 이름은 1자 이상 100자 이하로 입력해주세요.",
        };
    }

    if (memberIds?.some((id) => !isPositiveInteger(id))) {
        return {
            success: false,
            message: "참여자 번호가 올바르지 않습니다.",
        };
    }
    const payload = {
        name, memberIds
    }

    try {
        const response = await createWorkspace(payload);

        return {
            success: true,
            message: response.message,
            data: response.data,
        };
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(
                error,
                "워크스페이스 생성에 실패했습니다.",
            ),
        };
    }
};

export const changeWorkspaceNameAction = async (
    workspaceId: number,
    prevState: WorkspaceActionResult<ChangeWorkspaceNameData>,
    formData: FormData,
): Promise<WorkspaceActionResult<ChangeWorkspaceNameData>> => {
    if (!isPositiveInteger(workspaceId)) {
        return {
            success: false,
            message: "워크스페이스 번호가 올바르지 않습니다.",
        };
    }

    const name = String(formData.get("name") ?? "").trim();

    if (!name || name.length > 100) {
        return {
            success: false,
            message: "워크스페이스 이름은 1자 이상 100자 이하로 입력해주세요.",
        };
    }

    try {
        const response = await changeWorkspaceName(workspaceId, { name });

        return {
            success: true,
            message: response.message,
            data: response.data,
        };
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(
                error,
                "워크스페이스 이름 수정에 실패했습니다.",
            ),
        };
    }
};

export const deleteWorkspaceAction = async (
    workspaceId: number,
): Promise<WorkspaceActionResult> => {
    if (!isPositiveInteger(workspaceId)) {
        return {
            success: false,
            message: "워크스페이스 번호가 올바르지 않습니다.",
        };
    }

    try {
        await deleteWorkspace(workspaceId);

        return { success: true, message: "워크스페이스를 삭제했습니다." };
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(
                error,
                "워크스페이스 삭제에 실패했습니다.",
            ),
        };
    }
};

export const recoverWorkspaceAction = async (
    workspaceId: number,
): Promise<WorkspaceActionResult> => {
    if (!isPositiveInteger(workspaceId)) {
        return {
            success: false,
            message: "워크스페이스 번호가 올바르지 않습니다.",
        };
    }

    try {
        await recoverWorkspace(workspaceId);

        return { success: true, message: "워크스페이스를 복구했습니다." };
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(
                error,
                "워크스페이스 복구에 실패했습니다.",
            ),
        };
    }
};

export const addWorkspaceMembersAction = async (
    workspaceId: number,
    prevState: WorkspaceActionResult<AddWorkspaceMembersData>,
    formData: FormData,
): Promise<WorkspaceActionResult<AddWorkspaceMembersData>> => {
    if (!isPositiveInteger(workspaceId)) {
        return {
            success: false,
            message: "워크스페이스 번호가 올바르지 않습니다.",
        };
    }

    const memberIds = formData.getAll("memberIds").map(Number);

    if (memberIds.length === 0 || memberIds.some((id) => !isPositiveInteger(id))) {
        return {
            success: false,
            message: "추가할 참여자를 선택해주세요.",
        };
    }

    try {
        const response = await addWorkspaceMembers(workspaceId, { memberIds });

        return {
            success: true,
            message: response.message,
            data: response.data,
        };
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(
                error,
                "워크스페이스 참여자 추가에 실패했습니다.",
            ),
        };
    }
};

export const removeWorkspaceMemberAction = async (
    workspaceId: number,
    userId: number,
): Promise<WorkspaceActionResult> => {
    if (!isPositiveInteger(workspaceId) || !isPositiveInteger(userId)) {
        return {
            success: false,
            message: "워크스페이스 또는 사용자 번호가 올바르지 않습니다.",
        };
    }

    try {
        await removeWorkspaceMember(workspaceId, userId);

        return {
            success: true,
            message: "워크스페이스 참여자를 제거했습니다.",
        };
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(
                error,
                "워크스페이스 참여자 제거에 실패했습니다.",
            ),
        };
    }
};

export const recordWorkspaceRecentAccessAction = async (
    workspaceId: number,
): Promise<WorkspaceActionResult> => {
    if (!isPositiveInteger(workspaceId)) {
        return {
            success: false,
            message: "워크스페이스 번호가 올바르지 않습니다.",
        };
    }

    try {
        await recordWorkspaceRecentAccess(workspaceId);

        return {
            success: true,
            message: "워크스페이스 최근 접속 기록을 갱신했습니다.",
        };
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(
                error,
                "워크스페이스 최근 접속 기록에 실패했습니다.",
            ),
        };
    }
};

export const createWorkspaceTaskAction = async (
    workspaceId: number,
    formData: FormData,
): Promise<WorkspaceActionResult<CreateWorkspaceTaskData>> => {
    if (!isPositiveInteger(workspaceId)) {
        return {
            success: false,
            message: "워크스페이스 번호가 올바르지 않습니다.",
        };
    }

    const title = formData.get('title') as string;

    if (!title.trim() || title.length > 200) {
        return {
            success: false,
            message: "업무 제목은 1자 이상 200자 이하로 입력해주세요.",
        };
    }

    const dueAt = formData.get('dueDate') as string;

    if (!isValidDate(dueAt)) {
        return {
            success: false,
            message: "마감일 형식이 올바르지 않습니다.",
        };
    }

    const payload: CreateWorkspaceTaskRequest = {
        title, dueAt
    }

    try {
        const response = await createWorkspaceTask(workspaceId, payload);

        return {
            success: true,
            message: response.message,
            data: response.data,
        };
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(error, "업무 생성에 실패했습니다."),
        };
    }
};

export const getWorkspaceTaskDetailAction = async (
    workspaceId: number,
    taskId: number,
): Promise<WorkspaceActionResult<WorkspaceTaskDetailData>> => {
    if (!isPositiveInteger(workspaceId) || !isPositiveInteger(taskId)) {
        return {
            success: false,
            message: "워크스페이스 또는 업무 번호가 올바르지 않습니다.",
        };
    }

    try {
        const response = await getWorkspaceTaskDetail(workspaceId, taskId);

        return {
            success: true,
            message: response.message,
            data: response.data,
        };
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(error, "업무 상세 조회에 실패했습니다."),
        };
    }
};

export const changeWorkspaceTaskAction = async (
    workspaceId: number,
    taskId: number,
    payload: ChangeWorkspaceTaskRequest,
): Promise<WorkspaceActionResult<ChangeWorkspaceTaskData>> => {
    if (!isPositiveInteger(workspaceId) || !isPositiveInteger(taskId)) {
        return {
            success: false,
            message: "워크스페이스 또는 업무 번호가 올바르지 않습니다.",
        };
    }

    if (payload.status === undefined && payload.dueAt === undefined) {
        return {
            success: false,
            message: "변경할 업무 정보를 입력해주세요.",
        };
    }

    if (payload.dueAt !== undefined && !isValidDate(payload.dueAt)) {
        return {
            success: false,
            message: "마감일 형식이 올바르지 않습니다.",
        };
    }

    try {
        const response = await changeWorkspaceTask(
            workspaceId,
            taskId,
            payload,
        );

        return {
            success: true,
            message: response.message,
            data: response.data,
        };
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(error, "업무 수정에 실패했습니다."),
        };
    }
};

export const deleteWorkspaceTaskAction = async (
    workspaceId: number,
    taskId: number,
): Promise<WorkspaceActionResult> => {
    if (!isPositiveInteger(workspaceId) || !isPositiveInteger(taskId)) {
        return {
            success: false,
            message: "워크스페이스 또는 업무 번호가 올바르지 않습니다.",
        };
    }

    try {
        await deleteWorkspaceTask(workspaceId, taskId);

        return { success: true, message: "업무를 삭제했습니다." };
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(error, "업무 삭제에 실패했습니다."),
        };
    }
};

export const createWorkspaceTaskCommentAction = async (
    workspaceId: number,
    taskId: number,
    formData: FormData,
): Promise<WorkspaceActionResult<WorkspaceTaskCommentData>> => {
    if (!isPositiveInteger(workspaceId) || !isPositiveInteger(taskId)) {
        return { success: false, message: "워크스페이스 또는 업무 번호가 올바르지 않습니다." };
    }

    const content = String(formData.get("comment") ?? "").trim();
    const mentionedUserIds = formData.getAll("mentionedUserIds").map(Number);

    if (!content) {
        return { success: false, message: "댓글 내용을 입력해주세요." };
    }

    if (mentionedUserIds.some((id) => !isPositiveInteger(id))) {
        return { success: false, message: "멘션 대상 번호가 올바르지 않습니다." };
    }

    const payload: WorkspaceTaskCommentRequest = {
        content,
        mentionedUserIds,
    };

    try {
        const response = await createWorkspaceTaskComment(workspaceId, taskId, payload);
        return { success: true, message: response.message, data: response.data };
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(error, "업무 댓글 생성에 실패했습니다."),
        };
    }
};

export const getWorkspaceTaskCommentListAction = async (
    workspaceId: number,
    taskId: number,
    page = 0,
    size = 20,
): Promise<WorkspaceActionResult<WorkspaceTaskCommentListData>> => {
    if (!isPositiveInteger(workspaceId) || !isPositiveInteger(taskId)) {
        return {
            success: false,
            message: "워크스페이스 또는 업무 번호가 올바르지 않습니다.",
        };
    }

    if (!Number.isInteger(page) || page < 0 || !Number.isInteger(size) || size < 1 || size > 100) {
        return {
            success: false,
            message: "댓글 목록 페이지 조건이 올바르지 않습니다.",
        };
    }

    try {
        const response = await getWorkspaceTaskCommentList(
            workspaceId,
            taskId,
            page,
            size,
        );

        return {
            success: true,
            message: response.message,
            data: response.data,
        };
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(
                error,
                "업무 댓글 목록 조회에 실패했습니다.",
            ),
        };
    }
};

export const changeWorkspaceTaskCommentAction = async (
    workspaceId: number,
    taskId: number,
    commentId: number,
    payload: WorkspaceTaskCommentRequest,
): Promise<WorkspaceActionResult<WorkspaceTaskCommentData>> => {
    if (
        !isPositiveInteger(workspaceId) ||
        !isPositiveInteger(taskId) ||
        !isPositiveInteger(commentId)
    ) {
        return { success: false, message: "워크스페이스, 업무 또는 댓글 번호가 올바르지 않습니다." };
    }

    if (!payload.content.trim()) {
        return { success: false, message: "댓글 내용을 입력해주세요." };
    }

    if (payload.mentionedUserIds?.some((id) => !isPositiveInteger(id))) {
        return { success: false, message: "멘션 대상 번호가 올바르지 않습니다." };
    }

    try {
        const response = await changeWorkspaceTaskComment(
            workspaceId,
            taskId,
            commentId,
            payload,
        );
        return { success: true, message: response.message, data: response.data };
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(error, "업무 댓글 수정에 실패했습니다."),
        };
    }
};

export const toggleWorkspaceTaskCommentCompleteAction = async (
    workspaceId: number,
    taskId: number,
    commentId: number,
): Promise<WorkspaceActionResult<WorkspaceTaskCommentData>> => {
    if (
        !isPositiveInteger(workspaceId) ||
        !isPositiveInteger(taskId) ||
        !isPositiveInteger(commentId)
    ) {
        return { success: false, message: "워크스페이스, 업무 또는 댓글 번호가 올바르지 않습니다." };
    }

    try {
        const response = await toggleWorkspaceTaskCommentComplete(
            workspaceId,
            taskId,
            commentId,
        );
        return { success: true, message: response.message, data: response.data };
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(error, "업무 댓글 완료 상태 변경에 실패했습니다."),
        };
    }
};

export const deleteWorkspaceTaskCommentAction = async (
    workspaceId: number,
    taskId: number,
    commentId: number,
): Promise<WorkspaceActionResult> => {
    if (
        !isPositiveInteger(workspaceId) ||
        !isPositiveInteger(taskId) ||
        !isPositiveInteger(commentId)
    ) {
        return { success: false, message: "워크스페이스, 업무 또는 댓글 번호가 올바르지 않습니다." };
    }

    try {
        await deleteWorkspaceTaskComment(workspaceId, taskId, commentId);
        return { success: true, message: "업무 댓글을 삭제했습니다." };
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(error, "업무 댓글 삭제에 실패했습니다."),
        };
    }
};

export const getWorkspaceRecurringTemplateListAction = async (
    workspaceId: number,
    page = 0,
): Promise<WorkspaceActionResult<WorkspaceRecurringTemplateListData>> => {
    if (!isPositiveInteger(workspaceId) || !Number.isInteger(page) || page < 0) {
        return { success: false, message: "워크스페이스 번호 또는 페이지 조건이 올바르지 않습니다." };
    }

    try {
        const response = await getWorkspaceRecurringTemplateList(workspaceId, page);
        return { success: true, message: response.message, data: response.data };
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(error, "반복 업무 템플릿 목록 조회에 실패했습니다."),
        };
    }
};

export const createWorkspaceRecurringTemplateAction = async (
    workspaceId: number,
    formData: FormData,
): Promise<WorkspaceActionResult<CreateWorkspaceRecurringTemplateData>> => {
    if (!isPositiveInteger(workspaceId)) {
        return { success: false, message: "워크스페이스 번호가 올바르지 않습니다." };
    }

    const title = formData.get('title') as string;
    const repeat = formData.get('repeat') as string;
    if (!title.trim() || title.trim().length > 200) {
        return { success: false, message: "템플릿 제목은 1자 이상 200자 이하로 입력해주세요." };
    }

    const recurrenceType = repeat === 'MONTHLY' ? 'MONTHLY' : 'WEEKLY';
    const recurrenceRule = repeat === 'MONTHLY' ? { dayOfMonth: 1 as const } : { daysOfWeek: [Number(repeat.slice(-1))] } as WorkspaceRecurrenceRule

    const payload: CreateWorkspaceRecurringTemplateRequest = {
        title,
        recurrenceType,
        recurrenceRule
    }

    try {
        const response = await createWorkspaceRecurringTemplate(workspaceId, payload);
        return { success: true, message: response.message, data: response.data };
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(error, "반복 업무 템플릿 생성에 실패했습니다."),
        };
    }
};

export const changeWorkspaceRecurringTemplateAction = async (
    workspaceId: number,
    templateId: number,
    formData: FormData,
): Promise<WorkspaceActionResult<ChangeWorkspaceRecurringTemplateData>> => {
    if (!isPositiveInteger(workspaceId) || !isPositiveInteger(templateId)) {
        return { success: false, message: "워크스페이스 또는 템플릿 번호가 올바르지 않습니다." };
    }

    const title = String(formData.get("title") ?? "").trim();
    const repeat = String(formData.get("repeat") ?? "");

    if (!title || title.length > 200) {
        return { success: false, message: "템플릿 제목은 1자 이상 200자 이하로 입력해주세요." };
    }

    const recurrenceType = repeat === "MONTHLY" ? "MONTHLY" : "WEEKLY";
    const recurrenceRule: WorkspaceRecurrenceRule =
        repeat === "MONTHLY"
            ? { dayOfMonth: 1 }
            : { daysOfWeek: [Number(repeat.slice(-1))] };
    const payload: ChangeWorkspaceRecurringTemplateRequest = {
        title,
        recurrenceType,
        recurrenceRule,
    };

    if (
        "daysOfWeek" in recurrenceRule &&
        recurrenceRule.daysOfWeek.some((day) => day < 1 || day > 7)
    ) {
        return { success: false, message: "반복 주기가 올바르지 않습니다." };
    }

    try {
        const response = await changeWorkspaceRecurringTemplate(
            workspaceId,
            templateId,
            payload,
        );
        return { success: true, message: response.message, data: response.data };
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(error, "반복 업무 템플릿 수정에 실패했습니다."),
        };
    }
};

export const deleteWorkspaceRecurringTemplateAction = async (
    workspaceId: number,
    templateId: number,
): Promise<WorkspaceActionResult> => {
    if (!isPositiveInteger(workspaceId) || !isPositiveInteger(templateId)) {
        return { success: false, message: "워크스페이스 또는 템플릿 번호가 올바르지 않습니다." };
    }

    try {
        const response = await deleteWorkspaceRecurringTemplate(workspaceId, templateId);
        return { success: true, message: response.message };
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(error, "반복 업무 템플릿 삭제에 실패했습니다."),
        };
    }
};
