import { fetchWithAuth } from "@/lib/fetch";
import {
    changeLectureAttendance,
    exportLectureAttendance,
    getLectureAttendance,
    getMessageCandidates,
    sendAttendanceMessage,
} from "./rollbook.service";
import {
    ChangeAttendanceRequest,
    LectureAttendanceResponse,
    MessageCandidateListResponse,
    SendAttendanceMessageRequest,
    SendAttendanceMessageResponse,
} from "@/feature/rollbook/type";

jest.mock("../lib/fetch");

const mockedFetch = fetchWithAuth as jest.Mock;

const okJsonResponse = (data: unknown) => ({
    ok: true,
    json: () => Promise.resolve(data),
});

const failJsonResponse = (message: string) => ({
    ok: false,
    headers: { get: () => "application/json" },
    json: () => Promise.resolve({ message }),
});

describe("getLectureAttendance", () => {
    afterEach(() => jest.clearAllMocks());

    it("응답이 정상이면 강의 출결부를 반환한다", async () => {
        const response: LectureAttendanceResponse = {
            status: 200,
            code: "OK",
            message: "조회했습니다.",
            data: {
                lectureId: 7,
                lectureName: "API 수학 정규반",
                date: "2026-08-16",
                entries: [],
                summary: { total: 0, present: 0, absent: 0, late: 0, online: 0, etc: 0 },
            },
        };
        mockedFetch.mockResolvedValue(okJsonResponse(response));

        const result = await getLectureAttendance(7, "2026-08-16");

        expect(mockedFetch).toHaveBeenCalledWith("/api/rollcall/lectures/7/attendance?date=2026-08-16");
        expect(result).toEqual(response);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failJsonResponse("강의 출결부 조회에 실패했습니다."));

        await expect(getLectureAttendance(7, "2026-08-16")).rejects.toThrow(
            "강의 출결부 조회에 실패했습니다.",
        );
    });
});

describe("changeLectureAttendance", () => {
    afterEach(() => jest.clearAllMocks());

    const payload: ChangeAttendanceRequest = {
        entries: [{ studentId: 1, status: "PRESENT", note: null }],
    };

    it("응답이 정상이면 예외 없이 완료된다", async () => {
        mockedFetch.mockResolvedValue({ ok: true });

        await expect(changeLectureAttendance(7, "2026-08-16", payload)).resolves.toBeUndefined();
        expect(mockedFetch).toHaveBeenCalledWith("/api/rollcall/lectures/7/attendance?date=2026-08-16", {
            method: "PUT",
            body: JSON.stringify(payload),
        });
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failJsonResponse("출결 저장에 실패했습니다."));

        await expect(changeLectureAttendance(7, "2026-08-16", payload)).rejects.toThrow(
            "출결 저장에 실패했습니다.",
        );
    });
});

describe("exportLectureAttendance", () => {
    afterEach(() => jest.clearAllMocks());

    it("응답이 정상이면 엑셀 파일 Blob을 반환한다", async () => {
        const blob = { size: 4 } as Blob;
        mockedFetch.mockResolvedValue({ ok: true, blob: () => Promise.resolve(blob) });

        const result = await exportLectureAttendance(7, "2026-08-16");

        expect(mockedFetch).toHaveBeenCalledWith("/api/rollcall/lectures/7/attendance/export?date=2026-08-16");
        expect(result).toBe(blob);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failJsonResponse("출결부 엑셀 다운로드에 실패했습니다."));

        await expect(exportLectureAttendance(7, "2026-08-16")).rejects.toThrow(
            "출결부 엑셀 다운로드에 실패했습니다.",
        );
    });
});

describe("getMessageCandidates", () => {
    afterEach(() => jest.clearAllMocks());

    it("응답이 정상이면 문자 발송 대상 목록을 반환한다", async () => {
        const response: MessageCandidateListResponse = {
            status: 200,
            code: "OK",
            message: "조회했습니다.",
            data: [
                {
                    studentId: 1,
                    studentName: "김민수",
                    status: "ABSENT",
                    parentPhone: "010-1111-2222",
                    matchedTemplateId: 1,
                    matchedTemplateName: "결석 안내",
                    eligible: true,
                },
            ],
        };
        mockedFetch.mockResolvedValue(okJsonResponse(response));

        const result = await getMessageCandidates(7, "2026-08-16");

        expect(mockedFetch).toHaveBeenCalledWith(
            "/api/rollcall/lectures/7/attendance/message-candidates?date=2026-08-16",
        );
        expect(result).toEqual(response);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failJsonResponse("문자 발송 대상 조회에 실패했습니다."));

        await expect(getMessageCandidates(7, "2026-08-16")).rejects.toThrow(
            "문자 발송 대상 조회에 실패했습니다.",
        );
    });
});

describe("sendAttendanceMessage", () => {
    afterEach(() => jest.clearAllMocks());

    const payload: SendAttendanceMessageRequest = { studentIds: [1, 2] };

    it("응답이 정상이면 발송 결과를 반환한다", async () => {
        const response: SendAttendanceMessageResponse = {
            status: 200,
            code: "OK",
            message: "발송했습니다.",
            data: [
                { studentId: 1, studentName: "김민수", sent: true, failureReason: null },
                { studentId: 2, studentName: "이지은", sent: false, failureReason: "번호 오류" },
            ],
        };
        mockedFetch.mockResolvedValue(okJsonResponse(response));

        const result = await sendAttendanceMessage(7, "2026-08-16", payload);

        expect(mockedFetch).toHaveBeenCalledWith(
            "/api/rollcall/lectures/7/attendance/message-candidates/send?date=2026-08-16",
            {
                method: "POST",
                body: JSON.stringify(payload),
            },
        );
        expect(result).toEqual(response);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failJsonResponse("출결 안내 문자 발송에 실패했습니다."));

        await expect(sendAttendanceMessage(7, "2026-08-16", payload)).rejects.toThrow(
            "출결 안내 문자 발송에 실패했습니다.",
        );
    });
});
