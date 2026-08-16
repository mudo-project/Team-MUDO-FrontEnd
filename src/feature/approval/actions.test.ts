import {
    cancelApproval,
    changeApprovalLines,
    changeApprovalTemplate,
    createApproval,
    createApprovalTemplate,
    decideApproval,
    deleteApprovalTemplate,
    getAllApprovalList,
    getApprovalAttachmentDownloadUrl,
    getApprovalDetail,
    getApprovalHistory,
    getApprovalPendingCount,
    getApprovalTemplateDetail,
    getApprovalTemplateList,
    getReceivedApprovalList,
    getSubmittedApprovalList,
    hideApprovalHistory,
    resubmitApproval,
    summarizeApprovalAttachment,
} from "../../service/approval.service";
import {
    cancelApprovalAction,
    changeApprovalLinesAction,
    changeApprovalTemplateAction,
    createApprovalAction,
    createApprovalTemplateAction,
    decideApprovalAction,
    deleteApprovalTemplateAction,
    getAllApprovalListAction,
    getApprovalAttachmentDownloadUrlAction,
    getApprovalDetailAction,
    getApprovalHistoryAction,
    getApprovalPendingCountAction,
    getApprovalTemplateDetailAction,
    getApprovalTemplateListAction,
    getReceivedApprovalListAction,
    getSubmittedApprovalListAction,
    hideApprovalHistoryAction,
    resubmitApprovalAction,
    summarizeApprovalAttachmentAction,
} from "./actions";

jest.mock("../../service/approval.service");

const mockedGetApprovalTemplateList = getApprovalTemplateList as jest.Mock;
const mockedGetApprovalTemplateDetail = getApprovalTemplateDetail as jest.Mock;
const mockedCreateApprovalTemplate = createApprovalTemplate as jest.Mock;
const mockedChangeApprovalTemplate = changeApprovalTemplate as jest.Mock;
const mockedDeleteApprovalTemplate = deleteApprovalTemplate as jest.Mock;
const mockedCreateApproval = createApproval as jest.Mock;
const mockedGetAllApprovalList = getAllApprovalList as jest.Mock;
const mockedGetSubmittedApprovalList = getSubmittedApprovalList as jest.Mock;
const mockedGetReceivedApprovalList = getReceivedApprovalList as jest.Mock;
const mockedGetApprovalHistory = getApprovalHistory as jest.Mock;
const mockedHideApprovalHistory = hideApprovalHistory as jest.Mock;
const mockedGetApprovalDetail = getApprovalDetail as jest.Mock;
const mockedChangeApprovalLines = changeApprovalLines as jest.Mock;
const mockedDecideApproval = decideApproval as jest.Mock;
const mockedCancelApproval = cancelApproval as jest.Mock;
const mockedResubmitApproval = resubmitApproval as jest.Mock;
const mockedGetApprovalPendingCount = getApprovalPendingCount as jest.Mock;
const mockedSummarizeApprovalAttachment = summarizeApprovalAttachment as jest.Mock;
const mockedGetApprovalAttachmentDownloadUrl = getApprovalAttachmentDownloadUrl as jest.Mock;

const buildFormData = (fields: Record<string, string | string[]>) => {
    const formData = new FormData();
    Object.entries(fields).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            value.forEach((item) => formData.append(key, item));
        } else {
            formData.append(key, value);
        }
    });
    return formData;
};

afterEach(() => {
    jest.clearAllMocks();
});

describe("getApprovalTemplateListAction", () => {
    it("페이지 번호가 음수이면 실패 결과를 반환한다", async () => {
        const result = await getApprovalTemplateListAction(-1);

        expect(result).toEqual({ success: false, message: "페이지 번호가 올바르지 않습니다." });
        expect(mockedGetApprovalTemplateList).not.toHaveBeenCalled();
    });

    it("조회가 성공하면 성공 결과를 반환한다", async () => {
        mockedGetApprovalTemplateList.mockResolvedValue({
            status: 200,
            code: "OK",
            message: "조회했습니다.",
            data: { content: [], page: 0, size: 20, hasNext: false },
        });

        const result = await getApprovalTemplateListAction(0);

        expect(mockedGetApprovalTemplateList).toHaveBeenCalledWith(0);
        expect(result).toEqual({
            success: true,
            message: "조회했습니다.",
            data: { content: [], page: 0, size: 20, hasNext: false },
        });
    });

    it("조회가 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        mockedGetApprovalTemplateList.mockRejectedValue(new Error("목록 조회에 실패했습니다."));

        const result = await getApprovalTemplateListAction(0);

        expect(result).toEqual({ success: false, message: "목록 조회에 실패했습니다." });
    });

    it("Error가 아닌 값으로 실패하면 기본 메시지를 담아 실패 결과를 반환한다", async () => {
        mockedGetApprovalTemplateList.mockRejectedValue("문자열 에러");

        const result = await getApprovalTemplateListAction(0);

        expect(result).toEqual({ success: false, message: "결재 템플릿 목록 조회에 실패했습니다." });
    });
});

