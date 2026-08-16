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
} from "../../service/workspace.service";
import {
    addWorkspaceMembersAction,
    changeWorkspaceNameAction,
    changeWorkspaceRecurringTemplateAction,
    changeWorkspaceTaskAction,
    changeWorkspaceTaskCommentAction,
    createWorkspaceAction,
    createWorkspaceRecurringTemplateAction,
    createWorkspaceTaskAction,
    createWorkspaceTaskCommentAction,
    deleteWorkspaceAction,
    deleteWorkspaceRecurringTemplateAction,
    deleteWorkspaceTaskAction,
    deleteWorkspaceTaskCommentAction,
    getMyWorkspaceTaskListAction,
    getWorkspaceDetailAction,
    getWorkspaceListAction,
    getWorkspaceRecurringTemplateListAction,
    getWorkspaceTaskCommentListAction,
    getWorkspaceTaskDetailAction,
    recordWorkspaceRecentAccessAction,
    recoverWorkspaceAction,
    removeWorkspaceMemberAction,
    toggleWorkspaceTaskCommentCompleteAction,
} from "./actions";

jest.mock("../../service/workspace.service", () => ({
    addWorkspaceMembers: jest.fn(),
    changeWorkspaceName: jest.fn(),
    changeWorkspaceRecurringTemplate: jest.fn(),
    changeWorkspaceTask: jest.fn(),
    changeWorkspaceTaskComment: jest.fn(),
    createWorkspace: jest.fn(),
    createWorkspaceRecurringTemplate: jest.fn(),
    createWorkspaceTask: jest.fn(),
    createWorkspaceTaskComment: jest.fn(),
    deleteWorkspace: jest.fn(),
    deleteWorkspaceRecurringTemplate: jest.fn(),
    deleteWorkspaceTask: jest.fn(),
    deleteWorkspaceTaskComment: jest.fn(),
    getMyWorkspaceTaskList: jest.fn(),
    getWorkspaceDetail: jest.fn(),
    getWorkspaceList: jest.fn(),
    getWorkspaceRecurringTemplateList: jest.fn(),
    getWorkspaceTaskCommentList: jest.fn(),
    getWorkspaceTaskDetail: jest.fn(),
    recordWorkspaceRecentAccess: jest.fn(),
    recoverWorkspace: jest.fn(),
    removeWorkspaceMember: jest.fn(),
    toggleWorkspaceTaskCommentComplete: jest.fn(),
}));

const mocked = <T extends (...args: never[]) => unknown>(fn: T) =>
    fn as jest.MockedFunction<T>;

const buildFormData = (entries: Record<string, string | string[]>) => {
    const formData = new FormData();
    Object.entries(entries).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            value.forEach((item) => formData.append(key, item));
        } else {
            formData.set(key, value);
        }
    });
    return formData;
};

