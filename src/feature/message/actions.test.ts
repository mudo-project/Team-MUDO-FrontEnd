import {
    changeMessageTemplate,
    createMessageTemplate,
    deleteMessageTemplate,
    getMessageTemplateList,
} from "../../service/message.service";
import {
    changeMessageTemplateAction,
    createMessageTemplateAction,
    deleteMessageTemplateAction,
    getMessageTemplateListAction,
} from "./actions";

jest.mock("../../service/message.service");

const mockedGetMessageTemplateList = getMessageTemplateList as jest.Mock;
const mockedCreateMessageTemplate = createMessageTemplate as jest.Mock;
const mockedChangeMessageTemplate = changeMessageTemplate as jest.Mock;
const mockedDeleteMessageTemplate = deleteMessageTemplate as jest.Mock;

const buildFormData = (fields: Record<string, string>) => {
    const formData = new FormData();
    Object.entries(fields).forEach(([key, value]) => formData.append(key, value));
    return formData;
};

const emptyState = { success: false, message: "" };

afterEach(() => {
    jest.clearAllMocks();
});

describe("getMessageTemplateListAction", () => {
    it("service 호출이 성공하면 템플릿 목록을 담아 성공 결과를 반환한다", async () => {
        const templates = [
            {
                id: 1,
                name: "결석 안내",
                status: "ABSENT",
                content: "오늘 결석하셨습니다.",
                createdAt: "2026-01-05T12:00:00.000Z",
                updatedAt: "2026-01-10T12:00:00.000Z",
            },
        ];
        mockedGetMessageTemplateList.mockResolvedValue({ message: "조회했습니다.", data: templates });

        const result = await getMessageTemplateListAction();

        expect(result).toEqual({ success: true, message: "조회했습니다.", data: templates });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        mockedGetMessageTemplateList.mockRejectedValue(
            new Error("문자 템플릿 목록 조회에 실패했습니다."),
        );

        const result = await getMessageTemplateListAction();

        expect(result).toEqual({
            success: false,
            message: "문자 템플릿 목록 조회에 실패했습니다.",
        });
    });
});

describe("createMessageTemplateAction", () => {
    it("템플릿 이름이 비어있으면 실패 결과를 반환한다", async () => {
        const formData = buildFormData({ name: "  ", status: "ABSENT", content: "내용" });

        const result = await createMessageTemplateAction(emptyState, formData);

        expect(result).toEqual({
            success: false,
            message: "템플릿 이름과 문자 내용을 입력해주세요.",
        });
        expect(mockedCreateMessageTemplate).not.toHaveBeenCalled();
    });

    it("문자 내용이 비어있으면 실패 결과를 반환한다", async () => {
        const formData = buildFormData({ name: "결석 안내", status: "ABSENT", content: "  " });

        const result = await createMessageTemplateAction(emptyState, formData);

        expect(result).toEqual({
            success: false,
            message: "템플릿 이름과 문자 내용을 입력해주세요.",
        });
        expect(mockedCreateMessageTemplate).not.toHaveBeenCalled();
    });

    it("출결 상태가 올바르지 않으면 실패 결과를 반환한다", async () => {
        const formData = buildFormData({ name: "결석 안내", status: "UNKNOWN", content: "내용" });

        const result = await createMessageTemplateAction(emptyState, formData);

        expect(result).toEqual({ success: false, message: "출결 상태가 올바르지 않습니다." });
        expect(mockedCreateMessageTemplate).not.toHaveBeenCalled();
    });

    it("유효한 값이면 service 호출이 성공했을 때 생성된 템플릿 정보를 담아 성공 결과를 반환한다", async () => {
        mockedCreateMessageTemplate.mockResolvedValue({
            message: "문자 템플릿을 생성했습니다.",
            data: { templateId: 9 },
        });
        const formData = buildFormData({
            name: "결석 안내",
            status: "ABSENT",
            content: "오늘 결석하셨습니다.",
        });

        const result = await createMessageTemplateAction(emptyState, formData);

        expect(mockedCreateMessageTemplate).toHaveBeenCalledWith({
            name: "결석 안내",
            status: "ABSENT",
            content: "오늘 결석하셨습니다.",
        });
        expect(result).toEqual({
            success: true,
            message: "문자 템플릿을 생성했습니다.",
            data: { templateId: 9 },
        });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        mockedCreateMessageTemplate.mockRejectedValue(new Error("문자 템플릿 생성에 실패했습니다."));
        const formData = buildFormData({ name: "결석 안내", status: "ABSENT", content: "내용" });

        const result = await createMessageTemplateAction(emptyState, formData);

        expect(result).toEqual({
            success: false,
            message: "문자 템플릿 생성에 실패했습니다.",
        });
    });
});