describe("getApprovalTemplateDetailAction", () => {
    it("ID가 양의 정수가 아니면 실패 결과를 반환한다", async () => {
        const result = await getApprovalTemplateDetailAction(0);

        expect(result).toEqual({ success: false, message: "ID가 올바르지 않습니다." });
        expect(mockedGetApprovalTemplateDetail).not.toHaveBeenCalled();
    });

    it("조회가 성공하면 성공 결과를 반환한다", async () => {
        mockedGetApprovalTemplateDetail.mockResolvedValue({
            status: 200,
            code: "OK",
            message: "조회했습니다.",
            data: { id: 1, name: "휴가", createdAt: "2026-08-16", lines: [], creatorId: 1 },
        });

        const result = await getApprovalTemplateDetailAction(1);

        expect(mockedGetApprovalTemplateDetail).toHaveBeenCalledWith(1);
        expect(result.success).toBe(true);
    });

    it("조회가 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        mockedGetApprovalTemplateDetail.mockRejectedValue(new Error("상세 조회 실패"));

        const result = await getApprovalTemplateDetailAction(1);

        expect(result).toEqual({ success: false, message: "상세 조회 실패" });
    });
});

describe("createApprovalTemplateAction", () => {
    const prevState = { success: false, message: "", data: undefined };

    it("템플릿 이름이 비어있으면 실패 결과를 반환한다", async () => {
        const formData = buildFormData({ name: "   ", approverIds: ["1"] });

        const result = await createApprovalTemplateAction(prevState, formData);

        expect(result).toEqual({ success: false, message: "템플릿 이름을 입력해 주세요." });
        expect(mockedCreateApprovalTemplate).not.toHaveBeenCalled();
    });

    it("결재자를 선택하지 않으면 실패 결과를 반환한다", async () => {
        const formData = buildFormData({ name: "휴가 신청서" });

        const result = await createApprovalTemplateAction(prevState, formData);

        expect(result).toEqual({ success: false, message: "결재자를 한 명 이상 선택해 주세요." });
        expect(mockedCreateApprovalTemplate).not.toHaveBeenCalled();
    });

    it("결재자 ID에 양의 정수가 아닌 값이 있으면 실패 결과를 반환한다", async () => {
        const formData = buildFormData({ name: "휴가 신청서", approverIds: ["1", "abc"] });

        const result = await createApprovalTemplateAction(prevState, formData);

        expect(result).toEqual({ success: false, message: "결재자를 한 명 이상 선택해 주세요." });
    });

    it("생성이 성공하면 성공 결과를 반환한다", async () => {
        mockedCreateApprovalTemplate.mockResolvedValue({
            status: 200,
            code: "OK",
            message: "템플릿을 생성했습니다.",
            data: { templateId: 10 },
        });
        const formData = buildFormData({ name: "휴가 신청서", approverIds: ["1", "2"] });

        const result = await createApprovalTemplateAction(prevState, formData);

        expect(mockedCreateApprovalTemplate).toHaveBeenCalledWith({ name: "휴가 신청서", approverIds: ["1", "2"] });
        expect(result).toEqual({ success: true, message: "템플릿을 생성했습니다.", data: { templateId: 10 } });
    });

    it("생성이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        mockedCreateApprovalTemplate.mockRejectedValue(new Error("생성 실패"));
        const formData = buildFormData({ name: "휴가 신청서", approverIds: ["1"] });

        const result = await createApprovalTemplateAction(prevState, formData);

        expect(result).toEqual({ success: false, message: "생성 실패" });
    });
});

