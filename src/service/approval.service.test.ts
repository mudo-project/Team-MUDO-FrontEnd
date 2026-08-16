import { fetchWithAuth } from "../lib/fetch";
import { getErrorMessage } from "../lib/stateError";
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
} from "./approval.service";

jest.mock("../lib/fetch");
jest.mock("../lib/stateError");

const mockedFetch = fetchWithAuth as jest.Mock;
const mockedGetErrorMessage = getErrorMessage as jest.Mock;

// getErrorMessage는 실패 응답에서 서버 메시지 또는 fallback 문구를 추출하는 별도 유틸이므로
// 이 테스트에서는 각 service 함수가 올바른 endpoint/method/fallback 메시지로 호출하는지만 검증한다.
const failedResponse = { ok: false };

describe("getApprovalTemplateList", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("응답이 정상이면 템플릿 목록을 반환한다", async () => {
        const mockData = { status: 200, code: "OK", message: "", data: { content: [], page: 0, size: 20, hasNext: false } };
        mockedFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve(mockData) });

        const result = await getApprovalTemplateList(2);

        expect(mockedFetch).toHaveBeenCalledWith("/api/approval-templates?page=2");
        expect(result).toEqual(mockData);
    });

    it("페이지를 생략하면 0페이지를 조회한다", async () => {
        mockedFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({}) });

        await getApprovalTemplateList();

        expect(mockedFetch).toHaveBeenCalledWith("/api/approval-templates?page=0");
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failedResponse);
        mockedGetErrorMessage.mockResolvedValue("결재 템플릿 목록 조회 실패");

        await expect(getApprovalTemplateList()).rejects.toThrow("결재 템플릿 목록 조회 실패");
        expect(mockedGetErrorMessage).toHaveBeenCalledWith(failedResponse, "결재 템플릿 목록 조회에 실패했습니다.");
    });
});

describe("getApprovalTemplateDetail", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("응답이 정상이면 템플릿 상세를 반환한다", async () => {
        const mockData = { status: 200, code: "OK", message: "", data: { id: 1 } };
        mockedFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve(mockData) });

        const result = await getApprovalTemplateDetail(1);

        expect(mockedFetch).toHaveBeenCalledWith("/api/approval-templates/1");
        expect(result).toEqual(mockData);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failedResponse);
        mockedGetErrorMessage.mockResolvedValue("실패");

        await expect(getApprovalTemplateDetail(1)).rejects.toThrow("실패");
        expect(mockedGetErrorMessage).toHaveBeenCalledWith(failedResponse, "결재 템플릿 상세 조회에 실패했습니다.");
    });
});

describe("createApprovalTemplate", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("응답이 정상이면 생성된 템플릿 정보를 반환한다", async () => {
        const payload = { name: "휴가 신청서", approverIds: [1, 2] };
        const mockData = { status: 200, code: "OK", message: "", data: { templateId: 10 } };
        mockedFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve(mockData) });

        const result = await createApprovalTemplate(payload);

        expect(mockedFetch).toHaveBeenCalledWith("/api/approval-templates", {
            method: "POST",
            body: JSON.stringify(payload),
        });
        expect(result).toEqual(mockData);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failedResponse);
        mockedGetErrorMessage.mockResolvedValue("실패");

        await expect(createApprovalTemplate({ name: "휴가 신청서", approverIds: [1] })).rejects.toThrow("실패");
        expect(mockedGetErrorMessage).toHaveBeenCalledWith(failedResponse, "결재 템플릿 생성에 실패했습니다.");
    });
});

describe("changeApprovalTemplate", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("응답이 정상이면 반환값 없이 종료한다", async () => {
        const payload = { name: "변경된 이름", approverIds: [1] };
        mockedFetch.mockResolvedValue({ ok: true });

        const result = await changeApprovalTemplate(1, payload);

        expect(mockedFetch).toHaveBeenCalledWith("/api/approval-templates/1", {
            method: "PATCH",
            body: JSON.stringify(payload),
        });
        expect(result).toBeUndefined();
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failedResponse);
        mockedGetErrorMessage.mockResolvedValue("실패");

        await expect(changeApprovalTemplate(1, { name: "x", approverIds: [1] })).rejects.toThrow("실패");
        expect(mockedGetErrorMessage).toHaveBeenCalledWith(failedResponse, "결재 템플릿 수정에 실패했습니다.");
    });
});

