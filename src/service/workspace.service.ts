import { fetchWithAuth } from "@/lib/fetch";
import { getErrorMessage } from "@/lib/stateError";
import {
    AddWorkspaceMembersRequest,
    AddWorkspaceMembersResponse,
    ChangeWorkspaceNameRequest,
    ChangeWorkspaceNameResponse,
    ChangeWorkspaceTaskRequest,
    ChangeWorkspaceTaskResponse,
    ChangeWorkspaceRecurringTemplateRequest,
    ChangeWorkspaceRecurringTemplateResponse,
    CreateWorkspaceRequest,
    CreateWorkspaceRecurringTemplateRequest,
    CreateWorkspaceRecurringTemplateResponse,
    CreateWorkspaceResponse,
    CreateWorkspaceTaskRequest,
    CreateWorkspaceTaskResponse,
    WorkspaceDetailResponse,
    WorkspaceListResponse,
    WorkspaceListScope,
    WorkspaceRecurringTemplateListResponse,
    WorkspaceTaskCommentListResponse,
    WorkspaceTaskCommentRequest,
    WorkspaceTaskCommentResponse,
    WorkspaceTaskDetailResponse,
    DeleteWorkspaceRecurringTemplateResponse,
    GetMyWorkspaceTaskListRequest,
    MyWorkspaceTaskListResponse,
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

export const getMyWorkspaceTaskList = async ({
    status,
    workspaceId,
    page = 0,
    size = 20,
}: GetMyWorkspaceTaskListRequest): Promise<MyWorkspaceTaskListResponse> => {
    const searchParams = new URLSearchParams({
        page: String(page),
        size: String(size),
    });

    if (status) {
        searchParams.set("status", status);
    }

    if (workspaceId) {
        searchParams.set("workspaceId", String(workspaceId));
    }

    const response = await fetchWithAuth(`/api/tasks/me?${searchParams}`);

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "내 업무 목록 조회에 실패했습니다.",
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

export const getWorkspaceTaskDetail = async (
    workspaceId: number,
    taskId: number,
): Promise<WorkspaceTaskDetailResponse> => {
    const response = await fetchWithAuth(
        `/api/workspaces/${workspaceId}/tasks/${taskId}`,
    );

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "업무 상세 조회에 실패했습니다.",
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

export const createWorkspaceTaskComment = async (
    workspaceId: number,
    taskId: number,
    payload: WorkspaceTaskCommentRequest,
): Promise<WorkspaceTaskCommentResponse> => {
    const response = await fetchWithAuth(
        `/api/workspaces/${workspaceId}/tasks/${taskId}/comments`,
        {
            method: "POST",
            body: JSON.stringify(payload),
        },
    );

    if (!response.ok) {
        const message = await getErrorMessage(response, "업무 댓글 생성에 실패했습니다.");
        throw new Error(message);
    }

    return response.json();
};

export const getWorkspaceTaskCommentList = async (
    workspaceId: number,
    taskId: number,
    page = 0,
    size = 20,
): Promise<WorkspaceTaskCommentListResponse> => {
    const response = await fetchWithAuth(
        `/api/workspaces/${workspaceId}/tasks/${taskId}/comments?page=${page}&size=${size}`,
    );

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "업무 댓글 목록 조회에 실패했습니다.",
        );

        throw new Error(message);
    }

    return response.json();
};

export const changeWorkspaceTaskComment = async (
    workspaceId: number,
    taskId: number,
    commentId: number,
    payload: WorkspaceTaskCommentRequest,
): Promise<WorkspaceTaskCommentResponse> => {
    const response = await fetchWithAuth(
        `/api/workspaces/${workspaceId}/tasks/${taskId}/comments/${commentId}`,
        {
            method: "PATCH",
            body: JSON.stringify(payload),
        },
    );

    if (!response.ok) {
        const message = await getErrorMessage(response, "업무 댓글 수정에 실패했습니다.");
        throw new Error(message);
    }

    return response.json();
};

export const toggleWorkspaceTaskCommentComplete = async (
    workspaceId: number,
    taskId: number,
    commentId: number,
): Promise<WorkspaceTaskCommentResponse> => {
    const response = await fetchWithAuth(
        `/api/workspaces/${workspaceId}/tasks/${taskId}/comments/${commentId}/complete`,
        { method: "PATCH" },
    );

    if (!response.ok) {
        const message = await getErrorMessage(response, "업무 댓글 완료 상태 변경에 실패했습니다.");
        throw new Error(message);
    }

    return response.json();
};

export const deleteWorkspaceTaskComment = async (
    workspaceId: number,
    taskId: number,
    commentId: number,
): Promise<void> => {
    const response = await fetchWithAuth(
        `/api/workspaces/${workspaceId}/tasks/${taskId}/comments/${commentId}`,
        { method: "DELETE" },
    );

    if (!response.ok) {
        const message = await getErrorMessage(response, "업무 댓글 삭제에 실패했습니다.");
        throw new Error(message);
    }
};

export const getWorkspaceRecurringTemplateList = async (
    workspaceId: number,
    page = 0,
): Promise<WorkspaceRecurringTemplateListResponse> => {
    const query = new URLSearchParams({
        page: String(page),
    }).toString();
    const response = await fetchWithAuth(
        `/api/workspaces/${workspaceId}/recurring-templates?${query}`,
    );

    if (!response.ok) {
        const message = await getErrorMessage(response, "반복 업무 템플릿 목록 조회에 실패했습니다.");
        throw new Error(message);
    }

    return response.json();
};

export const createWorkspaceRecurringTemplate = async (
    workspaceId: number,
    payload: CreateWorkspaceRecurringTemplateRequest,
): Promise<CreateWorkspaceRecurringTemplateResponse> => {
    const response = await fetchWithAuth(
        `/api/workspaces/${workspaceId}/recurring-templates`,
        {
            method: "POST",
            body: JSON.stringify(payload),
        },
    );

    if (!response.ok) {
        const message = await getErrorMessage(response, "반복 업무 템플릿 생성에 실패했습니다.");
        throw new Error(message);
    }

    return response.json();
};

export const changeWorkspaceRecurringTemplate = async (
    workspaceId: number,
    templateId: number,
    payload: ChangeWorkspaceRecurringTemplateRequest,
): Promise<ChangeWorkspaceRecurringTemplateResponse> => {
    const response = await fetchWithAuth(
        `/api/workspaces/${workspaceId}/recurring-templates/${templateId}`,
        {
            method: "PATCH",
            body: JSON.stringify(payload),
        },
    );

    if (!response.ok) {
        const message = await getErrorMessage(response, "반복 업무 템플릿 수정에 실패했습니다.");
        throw new Error(message);
    }

    return response.json();
};

export const deleteWorkspaceRecurringTemplate = async (
    workspaceId: number,
    templateId: number,
): Promise<DeleteWorkspaceRecurringTemplateResponse> => {
    const response = await fetchWithAuth(
        `/api/workspaces/${workspaceId}/recurring-templates/${templateId}`,
        { method: "DELETE" },
    );

    if (!response.ok) {
        const message = await getErrorMessage(response, "반복 업무 템플릿 삭제에 실패했습니다.");
        throw new Error(message);
    }

    return response.json();
};