describe("changeApprovalTemplateAction", () => {
    const prevState = { success: false, message: "" };

    it("ID가 양의 정수가 아니면 실패 결과를 반환한다", async () => {
        const formData = buildFormData({ name: "휴가 신청서", approverIds: ["1"] });

        const result = await changeApprovalTemplateAction(0, prevState, formData);

        expect(result).toEqual({ success: false, message: "ID가 올바르지 않습니다." });
        expect(mockedChangeApprovalTemplate).not.toHaveBeenCalled();
    });

    it("템플릿 이름이 없으면 실패 결과를 반환한다", async () => {
        const formData = buildFormData({ approverIds: ["1"] });

        const result = await changeApprovalTemplateAction(1, prevState, formData);

        expect(result).toEqual({ success: false, message: "템플릿 이름을 입력해 주세요." });
    });

    it("결재자를 선택하지 않으면 실패 결과를 반환한다", async () => {
        const formData = buildFormData({ name: "휴가 신청서" });

        const result = await changeApprovalTemplateAction(1, prevState, formData);

        expect(result).toEqual({ success: false, message: "결재자를 한 명 이상 선택해 주세요." });
    });

    it("수정이 성공하면 성공 결과를 반환한다", async () => {
        mockedChangeApprovalTemplate.mockResolvedValue(undefined);
        const formData = buildFormData({ name: "변경된 이름", approverIds: ["1", "2"] });

        const result = await changeApprovalTemplateAction(1, prevState, formData);

        expect(mockedChangeApprovalTemplate).toHaveBeenCalledWith(1, { name: "변경된 이름", approverIds: ["1", "2"] });
        expect(result).toEqual({ success: true, message: "결재 템플릿을 수정했습니다." });
    });

    it("수정이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        mockedChangeApprovalTemplate.mockRejectedValue(new Error("수정 실패"));
        const formData = buildFormData({ name: "변경된 이름", approverIds: ["1"] });

        const result = await changeApprovalTemplateAction(1, prevState, formData);

        expect(result).toEqual({ success: false, message: "수정 실패" });
    });
});

describe("deleteApprovalTemplateAction", () => {
    it("ID가 양의 정수가 아니면 실패 결과를 반환한다", async () => {
        const result = await deleteApprovalTemplateAction(-1);

        expect(result).toEqual({ success: false, message: "ID가 올바르지 않습니다." });
        expect(mockedDeleteApprovalTemplate).not.toHaveBeenCalled();
    });

    it("삭제가 성공하면 성공 결과를 반환한다", async () => {
        mockedDeleteApprovalTemplate.mockResolvedValue(undefined);

        const result = await deleteApprovalTemplateAction(1);

        expect(mockedDeleteApprovalTemplate).toHaveBeenCalledWith(1);
        expect(result).toEqual({ success: true, message: "결재 템플릿을 삭제했습니다." });
    });

    it("삭제가 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        mockedDeleteApprovalTemplate.mockRejectedValue(new Error("삭제 실패"));

        const result = await deleteApprovalTemplateAction(1);

        expect(result).toEqual({ success: false, message: "삭제 실패" });
    });
});