describe("deleteApprovalTemplate", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("응답이 정상이면 반환값 없이 종료한다", async () => {
        mockedFetch.mockResolvedValue({ ok: true });

        const result = await deleteApprovalTemplate(1);

        expect(mockedFetch).toHaveBeenCalledWith("/api/approval-templates/1", { method: "DELETE" });
        expect(result).toBeUndefined();
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failedResponse);
        mockedGetErrorMessage.mockResolvedValue("실패");

        await expect(deleteApprovalTemplate(1)).rejects.toThrow("실패");
        expect(mockedGetErrorMessage).toHaveBeenCalledWith(failedResponse, "결재 템플릿 삭제에 실패했습니다.");
    });
});

describe("createApproval", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("응답이 정상이면 생성된 결재 문서 정보를 반환한다", async () => {
        const payload = { templateId: 1, title: "휴가 신청", contentType: "TEXT" as const, text: "내용" };
        const mockData = { status: 200, code: "OK", message: "", data: { documentId: 5 } };
        mockedFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve(mockData) });

        const result = await createApproval(payload);

        expect(mockedFetch).toHaveBeenCalledWith("/api/approvals", {
            method: "POST",
            body: JSON.stringify(payload),
        });
        expect(result).toEqual(mockData);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failedResponse);
        mockedGetErrorMessage.mockResolvedValue("실패");

        await expect(
            createApproval({ templateId: 1, title: "제목", contentType: "TEXT" }),
        ).rejects.toThrow("실패");
        expect(mockedGetErrorMessage).toHaveBeenCalledWith(failedResponse, "결재 신청에 실패했습니다.");
    });
});

describe("getAllApprovalList", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("응답이 정상이면 전체 결재 목록을 반환한다", async () => {
        const mockData = { status: 200, code: "OK", message: "", data: { content: [], page: 0, size: 20, hasNext: false } };
        mockedFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve(mockData) });

        const result = await getAllApprovalList(1);

        expect(mockedFetch).toHaveBeenCalledWith("/api/approvals?page=1");
        expect(result).toEqual(mockData);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failedResponse);
        mockedGetErrorMessage.mockResolvedValue("실패");

        await expect(getAllApprovalList()).rejects.toThrow("실패");
        expect(mockedGetErrorMessage).toHaveBeenCalledWith(failedResponse, "전체 결재 목록 조회에 실패했습니다.");
    });
});

describe("getSubmittedApprovalList", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("응답이 정상이면 내가 신청한 결재 목록을 반환한다", async () => {
        const mockData = { status: 200, code: "OK", message: "", data: { content: [], page: 0, size: 20, hasNext: false } };
        mockedFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve(mockData) });

        const result = await getSubmittedApprovalList(0);

        expect(mockedFetch).toHaveBeenCalledWith("/api/approvals/me/submitted?page=0");
        expect(result).toEqual(mockData);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failedResponse);
        mockedGetErrorMessage.mockResolvedValue("실패");

        await expect(getSubmittedApprovalList()).rejects.toThrow("실패");
        expect(mockedGetErrorMessage).toHaveBeenCalledWith(
            failedResponse,
            "내가 신청한 결재 목록 조회에 실패했습니다.",
        );
    });
});

describe("getReceivedApprovalList", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("응답이 정상이면 내게 온 결재 목록을 반환한다", async () => {
        const mockData = { status: 200, code: "OK", message: "", data: { content: [], page: 0, size: 20, hasNext: false } };
        mockedFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve(mockData) });

        const result = await getReceivedApprovalList(0);

        expect(mockedFetch).toHaveBeenCalledWith("/api/approvals/me?page=0");
        expect(result).toEqual(mockData);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failedResponse);
        mockedGetErrorMessage.mockResolvedValue("실패");

        await expect(getReceivedApprovalList()).rejects.toThrow("실패");
        expect(mockedGetErrorMessage).toHaveBeenCalledWith(failedResponse, "내게 온 결재 목록 조회에 실패했습니다.");
    });
});

