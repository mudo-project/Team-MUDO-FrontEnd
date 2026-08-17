import { fetchWithAuth } from "../lib/fetch";
import {
    changeMessageTemplate,
    createMessageTemplate,
    deleteMessageTemplate,
    getMessageTemplateList,
} from "./message.service";

jest.mock("../lib/fetch");

const mockedFetchWithAuth = fetchWithAuth as jest.Mock;

const okResponse = (data: unknown) => ({
    ok: true,
    json: () => Promise.resolve(data),
});

const errorResponse = (message: string) => ({
    ok: false,
    headers: { get: () => "application/json" },
    json: () => Promise.resolve({ message }),
});

afterEach(() => {
    jest.clearAllMocks();
});

describe("getMessageTemplateList", () => {
    it("응답이 정상이면 문자 템플릿 목록을 반환한다", async () => {
        const mockData = {
            status: 200,
            code: "OK",
            message: "조회했습니다.",
            data: [
                {
                    id: 1,
                    name: "결석 안내",
                    status: "ABSENT",
                    content: "오늘 결석하셨습니다.",
                    createdAt: "2026-01-05T12:00:00.000Z",
                    updatedAt: "2026-01-10T12:00:00.000Z",
                },
            ],
        };
        mockedFetchWithAuth.mockResolvedValue(okResponse(mockData));

        const result = await getMessageTemplateList();

        expect(mockedFetchWithAuth).toHaveBeenCalledWith("/api/rollcall/message-templates");
        expect(result).toEqual(mockData);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetchWithAuth.mockResolvedValue(errorResponse("문자 템플릿 목록 조회에 실패했습니다."));

        await expect(getMessageTemplateList()).rejects.toThrow(
            "문자 템플릿 목록 조회에 실패했습니다.",
        );
    });
});

describe("createMessageTemplate", () => {
    it("응답이 정상이면 생성된 템플릿 정보를 반환한다", async () => {
        const mockData = {
            status: 201,
            code: "OK",
            message: "템플릿을 생성했습니다.",
            data: { templateId: 9 },
        };
        mockedFetchWithAuth.mockResolvedValue(okResponse(mockData));

        const payload = { name: "결석 안내", status: "ABSENT" as const, content: "오늘 결석하셨습니다." };
        const result = await createMessageTemplate(payload);

        expect(mockedFetchWithAuth).toHaveBeenCalledWith("/api/rollcall/message-templates", {
            method: "POST",
            body: JSON.stringify(payload),
        });
        expect(result).toEqual(mockData);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetchWithAuth.mockResolvedValue(errorResponse("문자 템플릿 생성에 실패했습니다."));

        await expect(
            createMessageTemplate({ name: "결석 안내", status: "ABSENT", content: "" }),
        ).rejects.toThrow("문자 템플릿 생성에 실패했습니다.");
    });
});

describe("changeMessageTemplate", () => {
    it("응답이 정상이면 예외 없이 완료된다", async () => {
        mockedFetchWithAuth.mockResolvedValue(okResponse({}));

        const payload = { name: "결석 안내 수정", content: "내용 수정" };
        await expect(changeMessageTemplate(1, payload)).resolves.toBeUndefined();
        expect(mockedFetchWithAuth).toHaveBeenCalledWith("/api/rollcall/message-templates/1", {
            method: "PATCH",
            body: JSON.stringify(payload),
        });
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetchWithAuth.mockResolvedValue(errorResponse("문자 템플릿 수정에 실패했습니다."));

        await expect(
            changeMessageTemplate(1, { name: "결석 안내", content: "" }),
        ).rejects.toThrow("문자 템플릿 수정에 실패했습니다.");
    });
});

describe("deleteMessageTemplate", () => {
    it("응답이 정상이면 예외 없이 완료된다", async () => {
        mockedFetchWithAuth.mockResolvedValue(okResponse({}));

        await expect(deleteMessageTemplate(1)).resolves.toBeUndefined();
        expect(mockedFetchWithAuth).toHaveBeenCalledWith("/api/rollcall/message-templates/1", {
            method: "DELETE",
        });
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetchWithAuth.mockResolvedValue(errorResponse("문자 템플릿 삭제에 실패했습니다."));

        await expect(deleteMessageTemplate(1)).rejects.toThrow("문자 템플릿 삭제에 실패했습니다.");
    });
});