describe("createApprovalAction", () => {
    const basePayload = {
        templateId: 1,
        title: "휴가 신청",
        contentType: "TEXT" as const,
        text: "내용입니다",
    };

    it("템플릿 ID가 양의 정수가 아니면 실패 결과를 반환한다", async () => {
        const result = await createApprovalAction({ ...basePayload, templateId: 0 });

        expect(result).toEqual({ success: false, message: "ID가 올바르지 않습니다." });
        expect(mockedCreateApproval).not.toHaveBeenCalled();
    });

    it("제목이 비어있으면 실패 결과를 반환한다", async () => {
        const result = await createApprovalAction({ ...basePayload, title: "   " });

        expect(result).toEqual({ success: false, message: "결재 제목을 입력해 주세요." });
    });

    it("TEXT 유형인데 내용이 없으면 실패 결과를 반환한다", async () => {
        const result = await createApprovalAction({ ...basePayload, text: "  " });

        expect(result).toEqual({ success: false, message: "결재 내용을 입력해 주세요." });
    });

    it("첨부파일 ID에 양의 정수가 아닌 값이 있으면 실패 결과를 반환한다", async () => {
        const result = await createApprovalAction({ ...basePayload, fileIds: [1, -1] });

        expect(result).toEqual({ success: false, message: "첨부파일 ID가 올바르지 않습니다." });
    });

    it("결재자 ID에 양의 정수가 아닌 값이 있으면 실패 결과를 반환한다", async () => {
        const result = await createApprovalAction({ ...basePayload, approverIds: [1, 0] });

        expect(result).toEqual({ success: false, message: "결재자 ID가 올바르지 않습니다." });
    });

    it("휴가 시작일만 입력하면 실패 결과를 반환한다", async () => {
        const result = await createApprovalAction({ ...basePayload, leaveStartDate: "2026-08-16" });

        expect(result).toEqual({ success: false, message: "휴가 기간이 올바르지 않습니다." });
    });

    it("휴가 날짜 형식이 올바르지 않으면 실패 결과를 반환한다", async () => {
        const result = await createApprovalAction({
            ...basePayload,
            leaveStartDate: "2026/08/16",
            leaveEndDate: "2026-08-17",
        });

        expect(result).toEqual({ success: false, message: "휴가 기간이 올바르지 않습니다." });
    });

    it("휴가 종료일이 시작일보다 빠르면 실패 결과를 반환한다", async () => {
        const result = await createApprovalAction({
            ...basePayload,
            leaveStartDate: "2026-08-17",
            leaveEndDate: "2026-08-16",
        });

        expect(result).toEqual({ success: false, message: "휴가 기간이 올바르지 않습니다." });
    });

    it("신청이 성공하면 성공 결과를 반환한다", async () => {
        mockedCreateApproval.mockResolvedValue({
            status: 200,
            code: "OK",
            message: "결재를 신청했습니다.",
            data: { documentId: 7 },
        });

        const result = await createApprovalAction({ ...basePayload, title: " 휴가 신청 ", text: " 내용입니다 " });

        expect(mockedCreateApproval).toHaveBeenCalledWith({
            ...basePayload,
            title: "휴가 신청",
            text: "내용입니다",
        });
        expect(result).toEqual({ success: true, message: "결재를 신청했습니다.", data: { documentId: 7 } });
    });

    it("신청이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        mockedCreateApproval.mockRejectedValue(new Error("신청 실패"));

        const result = await createApprovalAction(basePayload);

        expect(result).toEqual({ success: false, message: "신청 실패" });
    });
});

describe("getAllApprovalListAction", () => {
    it("페이지 번호가 정수가 아니면 실패 결과를 반환한다", async () => {
        const result = await getAllApprovalListAction(1.5);

        expect(result).toEqual({ success: false, message: "페이지 번호가 올바르지 않습니다." });
        expect(mockedGetAllApprovalList).not.toHaveBeenCalled();
    });

    it("조회가 성공하면 성공 결과를 반환한다", async () => {
        mockedGetAllApprovalList.mockResolvedValue({
            status: 200,
            code: "OK",
            message: "조회했습니다.",
            data: { content: [], page: 0, size: 20, hasNext: false },
        });

        const result = await getAllApprovalListAction(0);

        expect(mockedGetAllApprovalList).toHaveBeenCalledWith(0);
        expect(result.success).toBe(true);
    });

    it("조회가 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        mockedGetAllApprovalList.mockRejectedValue(new Error("전체 목록 조회 실패"));

        const result = await getAllApprovalListAction(0);

        expect(result).toEqual({ success: false, message: "전체 목록 조회 실패" });
    });
});

describe("getSubmittedApprovalListAction", () => {
    it("페이지 번호가 음수이면 실패 결과를 반환한다", async () => {
        const result = await getSubmittedApprovalListAction(-1);

        expect(result).toEqual({ success: false, message: "페이지 번호가 올바르지 않습니다." });
        expect(mockedGetSubmittedApprovalList).not.toHaveBeenCalled();
    });

    it("조회가 성공하면 성공 결과를 반환한다", async () => {
        mockedGetSubmittedApprovalList.mockResolvedValue({
            status: 200,
            code: "OK",
            message: "조회했습니다.",
            data: { content: [], page: 0, size: 20, hasNext: false },
        });

        const result = await getSubmittedApprovalListAction(0);

        expect(mockedGetSubmittedApprovalList).toHaveBeenCalledWith(0);
        expect(result.success).toBe(true);
    });

    it("조회가 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        mockedGetSubmittedApprovalList.mockRejectedValue(new Error("실패"));

        const result = await getSubmittedApprovalListAction(0);

        expect(result).toEqual({ success: false, message: "실패" });
    });
});

