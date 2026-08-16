import { fetchWithAuth } from "../lib/fetch";
import {
    addWorkspaceMembers,
    changeWorkspaceName,
    changeWorkspaceRecurringTemplate,
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
    getMyWorkspaceTaskList,
    getWorkspaceDetail,
    getWorkspaceList,
    getWorkspaceRecurringTemplateList,
    getWorkspaceTaskCommentList,
    getWorkspaceTaskDetail,
    recordWorkspaceRecentAccess,
    recoverWorkspace,
    removeWorkspaceMember,
    toggleWorkspaceTaskCommentComplete,
} from "./workspace.service";

jest.mock("../lib/fetch", () => ({
    fetchWithAuth: jest.fn(),
}));

const mockedFetchWithAuth = fetchWithAuth as jest.Mock;

const okJsonResponse = (data: unknown) => ({
    ok: true,
    json: () => Promise.resolve(data),
});

const failedJsonResponse = (message: string) => ({
    ok: false,
    headers: { get: () => "application/json" },
    json: () => Promise.resolve({ message }),
});

describe("workspace.service", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getWorkspaceList", () => {
        it("응답이 정상이면 워크스페이스 목록을 반환한다", async () => {
            const mockData = { status: 200, code: "OK", message: "조회했습니다.", data: [] };
            mockedFetchWithAuth.mockResolvedValue(okJsonResponse(mockData));

            const result = await getWorkspaceList("MINE");

            expect(mockedFetchWithAuth).toHaveBeenCalledWith("/api/workspaces?scope=MINE");
            expect(result).toEqual(mockData);
        });

        it("scope 기본값은 MINE이다", async () => {
            mockedFetchWithAuth.mockResolvedValue(
                okJsonResponse({ status: 200, code: "OK", message: "", data: [] }),
            );

            await getWorkspaceList();

            expect(mockedFetchWithAuth).toHaveBeenCalledWith("/api/workspaces?scope=MINE");
        });

        it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
            mockedFetchWithAuth.mockResolvedValue(
                failedJsonResponse("워크스페이스 목록 조회에 실패했습니다."),
            );

            await expect(getWorkspaceList("MINE")).rejects.toThrow(
                "워크스페이스 목록 조회에 실패했습니다.",
            );
        });
    });

    describe("getMyWorkspaceTaskList", () => {
        it("응답이 정상이면 내 업무 목록을 반환한다", async () => {
            const mockData = { status: 200, code: "OK", message: "조회했습니다.", data: { content: [], page: 0, size: 20, hasNext: false } };
            mockedFetchWithAuth.mockResolvedValue(okJsonResponse(mockData));

            const result = await getMyWorkspaceTaskList({ page: 0, size: 20 });

            expect(mockedFetchWithAuth).toHaveBeenCalledWith("/api/tasks/me?page=0&size=20");
            expect(result).toEqual(mockData);
        });

        it("status와 workspaceId가 있으면 쿼리에 포함한다", async () => {
            mockedFetchWithAuth.mockResolvedValue(
                okJsonResponse({ status: 200, code: "OK", message: "", data: { content: [], page: 0, size: 20, hasNext: false } }),
            );

            await getMyWorkspaceTaskList({ status: "WAITING", workspaceId: 3, page: 1, size: 10 });

            const calledUrl = mockedFetchWithAuth.mock.calls[0][0] as string;
            expect(calledUrl).toContain("page=1");
            expect(calledUrl).toContain("size=10");
            expect(calledUrl).toContain("status=WAITING");
            expect(calledUrl).toContain("workspaceId=3");
        });

        it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
            mockedFetchWithAuth.mockResolvedValue(
                failedJsonResponse("내 업무 목록 조회에 실패했습니다."),
            );

            await expect(getMyWorkspaceTaskList({ page: 0, size: 20 })).rejects.toThrow(
                "내 업무 목록 조회에 실패했습니다.",
            );
        });
    });

    describe("getWorkspaceDetail", () => {
        it("응답이 정상이면 워크스페이스 상세를 반환한다", async () => {
            const mockData = { status: 200, code: "OK", message: "조회했습니다.", data: { workspaceId: 1 } };
            mockedFetchWithAuth.mockResolvedValue(okJsonResponse(mockData));

            const result = await getWorkspaceDetail(1);

            expect(mockedFetchWithAuth).toHaveBeenCalledWith("/api/workspaces/1");
            expect(result).toEqual(mockData);
        });

        it("date가 있으면 쿼리에 포함한다", async () => {
            mockedFetchWithAuth.mockResolvedValue(
                okJsonResponse({ status: 200, code: "OK", message: "", data: {} }),
            );

            await getWorkspaceDetail(1, "2026-08-16");

            expect(mockedFetchWithAuth).toHaveBeenCalledWith("/api/workspaces/1?date=2026-08-16");
        });

        it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
            mockedFetchWithAuth.mockResolvedValue(
                failedJsonResponse("워크스페이스 상세 조회에 실패했습니다."),
            );

            await expect(getWorkspaceDetail(1)).rejects.toThrow(
                "워크스페이스 상세 조회에 실패했습니다.",
            );
        });
    });

    describe("createWorkspace", () => {
        it("응답이 정상이면 생성된 워크스페이스 정보를 반환한다", async () => {
            const mockData = { status: 200, code: "OK", message: "생성했습니다.", data: { workspaceId: 10 } };
            mockedFetchWithAuth.mockResolvedValue(okJsonResponse(mockData));

            const result = await createWorkspace({ name: "신규 워크스페이스" });

            expect(mockedFetchWithAuth).toHaveBeenCalledWith("/api/workspaces", {
                method: "POST",
                body: JSON.stringify({ name: "신규 워크스페이스" }),
            });
            expect(result).toEqual(mockData);
        });

        it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
            mockedFetchWithAuth.mockResolvedValue(
                failedJsonResponse("워크스페이스 생성에 실패했습니다."),
            );

            await expect(createWorkspace({ name: "실패 케이스" })).rejects.toThrow(
                "워크스페이스 생성에 실패했습니다.",
            );
        });
    });

    describe("changeWorkspaceName", () => {
        it("응답이 정상이면 변경된 이름 정보를 반환한다", async () => {
            const mockData = { status: 200, code: "OK", message: "수정했습니다.", data: { workspaceId: 1, name: "변경된 이름" } };
            mockedFetchWithAuth.mockResolvedValue(okJsonResponse(mockData));

            const result = await changeWorkspaceName(1, { name: "변경된 이름" });

            expect(mockedFetchWithAuth).toHaveBeenCalledWith("/api/workspaces/1", {
                method: "PATCH",
                body: JSON.stringify({ name: "변경된 이름" }),
            });
            expect(result).toEqual(mockData);
        });

        it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
            mockedFetchWithAuth.mockResolvedValue(
                failedJsonResponse("워크스페이스 이름 수정에 실패했습니다."),
            );

            await expect(changeWorkspaceName(1, { name: "x" })).rejects.toThrow(
                "워크스페이스 이름 수정에 실패했습니다.",
            );
        });
    });

    describe("deleteWorkspace", () => {
        it("응답이 정상이면 아무 값도 반환하지 않는다", async () => {
            mockedFetchWithAuth.mockResolvedValue({ ok: true });

            await expect(deleteWorkspace(1)).resolves.toBeUndefined();
            expect(mockedFetchWithAuth).toHaveBeenCalledWith("/api/workspaces/1", {
                method: "DELETE",
            });
        });

        it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
            mockedFetchWithAuth.mockResolvedValue(
                failedJsonResponse("워크스페이스 삭제에 실패했습니다."),
            );

            await expect(deleteWorkspace(1)).rejects.toThrow(
                "워크스페이스 삭제에 실패했습니다.",
            );
        });
    });

    describe("recoverWorkspace", () => {
        it("응답이 정상이면 아무 값도 반환하지 않는다", async () => {
            mockedFetchWithAuth.mockResolvedValue({ ok: true });

            await expect(recoverWorkspace(1)).resolves.toBeUndefined();
            expect(mockedFetchWithAuth).toHaveBeenCalledWith("/api/workspaces/1/recover", {
                method: "POST",
            });
        });

        it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
            mockedFetchWithAuth.mockResolvedValue(
                failedJsonResponse("워크스페이스 복구에 실패했습니다."),
            );

            await expect(recoverWorkspace(1)).rejects.toThrow(
                "워크스페이스 복구에 실패했습니다.",
            );
        });
    });

    describe("addWorkspaceMembers", () => {
        it("응답이 정상이면 추가된 참여자 정보를 반환한다", async () => {
            const mockData = { status: 200, code: "OK", message: "추가했습니다.", data: { addedMemberIds: [1, 2] } };
            mockedFetchWithAuth.mockResolvedValue(okJsonResponse(mockData));

            const result = await addWorkspaceMembers(1, { memberIds: [1, 2] });

            expect(mockedFetchWithAuth).toHaveBeenCalledWith("/api/workspaces/1/members", {
                method: "POST",
                body: JSON.stringify({ memberIds: [1, 2] }),
            });
            expect(result).toEqual(mockData);
        });

        it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
            mockedFetchWithAuth.mockResolvedValue(
                failedJsonResponse("워크스페이스 참여자 추가에 실패했습니다."),
            );

            await expect(addWorkspaceMembers(1, { memberIds: [1] })).rejects.toThrow(
                "워크스페이스 참여자 추가에 실패했습니다.",
            );
        });
    });

    describe("removeWorkspaceMember", () => {
        it("응답이 정상이면 아무 값도 반환하지 않는다", async () => {
            mockedFetchWithAuth.mockResolvedValue({ ok: true });

            await expect(removeWorkspaceMember(1, 5)).resolves.toBeUndefined();
            expect(mockedFetchWithAuth).toHaveBeenCalledWith("/api/workspaces/1/members/5", {
                method: "DELETE",
            });
        });

        it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
            mockedFetchWithAuth.mockResolvedValue(
                failedJsonResponse("워크스페이스 참여자 제거에 실패했습니다."),
            );

            await expect(removeWorkspaceMember(1, 5)).rejects.toThrow(
                "워크스페이스 참여자 제거에 실패했습니다.",
            );
        });
    });

    describe("recordWorkspaceRecentAccess", () => {
        it("응답이 정상이면 아무 값도 반환하지 않는다", async () => {
            mockedFetchWithAuth.mockResolvedValue({ ok: true });

            await expect(recordWorkspaceRecentAccess(1)).resolves.toBeUndefined();
            expect(mockedFetchWithAuth).toHaveBeenCalledWith(
                "/api/workspaces/1/recent-access",
                { method: "PUT" },
            );
        });

        it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
            mockedFetchWithAuth.mockResolvedValue(
                failedJsonResponse("워크스페이스 최근 접속 기록에 실패했습니다."),
            );

            await expect(recordWorkspaceRecentAccess(1)).rejects.toThrow(
                "워크스페이스 최근 접속 기록에 실패했습니다.",
            );
        });
    });

    describe("createWorkspaceTask", () => {
        it("응답이 정상이면 생성된 업무 정보를 반환한다", async () => {
            const mockData = { status: 200, code: "OK", message: "생성했습니다.", data: { taskId: 1 } };
            mockedFetchWithAuth.mockResolvedValue(okJsonResponse(mockData));

            const result = await createWorkspaceTask(1, { title: "업무", dueAt: "2026-08-20" });

            expect(mockedFetchWithAuth).toHaveBeenCalledWith("/api/workspaces/1/tasks", {
                method: "POST",
                body: JSON.stringify({ title: "업무", dueAt: "2026-08-20" }),
            });
            expect(result).toEqual(mockData);
        });

        it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
            mockedFetchWithAuth.mockResolvedValue(
                failedJsonResponse("업무 생성에 실패했습니다."),
            );

            await expect(
                createWorkspaceTask(1, { title: "업무", dueAt: "2026-08-20" }),
            ).rejects.toThrow("업무 생성에 실패했습니다.");
        });
    });

    describe("getWorkspaceTaskDetail", () => {
        it("응답이 정상이면 업무 상세를 반환한다", async () => {
            const mockData = { status: 200, code: "OK", message: "조회했습니다.", data: { taskId: 1 } };
            mockedFetchWithAuth.mockResolvedValue(okJsonResponse(mockData));

            const result = await getWorkspaceTaskDetail(1, 2);

            expect(mockedFetchWithAuth).toHaveBeenCalledWith("/api/workspaces/1/tasks/2");
            expect(result).toEqual(mockData);
        });

        it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
            mockedFetchWithAuth.mockResolvedValue(
                failedJsonResponse("업무 상세 조회에 실패했습니다."),
            );

            await expect(getWorkspaceTaskDetail(1, 2)).rejects.toThrow(
                "업무 상세 조회에 실패했습니다.",
            );
        });
    });

    describe("changeWorkspaceTask", () => {
        it("응답이 정상이면 변경된 업무 정보를 반환한다", async () => {
            const mockData = { status: 200, code: "OK", message: "수정했습니다.", data: { taskId: 1, status: "IN_PROGRESS", dueAt: null } };
            mockedFetchWithAuth.mockResolvedValue(okJsonResponse(mockData));

            const result = await changeWorkspaceTask(1, 2, { status: "IN_PROGRESS" });

            expect(mockedFetchWithAuth).toHaveBeenCalledWith("/api/workspaces/1/tasks/2", {
                method: "PATCH",
                body: JSON.stringify({ status: "IN_PROGRESS" }),
            });
            expect(result).toEqual(mockData);
        });

        it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
            mockedFetchWithAuth.mockResolvedValue(
                failedJsonResponse("업무 수정에 실패했습니다."),
            );

            await expect(changeWorkspaceTask(1, 2, { status: "COMPLETED" })).rejects.toThrow(
                "업무 수정에 실패했습니다.",
            );
        });
    });

    describe("deleteWorkspaceTask", () => {
        it("응답이 정상이면 아무 값도 반환하지 않는다", async () => {
            mockedFetchWithAuth.mockResolvedValue({ ok: true });

            await expect(deleteWorkspaceTask(1, 2)).resolves.toBeUndefined();
            expect(mockedFetchWithAuth).toHaveBeenCalledWith("/api/workspaces/1/tasks/2", {
                method: "DELETE",
            });
        });

        it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
            mockedFetchWithAuth.mockResolvedValue(
                failedJsonResponse("업무 삭제에 실패했습니다."),
            );

            await expect(deleteWorkspaceTask(1, 2)).rejects.toThrow(
                "업무 삭제에 실패했습니다.",
            );
        });
    });

    describe("createWorkspaceTaskComment", () => {
        it("응답이 정상이면 생성된 댓글 정보를 반환한다", async () => {
            const mockData = { status: 200, code: "OK", message: "등록했습니다.", data: { commentId: 1 } };
            mockedFetchWithAuth.mockResolvedValue(okJsonResponse(mockData));

            const result = await createWorkspaceTaskComment(1, 2, { content: "내용" });

            expect(mockedFetchWithAuth).toHaveBeenCalledWith(
                "/api/workspaces/1/tasks/2/comments",
                { method: "POST", body: JSON.stringify({ content: "내용" }) },
            );
            expect(result).toEqual(mockData);
        });

        it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
            mockedFetchWithAuth.mockResolvedValue(
                failedJsonResponse("업무 댓글 생성에 실패했습니다."),
            );

            await expect(
                createWorkspaceTaskComment(1, 2, { content: "내용" }),
            ).rejects.toThrow("업무 댓글 생성에 실패했습니다.");
        });
    });

    describe("getWorkspaceTaskCommentList", () => {
        it("응답이 정상이면 댓글 목록을 반환한다", async () => {
            const mockData = { status: 200, code: "OK", message: "조회했습니다.", data: { content: [], page: 0, size: 20, hasNext: false } };
            mockedFetchWithAuth.mockResolvedValue(okJsonResponse(mockData));

            const result = await getWorkspaceTaskCommentList(1, 2);

            expect(mockedFetchWithAuth).toHaveBeenCalledWith(
                "/api/workspaces/1/tasks/2/comments?page=0&size=20",
            );
            expect(result).toEqual(mockData);
        });

        it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
            mockedFetchWithAuth.mockResolvedValue(
                failedJsonResponse("업무 댓글 목록 조회에 실패했습니다."),
            );

            await expect(getWorkspaceTaskCommentList(1, 2)).rejects.toThrow(
                "업무 댓글 목록 조회에 실패했습니다.",
            );
        });
    });

    describe("changeWorkspaceTaskComment", () => {
        it("응답이 정상이면 변경된 댓글 정보를 반환한다", async () => {
            const mockData = { status: 200, code: "OK", message: "수정했습니다.", data: { commentId: 1 } };
            mockedFetchWithAuth.mockResolvedValue(okJsonResponse(mockData));

            const result = await changeWorkspaceTaskComment(1, 2, 3, { content: "수정된 내용" });

            expect(mockedFetchWithAuth).toHaveBeenCalledWith(
                "/api/workspaces/1/tasks/2/comments/3",
                { method: "PATCH", body: JSON.stringify({ content: "수정된 내용" }) },
            );
            expect(result).toEqual(mockData);
        });

        it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
            mockedFetchWithAuth.mockResolvedValue(
                failedJsonResponse("업무 댓글 수정에 실패했습니다."),
            );

            await expect(
                changeWorkspaceTaskComment(1, 2, 3, { content: "x" }),
            ).rejects.toThrow("업무 댓글 수정에 실패했습니다.");
        });
    });

    describe("toggleWorkspaceTaskCommentComplete", () => {
        it("응답이 정상이면 변경된 댓글 정보를 반환한다", async () => {
            const mockData = { status: 200, code: "OK", message: "변경했습니다.", data: { commentId: 1, completed: true } };
            mockedFetchWithAuth.mockResolvedValue(okJsonResponse(mockData));

            const result = await toggleWorkspaceTaskCommentComplete(1, 2, 3);

            expect(mockedFetchWithAuth).toHaveBeenCalledWith(
                "/api/workspaces/1/tasks/2/comments/3/complete",
                { method: "PATCH" },
            );
            expect(result).toEqual(mockData);
        });

        it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
            mockedFetchWithAuth.mockResolvedValue(
                failedJsonResponse("업무 댓글 완료 상태 변경에 실패했습니다."),
            );

            await expect(toggleWorkspaceTaskCommentComplete(1, 2, 3)).rejects.toThrow(
                "업무 댓글 완료 상태 변경에 실패했습니다.",
            );
        });
    });

    describe("deleteWorkspaceTaskComment", () => {
        it("응답이 정상이면 아무 값도 반환하지 않는다", async () => {
            mockedFetchWithAuth.mockResolvedValue({ ok: true });

            await expect(deleteWorkspaceTaskComment(1, 2, 3)).resolves.toBeUndefined();
            expect(mockedFetchWithAuth).toHaveBeenCalledWith(
                "/api/workspaces/1/tasks/2/comments/3",
                { method: "DELETE" },
            );
        });

        it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
            mockedFetchWithAuth.mockResolvedValue(
                failedJsonResponse("업무 댓글 삭제에 실패했습니다."),
            );

            await expect(deleteWorkspaceTaskComment(1, 2, 3)).rejects.toThrow(
                "업무 댓글 삭제에 실패했습니다.",
            );
        });
    });

    describe("getWorkspaceRecurringTemplateList", () => {
        it("응답이 정상이면 반복 업무 템플릿 목록을 반환한다", async () => {
            const mockData = { status: 200, code: "OK", message: "조회했습니다.", data: { content: [], page: 0, size: 20, hasNext: false } };
            mockedFetchWithAuth.mockResolvedValue(okJsonResponse(mockData));

            const result = await getWorkspaceRecurringTemplateList(1);

            expect(mockedFetchWithAuth).toHaveBeenCalledWith(
                "/api/workspaces/1/recurring-templates?page=0",
            );
            expect(result).toEqual(mockData);
        });

        it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
            mockedFetchWithAuth.mockResolvedValue(
                failedJsonResponse("반복 업무 템플릿 목록 조회에 실패했습니다."),
            );

            await expect(getWorkspaceRecurringTemplateList(1)).rejects.toThrow(
                "반복 업무 템플릿 목록 조회에 실패했습니다.",
            );
        });
    });

    describe("createWorkspaceRecurringTemplate", () => {
        it("응답이 정상이면 생성된 템플릿 정보를 반환한다", async () => {
            const mockData = { status: 200, code: "OK", message: "생성했습니다.", data: { templateId: 1 } };
            mockedFetchWithAuth.mockResolvedValue(okJsonResponse(mockData));
            const payload = { title: "템플릿", recurrenceType: "WEEKLY" as const, recurrenceRule: { daysOfWeek: [1] } };

            const result = await createWorkspaceRecurringTemplate(1, payload);

            expect(mockedFetchWithAuth).toHaveBeenCalledWith(
                "/api/workspaces/1/recurring-templates",
                { method: "POST", body: JSON.stringify(payload) },
            );
            expect(result).toEqual(mockData);
        });

        it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
            mockedFetchWithAuth.mockResolvedValue(
                failedJsonResponse("반복 업무 템플릿 생성에 실패했습니다."),
            );

            await expect(
                createWorkspaceRecurringTemplate(1, {
                    title: "템플릿",
                    recurrenceType: "MONTHLY",
                    recurrenceRule: { dayOfMonth: 1 },
                }),
            ).rejects.toThrow("반복 업무 템플릿 생성에 실패했습니다.");
        });
    });

    describe("changeWorkspaceRecurringTemplate", () => {
        it("응답이 정상이면 변경된 템플릿 정보를 반환한다", async () => {
            const mockData = { status: 200, code: "OK", message: "수정했습니다.", data: { templateId: 1 } };
            mockedFetchWithAuth.mockResolvedValue(okJsonResponse(mockData));
            const payload = { title: "변경된 템플릿" };

            const result = await changeWorkspaceRecurringTemplate(1, 2, payload);

            expect(mockedFetchWithAuth).toHaveBeenCalledWith(
                "/api/workspaces/1/recurring-templates/2",
                { method: "PATCH", body: JSON.stringify(payload) },
            );
            expect(result).toEqual(mockData);
        });

        it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
            mockedFetchWithAuth.mockResolvedValue(
                failedJsonResponse("반복 업무 템플릿 수정에 실패했습니다."),
            );

            await expect(
                changeWorkspaceRecurringTemplate(1, 2, { title: "x" }),
            ).rejects.toThrow("반복 업무 템플릿 수정에 실패했습니다.");
        });
    });

    describe("deleteWorkspaceRecurringTemplate", () => {
        it("응답이 정상이면 결과를 반환한다", async () => {
            const mockData = { status: 200, code: "OK", message: "삭제했습니다.", data: null };
            mockedFetchWithAuth.mockResolvedValue(okJsonResponse(mockData));

            const result = await deleteWorkspaceRecurringTemplate(1, 2);

            expect(mockedFetchWithAuth).toHaveBeenCalledWith(
                "/api/workspaces/1/recurring-templates/2",
                { method: "DELETE" },
            );
            expect(result).toEqual(mockData);
        });

        it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
            mockedFetchWithAuth.mockResolvedValue(
                failedJsonResponse("반복 업무 템플릿 삭제에 실패했습니다."),
            );

            await expect(deleteWorkspaceRecurringTemplate(1, 2)).rejects.toThrow(
                "반복 업무 템플릿 삭제에 실패했습니다.",
            );
        });
    });
});
