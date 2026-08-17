import {
    changeLectureAttendance,
    exportLectureAttendance,
    getLectureAttendance,
    getMessageCandidates,
    sendAttendanceMessage,
} from "@/service/rollbook.service";
import {
    changeLectureAttendanceAction,
    exportLectureAttendanceAction,
    getLectureAttendanceAction,
    getMessageCandidatesAction,
    sendAttendanceMessageAction,
} from "./actions";

jest.mock("../../service/rollbook.service");

describe("getLectureAttendanceAction", () => {
    afterEach(() => jest.clearAllMocks());

    it("강의 번호가 올바르지 않으면 실패 결과를 반환한다", async () => {
        const result = await getLectureAttendanceAction(0, "2026-08-16");

        expect(result).toEqual({ success: false, message: "강의 번호가 올바르지 않습니다." });
        expect(getLectureAttendance).not.toHaveBeenCalled();
    });

    it("출결 날짜 형식이 올바르지 않으면 실패 결과를 반환한다", async () => {
        const result = await getLectureAttendanceAction(7, "2026/08/16");

        expect(result).toEqual({ success: false, message: "출결 날짜 형식이 올바르지 않습니다." });
        expect(getLectureAttendance).not.toHaveBeenCalled();
    });

    it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
        const data = {
            lectureId: 7,
            lectureName: "API 수학 정규반",
            date: "2026-08-16",
            entries: [],
            summary: { total: 0, present: 0, absent: 0, late: 0, online: 0, etc: 0 },
        };
        (getLectureAttendance as jest.Mock).mockResolvedValue({
            status: 200,
            code: "OK",
            message: "조회했습니다.",
            data,
        });

        const result = await getLectureAttendanceAction(7, "2026-08-16");

        expect(getLectureAttendance).toHaveBeenCalledWith(7, "2026-08-16");
        expect(result).toEqual({ success: true, message: "조회했습니다.", data });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        (getLectureAttendance as jest.Mock).mockRejectedValue(
            new Error("강의 출결부 조회에 실패했습니다."),
        );

        const result = await getLectureAttendanceAction(7, "2026-08-16");

        expect(result).toEqual({ success: false, message: "강의 출결부 조회에 실패했습니다." });
    });
});

describe("changeLectureAttendanceAction", () => {
    afterEach(() => jest.clearAllMocks());

    it("강의 번호가 올바르지 않으면 실패 결과를 반환한다", async () => {
        const result = await changeLectureAttendanceAction(0, "2026-08-16", { entries: [] });

        expect(result).toEqual({ success: false, message: "강의 번호가 올바르지 않습니다." });
        expect(changeLectureAttendance).not.toHaveBeenCalled();
    });

    it("저장할 출결 항목이 없으면 실패 결과를 반환한다", async () => {
        const result = await changeLectureAttendanceAction(7, "2026-08-16", { entries: [] });

        expect(result).toEqual({ success: false, message: "저장할 출결을 선택해주세요." });
        expect(changeLectureAttendance).not.toHaveBeenCalled();
    });

    it("학생 번호나 출결 상태가 올바르지 않으면 실패 결과를 반환한다", async () => {
        const result = await changeLectureAttendanceAction(7, "2026-08-16", {
            entries: [{ studentId: 0, status: "PRESENT", note: null }],
        });

        expect(result).toEqual({ success: false, message: "출결 정보가 올바르지 않습니다." });
        expect(changeLectureAttendance).not.toHaveBeenCalled();
    });

    it("기타 출결 사유가 비어있으면 실패 결과를 반환한다", async () => {
        const result = await changeLectureAttendanceAction(7, "2026-08-16", {
            entries: [{ studentId: 1, status: "ETC", note: "  " }],
        });

        expect(result).toEqual({ success: false, message: "기타 출결 사유를 입력해주세요." });
        expect(changeLectureAttendance).not.toHaveBeenCalled();
    });

    it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
        (changeLectureAttendance as jest.Mock).mockResolvedValue(undefined);

        const result = await changeLectureAttendanceAction(7, "2026-08-16", {
            entries: [{ studentId: 1, status: "PRESENT", note: null }],
        });

        expect(changeLectureAttendance).toHaveBeenCalledWith(7, "2026-08-16", {
            entries: [{ studentId: 1, status: "PRESENT", note: null }],
        });
        expect(result).toEqual({ success: true, message: "출결 저장에 성공했습니다." });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        (changeLectureAttendance as jest.Mock).mockRejectedValue(
            new Error("출결 저장에 실패했습니다."),
        );

        const result = await changeLectureAttendanceAction(7, "2026-08-16", {
            entries: [{ studentId: 1, status: "PRESENT", note: null }],
        });

        expect(result).toEqual({ success: false, message: "출결 저장에 실패했습니다." });
    });
});