describe("getReceivedApprovalListAction", () => {
    it("페이지 번호가 음수이면 실패 결과를 반환한다", async () => {
        const result = await getReceivedApprovalListAction(-1);

        expect(result).toEqual({ success: false, message: "페이지 번호가 올바르지 않습니다." });
        expect(mockedGetReceivedApprovalList).not.toHaveBeenCalled();
    });

    it("조회가 성공하면 성공 결과를 반환한다", async () => {
        mockedGetReceivedApprovalList.mockResolvedValue({
            status: 200,
            code: "OK",
            message: "조회했습니다.",
            data: { content: [], page: 0, size: 20, hasNext: false },
        });

        const result = await getReceivedApprovalListAction(0);

        expect(mockedGetReceivedApprovalList).toHaveBeenCalledWith(0);
        expect(result.success).toBe(true);
    });

    it("조회가 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        mockedGetReceivedApprovalList.mockRejectedValue(new Error("실패"));

        const result = await getReceivedApprovalListAction(0);

        expect(result).toEqual({ success: false, message: "실패" });
    });
});

describe("getApprovalHistoryAction", () => {
    it("페이지 번호가 음수이면 실패 결과를 반환한다", async () => {
        const result = await getApprovalHistoryAction(-1);

        expect(result).toEqual({ success: false, message: "페이지 번호가 올바르지 않습니다." });
        expect(mockedGetApprovalHistory).not.toHaveBeenCalled();
    });

    it("조회가 성공하면 성공 결과를 반환한다", async () => {
        mockedGetApprovalHistory.mockResolvedValue({
            status: 200,
            code: "OK",
            message: "조회했습니다.",
            data: { content: [], page: 0, size: 20, hasNext: false },
        });

        const result = await getApprovalHistoryAction(0);

        expect(mockedGetApprovalHistory).toHaveBeenCalledWith(0);
        expect(result.success).toBe(true);
    });

    it("조회가 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        mockedGetApprovalHistory.mockRejectedValue(new Error("실패"));

        const result = await getApprovalHistoryAction(0);

        expect(result).toEqual({ success: false, message: "실패" });
    });
});

describe("hideApprovalHistoryAction", () => {
    it("ID가 양의 정수가 아니면 실패 결과를 반환한다", async () => {
        const result = await hideApprovalHistoryAction(0);

        expect(result).toEqual({ success: false, message: "ID가 올바르지 않습니다." });
        expect(mockedHideApprovalHistory).not.toHaveBeenCalled();
    });

    it("삭제가 성공하면 성공 결과를 반환한다", async () => {
        mockedHideApprovalHistory.mockResolvedValue(undefined);

        const result = await hideApprovalHistoryAction(1);

        expect(mockedHideApprovalHistory).toHaveBeenCalledWith(1);
        expect(result).toEqual({ success: true, message: "내 결재 이력에서 삭제했습니다." });
    });

    it("삭제가 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        mockedHideApprovalHistory.mockRejectedValue(new Error("실패"));

        const result = await hideApprovalHistoryAction(1);

        expect(result).toEqual({ success: false, message: "실패" });
    });
});

describe("getApprovalDetailAction", () => {
    it("ID가 양의 정수가 아니면 실패 결과를 반환한다", async () => {
        const result = await getApprovalDetailAction(-1);

        expect(result).toEqual({ success: false, message: "ID가 올바르지 않습니다." });
        expect(mockedGetApprovalDetail).not.toHaveBeenCalled();
    });

    it("조회가 성공하면 성공 결과를 반환한다", async () => {
        mockedGetApprovalDetail.mockResolvedValue({
            status: 200,
            code: "OK",
            message: "조회했습니다.",
            data: { id: 1 },
        });

        const result = await getApprovalDetailAction(1);

        expect(mockedGetApprovalDetail).toHaveBeenCalledWith(1);
        expect(result.success).toBe(true);
    });

    it("조회가 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        mockedGetApprovalDetail.mockRejectedValue(new Error("실패"));

        const result = await getApprovalDetailAction(1);

        expect(result).toEqual({ success: false, message: "실패" });
    });
});