describe("getApprovalHistory", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("응답이 정상이면 내 결재 이력을 반환한다", async () => {
        const mockData = { status: 200, code: "OK", message: "", data: { content: [], page: 0, size: 20, hasNext: false } };
        mockedFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve(mockData) });

        const result = await getApprovalHistory(0);

        expect(mockedFetch).toHaveBeenCalledWith("/api/approvals/me/history?page=0");
        expect(result).toEqual(mockData);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failedResponse);
        mockedGetErrorMessage.mockResolvedValue("실패");

        await expect(getApprovalHistory()).rejects.toThrow("실패");
        expect(mockedGetErrorMessage).toHaveBeenCalledWith(failedResponse, "내 결재 이력 조회에 실패했습니다.");
    });
});

describe("hideApprovalHistory", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("응답이 정상이면 반환값 없이 종료한다", async () => {
        mockedFetch.mockResolvedValue({ ok: true });

        const result = await hideApprovalHistory(3);

        expect(mockedFetch).toHaveBeenCalledWith("/api/approvals/me/history/3", { method: "DELETE" });
        expect(result).toBeUndefined();
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failedResponse);
        mockedGetErrorMessage.mockResolvedValue("실패");

        await expect(hideApprovalHistory(3)).rejects.toThrow("실패");
        expect(mockedGetErrorMessage).toHaveBeenCalledWith(failedResponse, "내 결재 이력 삭제에 실패했습니다.");
    });
});

describe("getApprovalDetail", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("응답이 정상이면 결재 상세를 반환한다", async () => {
        const mockData = { status: 200, code: "OK", message: "", data: { id: 1 } };
        mockedFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve(mockData) });

        const result = await getApprovalDetail(1);

        expect(mockedFetch).toHaveBeenCalledWith("/api/approvals/1");
        expect(result).toEqual(mockData);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failedResponse);
        mockedGetErrorMessage.mockResolvedValue("실패");

        await expect(getApprovalDetail(1)).rejects.toThrow("실패");
        expect(mockedGetErrorMessage).toHaveBeenCalledWith(failedResponse, "결재 상세 조회에 실패했습니다.");
    });
});

describe("changeApprovalLines", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("응답이 정상이면 반환값 없이 종료한다", async () => {
        const payload = { approverIds: [1, 2] };
        mockedFetch.mockResolvedValue({ ok: true });

        const result = await changeApprovalLines(1, payload);

        expect(mockedFetch).toHaveBeenCalledWith("/api/approvals/1/lines", {
            method: "PATCH",
            body: JSON.stringify(payload),
        });
        expect(result).toBeUndefined();
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failedResponse);
        mockedGetErrorMessage.mockResolvedValue("실패");

        await expect(changeApprovalLines(1, { approverIds: [1] })).rejects.toThrow("실패");
        expect(mockedGetErrorMessage).toHaveBeenCalledWith(failedResponse, "결재선 수정에 실패했습니다.");
    });
});

describe("decideApproval", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("응답이 정상이면 반환값 없이 종료한다", async () => {
        const payload = { decision: "APPROVE" as const, comment: "승인합니다" };
        mockedFetch.mockResolvedValue({ ok: true });

        const result = await decideApproval(1, payload);

        expect(mockedFetch).toHaveBeenCalledWith("/api/approvals/1/decide", {
            method: "POST",
            body: JSON.stringify(payload),
        });
        expect(result).toBeUndefined();
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failedResponse);
        mockedGetErrorMessage.mockResolvedValue("실패");

        await expect(decideApproval(1, { decision: "REJECT" })).rejects.toThrow("실패");
        expect(mockedGetErrorMessage).toHaveBeenCalledWith(failedResponse, "결재 승인/반려에 실패했습니다.");
    });
});