describe("exportLectureAttendanceAction", () => {
    afterEach(() => jest.clearAllMocks());

    it("강의 번호가 올바르지 않으면 실패 결과를 반환한다", async () => {
        const result = await exportLectureAttendanceAction(0, "2026-08-16");

        expect(result).toEqual({ success: false, message: "강의 번호가 올바르지 않습니다." });
        expect(exportLectureAttendance).not.toHaveBeenCalled();
    });

    it("service 호출이 성공하면 base64로 인코딩된 엑셀 파일을 반환한다", async () => {
        const buffer = Buffer.from("test-file");
        const arrayBuffer = buffer.buffer.slice(
            buffer.byteOffset,
            buffer.byteOffset + buffer.byteLength,
        );
        const blob = { arrayBuffer: () => Promise.resolve(arrayBuffer) } as unknown as Blob;
        (exportLectureAttendance as jest.Mock).mockResolvedValue(blob);

        const result = await exportLectureAttendanceAction(7, "2026-08-16");

        expect(result).toEqual({
            success: true,
            message: "출결부 엑셀 다운로드에 성공했습니다.",
            data: {
                file: buffer.toString("base64"),
                fileName: "attendance_7_2026-08-16.xlsx",
                mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            },
        });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        (exportLectureAttendance as jest.Mock).mockRejectedValue(
            new Error("출결부 엑셀 다운로드에 실패했습니다."),
        );

        const result = await exportLectureAttendanceAction(7, "2026-08-16");

        expect(result).toEqual({ success: false, message: "출결부 엑셀 다운로드에 실패했습니다." });
    });
});

describe("getMessageCandidatesAction", () => {
    afterEach(() => jest.clearAllMocks());

    it("강의 번호가 올바르지 않으면 실패 결과를 반환한다", async () => {
        const result = await getMessageCandidatesAction(0, "2026-08-16");

        expect(result).toEqual({ success: false, message: "강의 번호가 올바르지 않습니다." });
        expect(getMessageCandidates).not.toHaveBeenCalled();
    });

    it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
        const data = [
            {
                studentId: 1,
                studentName: "김민수",
                status: "ABSENT",
                parentPhone: "010-1111-2222",
                matchedTemplateId: 1,
                matchedTemplateName: "결석 안내",
                eligible: true,
            },
        ];
        (getMessageCandidates as jest.Mock).mockResolvedValue({
            status: 200,
            code: "OK",
            message: "조회했습니다.",
            data,
        });

        const result = await getMessageCandidatesAction(7, "2026-08-16");

        expect(result).toEqual({ success: true, message: "조회했습니다.", data });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        (getMessageCandidates as jest.Mock).mockRejectedValue(
            new Error("문자 발송 대상 조회에 실패했습니다."),
        );

        const result = await getMessageCandidatesAction(7, "2026-08-16");

        expect(result).toEqual({ success: false, message: "문자 발송 대상 조회에 실패했습니다." });
    });
});

describe("sendAttendanceMessageAction", () => {
    afterEach(() => jest.clearAllMocks());

    it("발송 대상 학생이 없으면 실패 결과를 반환한다", async () => {
        const result = await sendAttendanceMessageAction(7, "2026-08-16", { studentIds: [] });

        expect(result).toEqual({
            success: false,
            message: "발송할 학생을 최소 1명 이상 선택해주세요.",
        });
        expect(sendAttendanceMessage).not.toHaveBeenCalled();
    });

    it("학생 번호가 올바르지 않으면 실패 결과를 반환한다", async () => {
        const result = await sendAttendanceMessageAction(7, "2026-08-16", { studentIds: [0] });

        expect(result).toEqual({ success: false, message: "학생 번호가 올바르지 않습니다." });
        expect(sendAttendanceMessage).not.toHaveBeenCalled();
    });

    it("중복된 학생 번호는 한 번만 전달한다", async () => {
        (sendAttendanceMessage as jest.Mock).mockResolvedValue({
            status: 200,
            code: "OK",
            message: "발송했습니다.",
            data: [],
        });

        await sendAttendanceMessageAction(7, "2026-08-16", { studentIds: [1, 1, 2] });

        expect(sendAttendanceMessage).toHaveBeenCalledWith(7, "2026-08-16", {
            studentIds: [1, 2],
        });
    });

    it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
        const data = [{ studentId: 1, studentName: "김민수", sent: true, failureReason: null }];
        (sendAttendanceMessage as jest.Mock).mockResolvedValue({
            status: 200,
            code: "OK",
            message: "발송했습니다.",
            data,
        });

        const result = await sendAttendanceMessageAction(7, "2026-08-16", { studentIds: [1] });

        expect(result).toEqual({ success: true, message: "발송했습니다.", data });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        (sendAttendanceMessage as jest.Mock).mockRejectedValue(
            new Error("출결 안내 문자 발송에 실패했습니다."),
        );

        const result = await sendAttendanceMessageAction(7, "2026-08-16", { studentIds: [1] });

        expect(result).toEqual({ success: false, message: "출결 안내 문자 발송에 실패했습니다." });
    });
});