describe("changeApprovalLinesAction", () => {
    it("ID가 양의 정수가 아니면 실패 결과를 반환한다", async () => {
        const result = await changeApprovalLinesAction(0, { approverIds: [1] });

        expect(result).toEqual({ success: false, message: "ID가 올바르지 않습니다." });
        expect(mockedChangeApprovalLines).not.toHaveBeenCalled();
    });

    it("결재자가 없으면 실패 결과를 반환한다", async () => {
        const result = await changeApprovalLinesAction(1, { approverIds: [] });

        expect(result).toEqual({ success: false, message: "결재자를 한 명 이상 선택해 주세요." });
        expect(mockedChangeApprovalLines).not.toHaveBeenCalled();
    });

    it("결재자 ID에 양의 정수가 아닌 값이 있으면 실패 결과를 반환한다", async () => {
        const result = await changeApprovalLinesAction(1, { approverIds: [1, -2] });

        expect(result).toEqual({ success: false, message: "결재자를 한 명 이상 선택해 주세요." });
    });

    it("수정이 성공하면 성공 결과를 반환한다", async () => {
        mockedChangeApprovalLines.mockResolvedValue(undefined);

        const result = await changeApprovalLinesAction(1, { approverIds: [1, 2] });

        expect(mockedChangeApprovalLines).toHaveBeenCalledWith(1, { approverIds: [1, 2] });
        expect(result).toEqual({ success: true, message: "결재선을 수정했습니다." });
    });

    it("수정이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        mockedChangeApprovalLines.mockRejectedValue(new Error("실패"));

        const result = await changeApprovalLinesAction(1, { approverIds: [1] });

        expect(result).toEqual({ success: false, message: "실패" });
    });
});

describe("decideApprovalAction", () => {
    it("ID가 양의 정수가 아니면 실패 결과를 반환한다", async () => {
        const result = await decideApprovalAction(0, { decision: "APPROVE" });

        expect(result).toEqual({ success: false, message: "ID가 올바르지 않습니다." });
        expect(mockedDecideApproval).not.toHaveBeenCalled();
    });

    it("처리가 성공하면 성공 결과를 반환하고 사유의 공백을 제거해 전달한다", async () => {
        mockedDecideApproval.mockResolvedValue(undefined);

        const result = await decideApprovalAction(1, { decision: "APPROVE", comment: "  승인합니다  " });

        expect(mockedDecideApproval).toHaveBeenCalledWith(1, { decision: "APPROVE", comment: "승인합니다" });
        expect(result).toEqual({ success: true, message: "결재를 처리했습니다." });
    });

    it("사유가 공백뿐이면 undefined로 전달한다", async () => {
        mockedDecideApproval.mockResolvedValue(undefined);

        await decideApprovalAction(1, { decision: "REJECT", comment: "   " });

        expect(mockedDecideApproval).toHaveBeenCalledWith(1, { decision: "REJECT", comment: undefined });
    });

    it("처리가 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        mockedDecideApproval.mockRejectedValue(new Error("실패"));

        const result = await decideApprovalAction(1, { decision: "APPROVE" });

        expect(result).toEqual({ success: false, message: "실패" });
    });
});

describe("cancelApprovalAction", () => {
    it("ID가 양의 정수가 아니면 실패 결과를 반환한다", async () => {
        const result = await cancelApprovalAction(-1);

        expect(result).toEqual({ success: false, message: "ID가 올바르지 않습니다." });
        expect(mockedCancelApproval).not.toHaveBeenCalled();
    });

    it("취소가 성공하면 성공 결과를 반환한다", async () => {
        mockedCancelApproval.mockResolvedValue(undefined);

        const result = await cancelApprovalAction(1);

        expect(mockedCancelApproval).toHaveBeenCalledWith(1);
        expect(result).toEqual({ success: true, message: "결재 신청을 취소했습니다." });
    });

    it("취소가 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        mockedCancelApproval.mockRejectedValue(new Error("실패"));

        const result = await cancelApprovalAction(1);

        expect(result).toEqual({ success: false, message: "실패" });
    });
});

