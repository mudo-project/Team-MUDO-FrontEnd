"use server";

import {
    addWorkspaceMembers,
    changeWorkspaceName,
    changeWorkspaceTask,
    createWorkspace,
    createWorkspaceTask,
    deleteWorkspace,
    deleteWorkspaceTask,
    getWorkspaceDetail,
    getWorkspaceList,
    recordWorkspaceRecentAccess,
    recoverWorkspace,
    removeWorkspaceMember,
} from "@/service/workspace.service";
import {
    AddWorkspaceMembersData,
    AddWorkspaceMembersRequest,
    ChangeWorkspaceNameData,
    ChangeWorkspaceNameRequest,
    ChangeWorkspaceTaskData,
    ChangeWorkspaceTaskRequest,
    CreateWorkspaceData,
    CreateWorkspaceRequest,
    CreateWorkspaceTaskData,
    CreateWorkspaceTaskRequest,
    WorkspaceDetailData,
    WorkspaceListData,
    WorkspaceListScope,
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

export const createWorkspaceAction = async (
    payload: CreateWorkspaceRequest,
): Promise<WorkspaceActionResult<CreateWorkspaceData>> => {
    const name = payload.name.trim();

    if (!name || name.length > 100) {
        return {
            success: false,
            message: "워크스페이스 이름은 1자 이상 100자 이하로 입력해주세요.",
        };
    }

    if (payload.memberIds?.some((id) => !isPositiveInteger(id))) {
        return {
            success: false,
            message: "참여자 번호가 올바르지 않습니다.",
        };
    }

    try {
        const response = await createWorkspace({ ...payload, name });

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
    payload: ChangeWorkspaceNameRequest,
): Promise<WorkspaceActionResult<ChangeWorkspaceNameData>> => {
    if (!isPositiveInteger(workspaceId)) {
        return {
            success: false,
            message: "워크스페이스 번호가 올바르지 않습니다.",
        };
    }

    const name = payload.name.trim();

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
    payload: AddWorkspaceMembersRequest,
): Promise<WorkspaceActionResult<AddWorkspaceMembersData>> => {
    if (!isPositiveInteger(workspaceId)) {
        return {
            success: false,
            message: "워크스페이스 번호가 올바르지 않습니다.",
        };
    }

    if (
        payload.memberIds.length === 0 ||
        payload.memberIds.some((id) => !isPositiveInteger(id))
    ) {
        return {
            success: false,
            message: "추가할 참여자를 선택해주세요.",
        };
    }

    try {
        const response = await addWorkspaceMembers(workspaceId, payload);

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
    payload: CreateWorkspaceTaskRequest,
): Promise<WorkspaceActionResult<CreateWorkspaceTaskData>> => {
    if (!isPositiveInteger(workspaceId)) {
        return {
            success: false,
            message: "워크스페이스 번호가 올바르지 않습니다.",
        };
    }

    const title = payload.title.trim();

    if (!title || title.length > 200) {
        return {
            success: false,
            message: "업무 제목은 1자 이상 200자 이하로 입력해주세요.",
        };
    }

    if (!isValidDate(payload.dueAt)) {
        return {
            success: false,
            message: "마감일 형식이 올바르지 않습니다.",
        };
    }

    try {
        const response = await createWorkspaceTask(workspaceId, {
            ...payload,
            title,
        });

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