describe("cancelApproval", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("응답이 정상이면 반환값 없이 종료한다", async () => {
        mockedFetch.mockResolvedValue({ ok: true });

        const result = await cancelApproval(1);

        expect(mockedFetch).toHaveBeenCalledWith("/api/approvals/1/cancel", { method: "POST" });
        expect(result).toBeUndefined();
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failedResponse);
        mockedGetErrorMessage.mockResolvedValue("실패");

        await expect(cancelApproval(1)).rejects.toThrow("실패");
        expect(mockedGetErrorMessage).toHaveBeenCalledWith(failedResponse, "결재 신청 취소에 실패했습니다.");
    });
});

describe("resubmitApproval", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("응답이 정상이면 재상신된 결재 문서 정보를 반환한다", async () => {
        const mockData = { status: 200, code: "OK", message: "", data: { documentId: 2 } };
        mockedFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve(mockData) });

        const result = await resubmitApproval(1);

        expect(mockedFetch).toHaveBeenCalledWith("/api/approvals/1/resubmit", { method: "POST" });
        expect(result).toEqual(mockData);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failedResponse);
        mockedGetErrorMessage.mockResolvedValue("실패");

        await expect(resubmitApproval(1)).rejects.toThrow("실패");
        expect(mockedGetErrorMessage).toHaveBeenCalledWith(failedResponse, "결재 재상신에 실패했습니다.");
    });
});

describe("getApprovalPendingCount", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("응답이 정상이면 대기 건수를 반환한다", async () => {
        const mockData = { status: 200, code: "OK", message: "", data: { count: 3 } };
        mockedFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve(mockData) });

        const result = await getApprovalPendingCount();

        expect(mockedFetch).toHaveBeenCalledWith("/api/approvals/me/pending-count");
        expect(result).toEqual(mockData);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failedResponse);
        mockedGetErrorMessage.mockResolvedValue("실패");

        await expect(getApprovalPendingCount()).rejects.toThrow("실패");
        expect(mockedGetErrorMessage).toHaveBeenCalledWith(failedResponse, "결재 대기 건수 조회에 실패했습니다.");
    });
});

describe("summarizeApprovalAttachment", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("응답이 정상이면 요약 결과를 반환한다", async () => {
        const mockData = {
            status: 200,
            code: "OK",
            message: "",
            data: { fileId: 1, aiSummary: "요약", summaryStatus: "COMPLETED", summarizedAt: "2026-08-16" },
        };
        mockedFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve(mockData) });

        const result = await summarizeApprovalAttachment(1, 2);

        expect(mockedFetch).toHaveBeenCalledWith("/api/approvals/1/attachments/2/summarize", { method: "POST" });
        expect(result).toEqual(mockData);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failedResponse);
        mockedGetErrorMessage.mockResolvedValue("실패");

        await expect(summarizeApprovalAttachment(1, 2)).rejects.toThrow("실패");
        expect(mockedGetErrorMessage).toHaveBeenCalledWith(failedResponse, "첨부파일 요약 생성에 실패했습니다.");
    });
});

describe("getApprovalAttachmentDownloadUrl", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("응답이 정상이면 다운로드 URL을 반환한다", async () => {
        const mockData = { status: 200, code: "OK", message: "", data: { downloadUrl: "https://example.com/file" } };
        mockedFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve(mockData) });

        const result = await getApprovalAttachmentDownloadUrl(1, 2);

        expect(mockedFetch).toHaveBeenCalledWith("/api/approvals/1/attachments/2/download-url");
        expect(result).toEqual(mockData);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failedResponse);
        mockedGetErrorMessage.mockResolvedValue("실패");

        await expect(getApprovalAttachmentDownloadUrl(1, 2)).rejects.toThrow("실패");
        expect(mockedGetErrorMessage).toHaveBeenCalledWith(
            failedResponse,
            "결재 첨부파일 다운로드 URL 조회에 실패했습니다.",
        );
    });
});