describe("resubmitApprovalAction", () => {
    it("ID가 양의 정수가 아니면 실패 결과를 반환한다", async () => {
        const result = await resubmitApprovalAction(0);

        expect(result).toEqual({ success: false, message: "ID가 올바르지 않습니다." });
        expect(mockedResubmitApproval).not.toHaveBeenCalled();
    });

    it("재상신이 성공하면 성공 결과를 반환한다", async () => {
        mockedResubmitApproval.mockResolvedValue({
            status: 200,
            code: "OK",
            message: "재상신했습니다.",
            data: { documentId: 9 },
        });

        const result = await resubmitApprovalAction(1);

        expect(mockedResubmitApproval).toHaveBeenCalledWith(1);
        expect(result).toEqual({ success: true, message: "재상신했습니다.", data: { documentId: 9 } });
    });

    it("재상신이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        mockedResubmitApproval.mockRejectedValue(new Error("실패"));

        const result = await resubmitApprovalAction(1);

        expect(result).toEqual({ success: false, message: "실패" });
    });
});

describe("getApprovalPendingCountAction", () => {
    it("조회가 성공하면 성공 결과를 반환한다", async () => {
        mockedGetApprovalPendingCount.mockResolvedValue({
            status: 200,
            code: "OK",
            message: "조회했습니다.",
            data: { count: 4 },
        });

        const result = await getApprovalPendingCountAction();

        expect(result).toEqual({ success: true, message: "조회했습니다.", data: { count: 4 } });
    });

    it("조회가 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        mockedGetApprovalPendingCount.mockRejectedValue(new Error("실패"));

        const result = await getApprovalPendingCountAction();

        expect(result).toEqual({ success: false, message: "실패" });
    });
});

describe("summarizeApprovalAttachmentAction", () => {
    it("ID가 양의 정수가 아니면 실패 결과를 반환한다", async () => {
        const result = await summarizeApprovalAttachmentAction(0, 1);

        expect(result).toEqual({ success: false, message: "ID가 올바르지 않습니다." });
        expect(mockedSummarizeApprovalAttachment).not.toHaveBeenCalled();
    });

    it("생성이 성공하면 성공 결과를 반환한다", async () => {
        mockedSummarizeApprovalAttachment.mockResolvedValue({
            status: 200,
            code: "OK",
            message: "요약을 생성했습니다.",
            data: { fileId: 1, aiSummary: "요약", summaryStatus: "COMPLETED", summarizedAt: "2026-08-16" },
        });

        const result = await summarizeApprovalAttachmentAction(1, 1);

        expect(mockedSummarizeApprovalAttachment).toHaveBeenCalledWith(1, 1);
        expect(result.success).toBe(true);
    });

    it("생성이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        mockedSummarizeApprovalAttachment.mockRejectedValue(new Error("실패"));

        const result = await summarizeApprovalAttachmentAction(1, 1);

        expect(result).toEqual({ success: false, message: "실패" });
    });
});

describe("getApprovalAttachmentDownloadUrlAction", () => {
    it("ID가 양의 정수가 아니면 실패 결과를 반환한다", async () => {
        const result = await getApprovalAttachmentDownloadUrlAction(0, 1);

        expect(result).toEqual({ success: false, message: "결재 문서 또는 첨부파일 ID가 올바르지 않습니다." });
        expect(mockedGetApprovalAttachmentDownloadUrl).not.toHaveBeenCalled();
    });

    it("조회가 성공하면 성공 결과를 반환한다", async () => {
        mockedGetApprovalAttachmentDownloadUrl.mockResolvedValue({
            status: 200,
            code: "OK",
            message: "조회했습니다.",
            data: { downloadUrl: "https://example.com/file" },
        });

        const result = await getApprovalAttachmentDownloadUrlAction(1, 1);

        expect(mockedGetApprovalAttachmentDownloadUrl).toHaveBeenCalledWith(1, 1);
        expect(result.success).toBe(true);
    });

    it("조회가 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        mockedGetApprovalAttachmentDownloadUrl.mockRejectedValue(new Error("실패"));

        const result = await getApprovalAttachmentDownloadUrlAction(1, 1);

        expect(result).toEqual({ success: false, message: "실패" });
    });
});
