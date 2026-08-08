import { fetchWithAuth } from "@/lib/fetch";
import { getErrorMessage } from "@/lib/stateError";
import {
    AddWorkspaceMembersRequest,
    AddWorkspaceMembersResponse,
    ChangeWorkspaceNameRequest,
    ChangeWorkspaceNameResponse,
    ChangeWorkspaceTaskRequest,
    ChangeWorkspaceTaskResponse,
    CreateWorkspaceRequest,
    CreateWorkspaceResponse,
    CreateWorkspaceTaskRequest,
    CreateWorkspaceTaskResponse,
    WorkspaceDetailResponse,
    WorkspaceListResponse,
    WorkspaceListScope,
} from "@/feature/workspace/type";

export const getWorkspaceList = async (scope: WorkspaceListScope = "MINE"): Promise<WorkspaceListResponse> => {
    const response = await fetchWithAuth(
        `/api/workspaces?scope=${scope}`,
    );

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "워크스페이스 목록 조회에 실패했습니다.",
        );

        throw new Error(message);
    }

    return response.json();
};

export const getWorkspaceDetail = async (workspaceId: number, date?: string,): Promise<WorkspaceDetailResponse> => {
    const query = date ? `?date=${encodeURIComponent(date)}` : "";
    const response = await fetchWithAuth(
        `/api/workspaces/${workspaceId}${query}`,
    );

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "워크스페이스 상세 조회에 실패했습니다.",
        );

        throw new Error(message);
    }

    return response.json();
};

export const createWorkspace = async (payload: CreateWorkspaceRequest,): Promise<CreateWorkspaceResponse> => {
    const response = await fetchWithAuth("/api/workspaces", {
        method: "POST",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "워크스페이스 생성에 실패했습니다.",
        );

        throw new Error(message);
    }

    return response.json();
};

export const changeWorkspaceName = async (workspaceId: number, payload: ChangeWorkspaceNameRequest,): Promise<ChangeWorkspaceNameResponse> => {
    const response = await fetchWithAuth(`/api/workspaces/${workspaceId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "워크스페이스 이름 수정에 실패했습니다.",
        );

        throw new Error(message);
    }

    return response.json();
};

export const deleteWorkspace = async (workspaceId: number): Promise<void> => {
    const response = await fetchWithAuth(`/api/workspaces/${workspaceId}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "워크스페이스 삭제에 실패했습니다.",
        );

        throw new Error(message);
    }
};

export const recoverWorkspace = async (workspaceId: number): Promise<void> => {
    const response = await fetchWithAuth(
        `/api/workspaces/${workspaceId}/recover`,
        { method: "POST" },
    );

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "워크스페이스 복구에 실패했습니다.",
        );

        throw new Error(message);
    }
};

export const addWorkspaceMembers = async (workspaceId: number, payload: AddWorkspaceMembersRequest,): Promise<AddWorkspaceMembersResponse> => {
    const response = await fetchWithAuth(
        `/api/workspaces/${workspaceId}/members`,
        {
            method: "POST",
            body: JSON.stringify(payload),
        },
    );

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "워크스페이스 참여자 추가에 실패했습니다.",
        );

        throw new Error(message);
    }

    return response.json();
};

export const removeWorkspaceMember = async (workspaceId: number, userId: number,): Promise<void> => {
    const response = await fetchWithAuth(
        `/api/workspaces/${workspaceId}/members/${userId}`,
        { method: "DELETE" },
    );

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "워크스페이스 참여자 제거에 실패했습니다.",
        );

        throw new Error(message);
    }
};

export const recordWorkspaceRecentAccess = async (workspaceId: number,): Promise<void> => {
    const response = await fetchWithAuth(
        `/api/workspaces/${workspaceId}/recent-access`,
        { method: "PUT" },
    );

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "워크스페이스 최근 접속 기록에 실패했습니다.",
        );

        throw new Error(message);
    }
};

export const createWorkspaceTask = async (workspaceId: number, payload: CreateWorkspaceTaskRequest,): Promise<CreateWorkspaceTaskResponse> => {
    const response = await fetchWithAuth(
        `/api/workspaces/${workspaceId}/tasks`,
        {
            method: "POST",
            body: JSON.stringify(payload),
        },
    );

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "업무 생성에 실패했습니다.",
        );

        throw new Error(message);
    }

    return response.json();
};

export const changeWorkspaceTask = async (workspaceId: number, taskId: number, payload: ChangeWorkspaceTaskRequest,): Promise<ChangeWorkspaceTaskResponse> => {
    const response = await fetchWithAuth(
        `/api/workspaces/${workspaceId}/tasks/${taskId}`,
        {
            method: "PATCH",
            body: JSON.stringify(payload),
        },
    );

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "업무 수정에 실패했습니다.",
        );

        throw new Error(message);
    }

    return response.json();
};

export const deleteWorkspaceTask = async (workspaceId: number, taskId: number,): Promise<void> => {
    const response = await fetchWithAuth(
        `/api/workspaces/${workspaceId}/tasks/${taskId}`,
        { method: "DELETE" },
    );

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "업무 삭제에 실패했습니다.",
        );

        throw new Error(message);
    }
};