describe("changeMessageTemplateAction", () => {
    it("템플릿 번호가 올바르지 않으면 실패 결과를 반환한다", async () => {
        const formData = buildFormData({ name: "결석 안내", content: "내용" });

        const result = await changeMessageTemplateAction(0, emptyState, formData);

        expect(result).toEqual({ success: false, message: "문자 템플릿 번호가 올바르지 않습니다." });
        expect(mockedChangeMessageTemplate).not.toHaveBeenCalled();
    });

    it("템플릿 이름이 비어있으면 실패 결과를 반환한다", async () => {
        const formData = buildFormData({ name: " ", content: "내용" });

        const result = await changeMessageTemplateAction(1, emptyState, formData);

        expect(result).toEqual({
            success: false,
            message: "템플릿 이름과 문자 내용을 입력해주세요.",
        });
        expect(mockedChangeMessageTemplate).not.toHaveBeenCalled();
    });

    it("문자 내용이 비어있으면 실패 결과를 반환한다", async () => {
        const formData = buildFormData({ name: "결석 안내", content: " " });

        const result = await changeMessageTemplateAction(1, emptyState, formData);

        expect(result).toEqual({
            success: false,
            message: "템플릿 이름과 문자 내용을 입력해주세요.",
        });
        expect(mockedChangeMessageTemplate).not.toHaveBeenCalled();
    });

    it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
        mockedChangeMessageTemplate.mockResolvedValue(undefined);
        const formData = buildFormData({ name: "결석 안내 수정", content: "내용 수정" });

        const result = await changeMessageTemplateAction(1, emptyState, formData);

        expect(mockedChangeMessageTemplate).toHaveBeenCalledWith(1, {
            name: "결석 안내 수정",
            content: "내용 수정",
        });
        expect(result).toEqual({ success: true, message: "문자 템플릿 수정에 성공했습니다." });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        mockedChangeMessageTemplate.mockRejectedValue(new Error("문자 템플릿 수정에 실패했습니다."));
        const formData = buildFormData({ name: "결석 안내", content: "내용" });

        const result = await changeMessageTemplateAction(1, emptyState, formData);

        expect(result).toEqual({
            success: false,
            message: "문자 템플릿 수정에 실패했습니다.",
        });
    });
});

describe("deleteMessageTemplateAction", () => {
    it("템플릿 번호가 올바르지 않으면 실패 결과를 반환한다", async () => {
        const result = await deleteMessageTemplateAction(0);

        expect(result).toEqual({ success: false, message: "문자 템플릿 번호가 올바르지 않습니다." });
        expect(mockedDeleteMessageTemplate).not.toHaveBeenCalled();
    });

    it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
        mockedDeleteMessageTemplate.mockResolvedValue(undefined);

        const result = await deleteMessageTemplateAction(1);

        expect(mockedDeleteMessageTemplate).toHaveBeenCalledWith(1);
        expect(result).toEqual({ success: true, message: "문자 템플릿 삭제에 성공했습니다." });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        mockedDeleteMessageTemplate.mockRejectedValue(new Error("문자 템플릿 삭제에 실패했습니다."));

        const result = await deleteMessageTemplateAction(1);

        expect(result).toEqual({
            success: false,
            message: "문자 템플릿 삭제에 실패했습니다.",
        });
    });
});