describe("workspace actions", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getWorkspaceListAction", () => {
        it("조회가 성공하면 목록을 반환한다", async () => {
            mocked(getWorkspaceList).mockResolvedValue({
                status: 200, code: "OK", message: "조회했습니다.", data: [],
            });

            const result = await getWorkspaceListAction("MINE");

            expect(getWorkspaceList).toHaveBeenCalledWith("MINE");
            expect(result).toEqual({ success: true, message: "조회했습니다.", data: [] });
        });

        it("조회가 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
            mocked(getWorkspaceList).mockRejectedValue(new Error("목록 조회에 실패했습니다."));

            const result = await getWorkspaceListAction("MINE");

            expect(result).toEqual({ success: false, message: "목록 조회에 실패했습니다." });
        });

        it("Error가 아닌 값으로 실패하면 기본 메시지를 반환한다", async () => {
            mocked(getWorkspaceList).mockRejectedValue("실패");

            const result = await getWorkspaceListAction("MINE");

            expect(result).toEqual({
                success: false,
                message: "워크스페이스 목록 조회에 실패했습니다.",
            });
        });
    });

    describe("getMyWorkspaceTaskListAction", () => {
        it("상태 값이 올바르지 않으면 실패 결과를 반환한다", async () => {
            const result = await getMyWorkspaceTaskListAction({
                status: "COMPLETED" as never,
            });

            expect(result).toEqual({
                success: false,
                message: "업무 상태 조건이 올바르지 않습니다.",
            });
            expect(getMyWorkspaceTaskList).not.toHaveBeenCalled();
        });

        it("워크스페이스 번호가 올바르지 않으면 실패 결과를 반환한다", async () => {
            const result = await getMyWorkspaceTaskListAction({ workspaceId: -1 });

            expect(result).toEqual({
                success: false,
                message: "워크스페이스 번호가 올바르지 않습니다.",
            });
        });

        it("페이지 조건이 올바르지 않으면 실패 결과를 반환한다", async () => {
            const result = await getMyWorkspaceTaskListAction({ page: -1 });

            expect(result).toEqual({
                success: false,
                message: "업무 목록 페이지 조건이 올바르지 않습니다.",
            });
        });

        it("조회가 성공하면 목록을 반환한다", async () => {
            const data = { content: [], page: 0, size: 20, hasNext: false };
            mocked(getMyWorkspaceTaskList).mockResolvedValue({
                status: 200, code: "OK", message: "조회했습니다.", data,
            });

            const result = await getMyWorkspaceTaskListAction({ page: 0, size: 20 });

            expect(result).toEqual({ success: true, message: "조회했습니다.", data });
        });

        it("조회가 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
            mocked(getMyWorkspaceTaskList).mockRejectedValue(new Error("조회 실패"));

            const result = await getMyWorkspaceTaskListAction({});

            expect(result).toEqual({ success: false, message: "조회 실패" });
        });
    });

    describe("getWorkspaceDetailAction", () => {
        it("워크스페이스 번호가 올바르지 않으면 실패 결과를 반환한다", async () => {
            const result = await getWorkspaceDetailAction(-1);

            expect(result).toEqual({
                success: false,
                message: "워크스페이스 번호가 올바르지 않습니다.",
            });
            expect(getWorkspaceDetail).not.toHaveBeenCalled();
        });

        it("날짜 형식이 올바르지 않으면 실패 결과를 반환한다", async () => {
            const result = await getWorkspaceDetailAction(1, "2026/08/16");

            expect(result).toEqual({
                success: false,
                message: "조회 날짜 형식이 올바르지 않습니다.",
            });
        });

        it("조회가 성공하면 상세 정보를 반환한다", async () => {
            mocked(getWorkspaceDetail).mockResolvedValue({
                status: 200, code: "OK", message: "조회했습니다.", data: { workspaceId: 1 } as never,
            });

            const result = await getWorkspaceDetailAction(1);

            expect(getWorkspaceDetail).toHaveBeenCalledWith(1, undefined);
            expect(result).toEqual({
                success: true, message: "조회했습니다.", data: { workspaceId: 1 },
            });
        });

        it("조회가 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
            mocked(getWorkspaceDetail).mockRejectedValue(new Error("상세 조회 실패"));

            const result = await getWorkspaceDetailAction(1);

            expect(result).toEqual({ success: false, message: "상세 조회 실패" });
        });
    });

    describe("createWorkspaceAction", () => {
        it("이름이 비어있으면 실패 결과를 반환한다", async () => {
            const formData = buildFormData({ name: "  " });

            const result = await createWorkspaceAction(
                { success: false, message: "" },
                formData,
            );

            expect(result).toEqual({
                success: false,
                message: "워크스페이스 이름은 1자 이상 100자 이하로 입력해주세요.",
            });
            expect(createWorkspace).not.toHaveBeenCalled();
        });

        it("이름이 100자를 초과하면 실패 결과를 반환한다", async () => {
            const formData = buildFormData({ name: "a".repeat(101) });

            const result = await createWorkspaceAction(
                { success: false, message: "" },
                formData,
            );

            expect(result.success).toBe(false);
        });

        it("참여자 번호가 올바르지 않으면 실패 결과를 반환한다", async () => {
            const formData = buildFormData({ name: "신규 워크스페이스", memberIds: ["0"] });

            const result = await createWorkspaceAction(
                { success: false, message: "" },
                formData,
            );

            expect(result).toEqual({
                success: false,
                message: "참여자 번호가 올바르지 않습니다.",
            });
        });

        it("생성이 성공하면 결과를 반환한다", async () => {
            mocked(createWorkspace).mockResolvedValue({
                status: 200, code: "OK", message: "생성했습니다.", data: { workspaceId: 1 },
            });
            const formData = buildFormData({ name: "신규 워크스페이스", memberIds: ["1", "2"] });

            const result = await createWorkspaceAction(
                { success: false, message: "" },
                formData,
            );

            expect(createWorkspace).toHaveBeenCalledWith({
                name: "신규 워크스페이스",
                memberIds: [1, 2],
            });
            expect(result).toEqual({
                success: true, message: "생성했습니다.", data: { workspaceId: 1 },
            });
        });

        it("생성이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
            mocked(createWorkspace).mockRejectedValue(new Error("생성 실패"));
            const formData = buildFormData({ name: "신규 워크스페이스" });

            const result = await createWorkspaceAction(
                { success: false, message: "" },
                formData,
            );

            expect(result).toEqual({ success: false, message: "생성 실패" });
        });
    });

    describe("changeWorkspaceNameAction", () => {
        it("워크스페이스 번호가 올바르지 않으면 실패 결과를 반환한다", async () => {
            const result = await changeWorkspaceNameAction(
                -1,
                { success: false, message: "" },
                buildFormData({ name: "변경" }),
            );

            expect(result).toEqual({
                success: false,
                message: "워크스페이스 번호가 올바르지 않습니다.",
            });
        });

        it("이름이 비어있으면 실패 결과를 반환한다", async () => {
            const result = await changeWorkspaceNameAction(
                1,
                { success: false, message: "" },
                buildFormData({ name: "  " }),
            );

            expect(result).toEqual({
                success: false,
                message: "워크스페이스 이름은 1자 이상 100자 이하로 입력해주세요.",
            });
        });

        it("수정이 성공하면 결과를 반환한다", async () => {
            mocked(changeWorkspaceName).mockResolvedValue({
                status: 200, code: "OK", message: "수정했습니다.",
                data: { workspaceId: 1, name: "변경된 이름" },
            });

            const result = await changeWorkspaceNameAction(
                1,
                { success: false, message: "" },
                buildFormData({ name: "변경된 이름" }),
            );

            expect(changeWorkspaceName).toHaveBeenCalledWith(1, { name: "변경된 이름" });
            expect(result).toEqual({
                success: true, message: "수정했습니다.",
                data: { workspaceId: 1, name: "변경된 이름" },
            });
        });

        it("수정이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
            mocked(changeWorkspaceName).mockRejectedValue(new Error("수정 실패"));

            const result = await changeWorkspaceNameAction(
                1,
                { success: false, message: "" },
                buildFormData({ name: "변경된 이름" }),
            );

            expect(result).toEqual({ success: false, message: "수정 실패" });
        });
    });

    describe("deleteWorkspaceAction", () => {
        it("워크스페이스 번호가 올바르지 않으면 실패 결과를 반환한다", async () => {
            const result = await deleteWorkspaceAction(0);

            expect(result).toEqual({
                success: false,
                message: "워크스페이스 번호가 올바르지 않습니다.",
            });
            expect(deleteWorkspace).not.toHaveBeenCalled();
        });

        it("삭제가 성공하면 성공 결과를 반환한다", async () => {
            mocked(deleteWorkspace).mockResolvedValue(undefined);

            const result = await deleteWorkspaceAction(1);

            expect(result).toEqual({ success: true, message: "워크스페이스를 삭제했습니다." });
        });

        it("삭제가 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
            mocked(deleteWorkspace).mockRejectedValue(new Error("삭제 실패"));

            const result = await deleteWorkspaceAction(1);

            expect(result).toEqual({ success: false, message: "삭제 실패" });
        });
    });

    describe("recoverWorkspaceAction", () => {
        it("워크스페이스 번호가 올바르지 않으면 실패 결과를 반환한다", async () => {
            const result = await recoverWorkspaceAction(0);

            expect(result).toEqual({
                success: false,
                message: "워크스페이스 번호가 올바르지 않습니다.",
            });
        });

        it("복구가 성공하면 성공 결과를 반환한다", async () => {
            mocked(recoverWorkspace).mockResolvedValue(undefined);

            const result = await recoverWorkspaceAction(1);

            expect(result).toEqual({ success: true, message: "워크스페이스를 복구했습니다." });
        });

        it("복구가 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
            mocked(recoverWorkspace).mockRejectedValue(new Error("복구 실패"));

            const result = await recoverWorkspaceAction(1);

            expect(result).toEqual({ success: false, message: "복구 실패" });
        });
    });

    describe("addWorkspaceMembersAction", () => {
        it("워크스페이스 번호가 올바르지 않으면 실패 결과를 반환한다", async () => {
            const result = await addWorkspaceMembersAction(
                0,
                { success: false, message: "" },
                buildFormData({ memberIds: ["1"] }),
            );

            expect(result).toEqual({
                success: false,
                message: "워크스페이스 번호가 올바르지 않습니다.",
            });
        });

        it("참여자를 선택하지 않으면 실패 결과를 반환한다", async () => {
            const result = await addWorkspaceMembersAction(
                1,
                { success: false, message: "" },
                buildFormData({}),
            );

            expect(result).toEqual({
                success: false,
                message: "추가할 참여자를 선택해주세요.",
            });
        });

        it("추가가 성공하면 결과를 반환한다", async () => {
            mocked(addWorkspaceMembers).mockResolvedValue({
                status: 200, code: "OK", message: "추가했습니다.", data: { addedMemberIds: [1] },
            });

            const result = await addWorkspaceMembersAction(
                1,
                { success: false, message: "" },
                buildFormData({ memberIds: ["1"] }),
            );

            expect(addWorkspaceMembers).toHaveBeenCalledWith(1, { memberIds: [1] });
            expect(result).toEqual({
                success: true, message: "추가했습니다.", data: { addedMemberIds: [1] },
            });
        });

        it("추가가 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
            mocked(addWorkspaceMembers).mockRejectedValue(new Error("추가 실패"));

            const result = await addWorkspaceMembersAction(
                1,
                { success: false, message: "" },
                buildFormData({ memberIds: ["1"] }),
            );

            expect(result).toEqual({ success: false, message: "추가 실패" });
        });
    });

    describe("removeWorkspaceMemberAction", () => {
        it("워크스페이스 또는 사용자 번호가 올바르지 않으면 실패 결과를 반환한다", async () => {
            const result = await removeWorkspaceMemberAction(0, 1);

            expect(result).toEqual({
                success: false,
                message: "워크스페이스 또는 사용자 번호가 올바르지 않습니다.",
            });
        });

        it("제거가 성공하면 성공 결과를 반환한다", async () => {
            mocked(removeWorkspaceMember).mockResolvedValue(undefined);

            const result = await removeWorkspaceMemberAction(1, 2);

            expect(result).toEqual({
                success: true,
                message: "워크스페이스 참여자를 제거했습니다.",
            });
        });

        it("제거가 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
            mocked(removeWorkspaceMember).mockRejectedValue(new Error("제거 실패"));

            const result = await removeWorkspaceMemberAction(1, 2);

            expect(result).toEqual({ success: false, message: "제거 실패" });
        });
    });

    describe("recordWorkspaceRecentAccessAction", () => {
        it("워크스페이스 번호가 올바르지 않으면 실패 결과를 반환한다", async () => {
            const result = await recordWorkspaceRecentAccessAction(0);

            expect(result).toEqual({
                success: false,
                message: "워크스페이스 번호가 올바르지 않습니다.",
            });
        });

        it("기록이 성공하면 성공 결과를 반환한다", async () => {
            mocked(recordWorkspaceRecentAccess).mockResolvedValue(undefined);

            const result = await recordWorkspaceRecentAccessAction(1);

            expect(result).toEqual({
                success: true,
                message: "워크스페이스 최근 접속 기록을 갱신했습니다.",
            });
        });

        it("기록이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
            mocked(recordWorkspaceRecentAccess).mockRejectedValue(new Error("기록 실패"));

            const result = await recordWorkspaceRecentAccessAction(1);

            expect(result).toEqual({ success: false, message: "기록 실패" });
        });
    });

    describe("createWorkspaceTaskAction", () => {
        it("워크스페이스 번호가 올바르지 않으면 실패 결과를 반환한다", async () => {
            const result = await createWorkspaceTaskAction(
                0,
                buildFormData({ title: "업무", dueDate: "2026-08-20" }),
            );

            expect(result).toEqual({
                success: false,
                message: "워크스페이스 번호가 올바르지 않습니다.",
            });
        });

        it("제목이 비어있으면 실패 결과를 반환한다", async () => {
            const result = await createWorkspaceTaskAction(
                1,
                buildFormData({ title: "  ", dueDate: "2026-08-20" }),
            );

            expect(result).toEqual({
                success: false,
                message: "업무 제목은 1자 이상 200자 이하로 입력해주세요.",
            });
        });

        it("마감일 형식이 올바르지 않으면 실패 결과를 반환한다", async () => {
            const result = await createWorkspaceTaskAction(
                1,
                buildFormData({ title: "업무", dueDate: "2026/08/20" }),
            );

            expect(result).toEqual({
                success: false,
                message: "마감일 형식이 올바르지 않습니다.",
            });
        });

        it("생성이 성공하면 결과를 반환한다", async () => {
            mocked(createWorkspaceTask).mockResolvedValue({
                status: 200, code: "OK", message: "생성했습니다.", data: { taskId: 1 },
            });

            const result = await createWorkspaceTaskAction(
                1,
                buildFormData({ title: "업무", dueDate: "2026-08-20" }),
            );

            expect(createWorkspaceTask).toHaveBeenCalledWith(1, {
                title: "업무",
                dueAt: "2026-08-20",
            });
            expect(result).toEqual({
                success: true, message: "생성했습니다.", data: { taskId: 1 },
            });
        });

        it("생성이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
            mocked(createWorkspaceTask).mockRejectedValue(new Error("업무 생성 실패"));

            const result = await createWorkspaceTaskAction(
                1,
                buildFormData({ title: "업무", dueDate: "2026-08-20" }),
            );

            expect(result).toEqual({ success: false, message: "업무 생성 실패" });
        });
    });

    describe("getWorkspaceTaskDetailAction", () => {
        it("워크스페이스 또는 업무 번호가 올바르지 않으면 실패 결과를 반환한다", async () => {
            const result = await getWorkspaceTaskDetailAction(0, 1);

            expect(result).toEqual({
                success: false,
                message: "워크스페이스 또는 업무 번호가 올바르지 않습니다.",
            });
        });

        it("조회가 성공하면 상세 정보를 반환한다", async () => {
            mocked(getWorkspaceTaskDetail).mockResolvedValue({
                status: 200, code: "OK", message: "조회했습니다.", data: { taskId: 1 } as never,
            });

            const result = await getWorkspaceTaskDetailAction(1, 2);

            expect(result).toEqual({
                success: true, message: "조회했습니다.", data: { taskId: 1 },
            });
        });

        it("조회가 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
            mocked(getWorkspaceTaskDetail).mockRejectedValue(new Error("업무 상세 조회 실패"));

            const result = await getWorkspaceTaskDetailAction(1, 2);

            expect(result).toEqual({ success: false, message: "업무 상세 조회 실패" });
        });
    });

    describe("changeWorkspaceTaskAction", () => {
        it("워크스페이스 또는 업무 번호가 올바르지 않으면 실패 결과를 반환한다", async () => {
            const result = await changeWorkspaceTaskAction(0, 1, { status: "COMPLETED" });

            expect(result).toEqual({
                success: false,
                message: "워크스페이스 또는 업무 번호가 올바르지 않습니다.",
            });
        });

        it("변경할 정보가 없으면 실패 결과를 반환한다", async () => {
            const result = await changeWorkspaceTaskAction(1, 2, {});

            expect(result).toEqual({
                success: false,
                message: "변경할 업무 정보를 입력해주세요.",
            });
        });

        it("마감일 형식이 올바르지 않으면 실패 결과를 반환한다", async () => {
            const result = await changeWorkspaceTaskAction(1, 2, { dueAt: "2026/08/20" });

            expect(result).toEqual({
                success: false,
                message: "마감일 형식이 올바르지 않습니다.",
            });
        });

        it("변경이 성공하면 결과를 반환한다", async () => {
            mocked(changeWorkspaceTask).mockResolvedValue({
                status: 200, code: "OK", message: "수정했습니다.",
                data: { taskId: 1, status: "COMPLETED", dueAt: null },
            });

            const result = await changeWorkspaceTaskAction(1, 2, { status: "COMPLETED" });

            expect(changeWorkspaceTask).toHaveBeenCalledWith(1, 2, { status: "COMPLETED" });
            expect(result).toEqual({
                success: true, message: "수정했습니다.",
                data: { taskId: 1, status: "COMPLETED", dueAt: null },
            });
        });

        it("변경이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
            mocked(changeWorkspaceTask).mockRejectedValue(new Error("업무 수정 실패"));

            const result = await changeWorkspaceTaskAction(1, 2, { status: "COMPLETED" });

            expect(result).toEqual({ success: false, message: "업무 수정 실패" });
        });
    });

    describe("deleteWorkspaceTaskAction", () => {
        it("워크스페이스 또는 업무 번호가 올바르지 않으면 실패 결과를 반환한다", async () => {
            const result = await deleteWorkspaceTaskAction(0, 1);

            expect(result).toEqual({
                success: false,
                message: "워크스페이스 또는 업무 번호가 올바르지 않습니다.",
            });
        });

        it("삭제가 성공하면 성공 결과를 반환한다", async () => {
            mocked(deleteWorkspaceTask).mockResolvedValue(undefined);

            const result = await deleteWorkspaceTaskAction(1, 2);

            expect(result).toEqual({ success: true, message: "업무를 삭제했습니다." });
        });

        it("삭제가 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
            mocked(deleteWorkspaceTask).mockRejectedValue(new Error("업무 삭제 실패"));

            const result = await deleteWorkspaceTaskAction(1, 2);

            expect(result).toEqual({ success: false, message: "업무 삭제 실패" });
        });
    });

    describe("createWorkspaceTaskCommentAction", () => {
        it("워크스페이스 또는 업무 번호가 올바르지 않으면 실패 결과를 반환한다", async () => {
            const result = await createWorkspaceTaskCommentAction(
                0, 1, buildFormData({ comment: "내용" }),
            );

            expect(result).toEqual({
                success: false,
                message: "워크스페이스 또는 업무 번호가 올바르지 않습니다.",
            });
        });

        it("댓글 내용이 비어있으면 실패 결과를 반환한다", async () => {
            const result = await createWorkspaceTaskCommentAction(
                1, 2, buildFormData({ comment: "  " }),
            );

            expect(result).toEqual({ success: false, message: "댓글 내용을 입력해주세요." });
        });

        it("멘션 대상 번호가 올바르지 않으면 실패 결과를 반환한다", async () => {
            const result = await createWorkspaceTaskCommentAction(
                1, 2, buildFormData({ comment: "내용", mentionedUserIds: ["0"] }),
            );

            expect(result).toEqual({
                success: false,
                message: "멘션 대상 번호가 올바르지 않습니다.",
            });
        });

        it("생성이 성공하면 결과를 반환한다", async () => {
            mocked(createWorkspaceTaskComment).mockResolvedValue({
                status: 200, code: "OK", message: "등록했습니다.", data: { commentId: 1 } as never,
            });

            const result = await createWorkspaceTaskCommentAction(
                1, 2, buildFormData({ comment: "내용", mentionedUserIds: ["3"] }),
            );

            expect(createWorkspaceTaskComment).toHaveBeenCalledWith(1, 2, {
                content: "내용",
                mentionedUserIds: [3],
            });
            expect(result).toEqual({
                success: true, message: "등록했습니다.", data: { commentId: 1 },
            });
        });

        it("생성이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
            mocked(createWorkspaceTaskComment).mockRejectedValue(new Error("댓글 생성 실패"));

            const result = await createWorkspaceTaskCommentAction(
                1, 2, buildFormData({ comment: "내용" }),
            );

            expect(result).toEqual({ success: false, message: "댓글 생성 실패" });
        });
    });

    describe("getWorkspaceTaskCommentListAction", () => {
        it("워크스페이스 또는 업무 번호가 올바르지 않으면 실패 결과를 반환한다", async () => {
            const result = await getWorkspaceTaskCommentListAction(0, 1);

            expect(result).toEqual({
                success: false,
                message: "워크스페이스 또는 업무 번호가 올바르지 않습니다.",
            });
        });

        it("페이지 조건이 올바르지 않으면 실패 결과를 반환한다", async () => {
            const result = await getWorkspaceTaskCommentListAction(1, 2, -1);

            expect(result).toEqual({
                success: false,
                message: "댓글 목록 페이지 조건이 올바르지 않습니다.",
            });
        });

        it("조회가 성공하면 댓글 목록을 반환한다", async () => {
            const data = { content: [], page: 0, size: 20, hasNext: false };
            mocked(getWorkspaceTaskCommentList).mockResolvedValue({
                status: 200, code: "OK", message: "조회했습니다.", data,
            });

            const result = await getWorkspaceTaskCommentListAction(1, 2);

            expect(result).toEqual({ success: true, message: "조회했습니다.", data });
        });

        it("조회가 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
            mocked(getWorkspaceTaskCommentList).mockRejectedValue(new Error("댓글 목록 조회 실패"));

            const result = await getWorkspaceTaskCommentListAction(1, 2);

            expect(result).toEqual({ success: false, message: "댓글 목록 조회 실패" });
        });
    });

    describe("changeWorkspaceTaskCommentAction", () => {
        it("워크스페이스, 업무 또는 댓글 번호가 올바르지 않으면 실패 결과를 반환한다", async () => {
            const result = await changeWorkspaceTaskCommentAction(0, 1, 1, { content: "내용" });

            expect(result).toEqual({
                success: false,
                message: "워크스페이스, 업무 또는 댓글 번호가 올바르지 않습니다.",
            });
        });

        it("댓글 내용이 비어있으면 실패 결과를 반환한다", async () => {
            const result = await changeWorkspaceTaskCommentAction(1, 2, 3, { content: "  " });

            expect(result).toEqual({ success: false, message: "댓글 내용을 입력해주세요." });
        });

        it("멘션 대상 번호가 올바르지 않으면 실패 결과를 반환한다", async () => {
            const result = await changeWorkspaceTaskCommentAction(1, 2, 3, {
                content: "내용", mentionedUserIds: [0],
            });

            expect(result).toEqual({
                success: false,
                message: "멘션 대상 번호가 올바르지 않습니다.",
            });
        });

        it("수정이 성공하면 결과를 반환한다", async () => {
            mocked(changeWorkspaceTaskComment).mockResolvedValue({
                status: 200, code: "OK", message: "수정했습니다.", data: { commentId: 1 } as never,
            });

            const result = await changeWorkspaceTaskCommentAction(1, 2, 3, { content: "수정" });

            expect(result).toEqual({
                success: true, message: "수정했습니다.", data: { commentId: 1 },
            });
        });

        it("수정이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
            mocked(changeWorkspaceTaskComment).mockRejectedValue(new Error("댓글 수정 실패"));

            const result = await changeWorkspaceTaskCommentAction(1, 2, 3, { content: "수정" });

            expect(result).toEqual({ success: false, message: "댓글 수정 실패" });
        });
    });

    describe("toggleWorkspaceTaskCommentCompleteAction", () => {
        it("워크스페이스, 업무 또는 댓글 번호가 올바르지 않으면 실패 결과를 반환한다", async () => {
            const result = await toggleWorkspaceTaskCommentCompleteAction(0, 1, 1);

            expect(result).toEqual({
                success: false,
                message: "워크스페이스, 업무 또는 댓글 번호가 올바르지 않습니다.",
            });
        });

        it("변경이 성공하면 결과를 반환한다", async () => {
            mocked(toggleWorkspaceTaskCommentComplete).mockResolvedValue({
                status: 200, code: "OK", message: "변경했습니다.", data: { commentId: 1, completed: true } as never,
            });

            const result = await toggleWorkspaceTaskCommentCompleteAction(1, 2, 3);

            expect(result).toEqual({
                success: true, message: "변경했습니다.", data: { commentId: 1, completed: true },
            });
        });

        it("변경이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
            mocked(toggleWorkspaceTaskCommentComplete).mockRejectedValue(new Error("완료 상태 변경 실패"));

            const result = await toggleWorkspaceTaskCommentCompleteAction(1, 2, 3);

            expect(result).toEqual({ success: false, message: "완료 상태 변경 실패" });
        });
    });

    describe("deleteWorkspaceTaskCommentAction", () => {
        it("워크스페이스, 업무 또는 댓글 번호가 올바르지 않으면 실패 결과를 반환한다", async () => {
            const result = await deleteWorkspaceTaskCommentAction(0, 1, 1);

            expect(result).toEqual({
                success: false,
                message: "워크스페이스, 업무 또는 댓글 번호가 올바르지 않습니다.",
            });
        });

        it("삭제가 성공하면 성공 결과를 반환한다", async () => {
            mocked(deleteWorkspaceTaskComment).mockResolvedValue(undefined);

            const result = await deleteWorkspaceTaskCommentAction(1, 2, 3);

            expect(result).toEqual({ success: true, message: "업무 댓글을 삭제했습니다." });
        });

        it("삭제가 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
            mocked(deleteWorkspaceTaskComment).mockRejectedValue(new Error("댓글 삭제 실패"));

            const result = await deleteWorkspaceTaskCommentAction(1, 2, 3);

            expect(result).toEqual({ success: false, message: "댓글 삭제 실패" });
        });
    });

    describe("getWorkspaceRecurringTemplateListAction", () => {
        it("워크스페이스 번호 또는 페이지 조건이 올바르지 않으면 실패 결과를 반환한다", async () => {
            const result = await getWorkspaceRecurringTemplateListAction(0);

            expect(result).toEqual({
                success: false,
                message: "워크스페이스 번호 또는 페이지 조건이 올바르지 않습니다.",
            });
        });

        it("조회가 성공하면 템플릿 목록을 반환한다", async () => {
            const data = { content: [], page: 0, size: 20, hasNext: false };
            mocked(getWorkspaceRecurringTemplateList).mockResolvedValue({
                status: 200, code: "OK", message: "조회했습니다.", data,
            });

            const result = await getWorkspaceRecurringTemplateListAction(1);

            expect(result).toEqual({ success: true, message: "조회했습니다.", data });
        });

        it("조회가 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
            mocked(getWorkspaceRecurringTemplateList).mockRejectedValue(new Error("템플릿 목록 조회 실패"));

            const result = await getWorkspaceRecurringTemplateListAction(1);

            expect(result).toEqual({ success: false, message: "템플릿 목록 조회 실패" });
        });
    });

    describe("createWorkspaceRecurringTemplateAction", () => {
        it("워크스페이스 번호가 올바르지 않으면 실패 결과를 반환한다", async () => {
            const result = await createWorkspaceRecurringTemplateAction(
                0, buildFormData({ title: "템플릿", repeat: "WEEKLY1" }),
            );

            expect(result).toEqual({
                success: false,
                message: "워크스페이스 번호가 올바르지 않습니다.",
            });
        });

        it("제목이 비어있으면 실패 결과를 반환한다", async () => {
            const result = await createWorkspaceRecurringTemplateAction(
                1, buildFormData({ title: "  ", repeat: "WEEKLY1" }),
            );

            expect(result).toEqual({
                success: false,
                message: "템플릿 제목은 1자 이상 200자 이하로 입력해주세요.",
            });
        });

        it("매주 반복이면 요일 정보를 담아 생성한다", async () => {
            mocked(createWorkspaceRecurringTemplate).mockResolvedValue({
                status: 200, code: "OK", message: "생성했습니다.", data: { templateId: 1 },
            });

            const result = await createWorkspaceRecurringTemplateAction(
                1, buildFormData({ title: "템플릿", repeat: "WEEKLY3" }),
            );

            expect(createWorkspaceRecurringTemplate).toHaveBeenCalledWith(1, {
                title: "템플릿",
                recurrenceType: "WEEKLY",
                recurrenceRule: { daysOfWeek: [3] },
            });
            expect(result).toEqual({
                success: true, message: "생성했습니다.", data: { templateId: 1 },
            });
        });

        it("매월 반복이면 매월 1일 정보를 담아 생성한다", async () => {
            mocked(createWorkspaceRecurringTemplate).mockResolvedValue({
                status: 200, code: "OK", message: "생성했습니다.", data: { templateId: 2 },
            });

            const result = await createWorkspaceRecurringTemplateAction(
                1, buildFormData({ title: "템플릿", repeat: "MONTHLY" }),
            );

            expect(createWorkspaceRecurringTemplate).toHaveBeenCalledWith(1, {
                title: "템플릿",
                recurrenceType: "MONTHLY",
                recurrenceRule: { dayOfMonth: 1 },
            });
            expect(result.success).toBe(true);
        });

        it("생성이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
            mocked(createWorkspaceRecurringTemplate).mockRejectedValue(new Error("템플릿 생성 실패"));

            const result = await createWorkspaceRecurringTemplateAction(
                1, buildFormData({ title: "템플릿", repeat: "WEEKLY1" }),
            );

            expect(result).toEqual({ success: false, message: "템플릿 생성 실패" });
        });
    });

    describe("changeWorkspaceRecurringTemplateAction", () => {
        it("워크스페이스 또는 템플릿 번호가 올바르지 않으면 실패 결과를 반환한다", async () => {
            const result = await changeWorkspaceRecurringTemplateAction(
                0, 1, buildFormData({ title: "템플릿", repeat: "WEEKLY1" }),
            );

            expect(result).toEqual({
                success: false,
                message: "워크스페이스 또는 템플릿 번호가 올바르지 않습니다.",
            });
        });

        it("제목이 비어있으면 실패 결과를 반환한다", async () => {
            const result = await changeWorkspaceRecurringTemplateAction(
                1, 2, buildFormData({ title: "  ", repeat: "WEEKLY1" }),
            );

            expect(result).toEqual({
                success: false,
                message: "템플릿 제목은 1자 이상 200자 이하로 입력해주세요.",
            });
        });

        it("수정이 성공하면 결과를 반환한다", async () => {
            mocked(changeWorkspaceRecurringTemplate).mockResolvedValue({
                status: 200, code: "OK", message: "수정했습니다.",
                data: {
                    templateId: 2, title: "변경된 템플릿",
                    recurrenceType: "WEEKLY", recurrenceRule: { daysOfWeek: [2] },
                },
            });

            const result = await changeWorkspaceRecurringTemplateAction(
                1, 2, buildFormData({ title: "변경된 템플릿", repeat: "WEEKLY2" }),
            );

            expect(changeWorkspaceRecurringTemplate).toHaveBeenCalledWith(1, 2, {
                title: "변경된 템플릿",
                recurrenceType: "WEEKLY",
                recurrenceRule: { daysOfWeek: [2] },
            });
            expect(result.success).toBe(true);
        });

        it("수정이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
            mocked(changeWorkspaceRecurringTemplate).mockRejectedValue(new Error("템플릿 수정 실패"));

            const result = await changeWorkspaceRecurringTemplateAction(
                1, 2, buildFormData({ title: "템플릿", repeat: "WEEKLY1" }),
            );

            expect(result).toEqual({ success: false, message: "템플릿 수정 실패" });
        });
    });

    describe("deleteWorkspaceRecurringTemplateAction", () => {
        it("워크스페이스 또는 템플릿 번호가 올바르지 않으면 실패 결과를 반환한다", async () => {
            const result = await deleteWorkspaceRecurringTemplateAction(0, 1);

            expect(result).toEqual({
                success: false,
                message: "워크스페이스 또는 템플릿 번호가 올바르지 않습니다.",
            });
        });

        it("삭제가 성공하면 결과를 반환한다", async () => {
            mocked(deleteWorkspaceRecurringTemplate).mockResolvedValue({
                status: 200, code: "OK", message: "삭제했습니다.", data: null,
            });

            const result = await deleteWorkspaceRecurringTemplateAction(1, 2);

            expect(result).toEqual({ success: true, message: "삭제했습니다." });
        });

        it("삭제가 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
            mocked(deleteWorkspaceRecurringTemplate).mockRejectedValue(new Error("템플릿 삭제 실패"));

            const result = await deleteWorkspaceRecurringTemplateAction(1, 2);

            expect(result).toEqual({ success: false, message: "템플릿 삭제 실패" });
        });
    });
});
