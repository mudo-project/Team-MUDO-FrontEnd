import { fetchWithAuth } from "../lib/fetch";
import { getErrorMessage } from "../lib/stateError";
import {
    createLecture,
    deleteLecture,
    getLectureClassrooms,
    getLectureDetail,
    getLectureList,
    getLectureSubjects,
    getLectureTeachers,
    getLectureTerms,
    updateLecture,
} from "./lecture.service";

jest.mock("../lib/fetch");
jest.mock("../lib/stateError");

const mockedFetchWithAuth = fetchWithAuth as jest.Mock;
const mockedGetErrorMessage = getErrorMessage as jest.Mock;

afterEach(() => {
    jest.clearAllMocks();
});

describe("getLectureList", () => {
    it("조회 조건이 없으면 쿼리 없이 목록을 조회한다", async () => {
        const mockData = {
            status: 200,
            code: "OK",
            message: "조회했습니다.",
            data: { content: [], page: 0, size: 30, hasNext: false },
        };
        mockedFetchWithAuth.mockResolvedValue({ ok: true, json: () => Promise.resolve(mockData) });

        const result = await getLectureList();

        expect(mockedFetchWithAuth).toHaveBeenCalledWith("/api/lectures");
        expect(result).toEqual(mockData);
    });

    it("조회 조건이 있으면 쿼리스트링에 포함해 조회한다", async () => {
        mockedFetchWithAuth.mockResolvedValue({ ok: true, json: () => Promise.resolve({ data: {} }) });

        await getLectureList({ termId: 1, grade: "HIGH_1", page: 0, size: 30 });

        const params = new URLSearchParams();
        params.set("termId", "1");
        params.set("grade", "HIGH_1");
        params.set("page", "0");
        params.set("size", "30");
        expect(mockedFetchWithAuth).toHaveBeenCalledWith(`/api/lectures?${params.toString()}`);
    });

    it("값이 없는 조건(undefined, 빈 문자열)은 쿼리스트링에서 제외한다", async () => {
        mockedFetchWithAuth.mockResolvedValue({ ok: true, json: () => Promise.resolve({ data: {} }) });

        await getLectureList({ termId: undefined, subjectName: "" });

        expect(mockedFetchWithAuth).toHaveBeenCalledWith("/api/lectures");
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        const response = { ok: false };
        mockedFetchWithAuth.mockResolvedValue(response);
        mockedGetErrorMessage.mockResolvedValue("강의 목록 조회에 실패했습니다.");

        await expect(getLectureList()).rejects.toThrow("강의 목록 조회에 실패했습니다.");
        expect(mockedGetErrorMessage).toHaveBeenCalledWith(response, "강의 목록 조회에 실패했습니다.");
    });
});

describe("getLectureDetail", () => {
    it("응답이 정상이면 강의 상세 정보를 반환한다", async () => {
        const mockData = { status: 200, code: "OK", message: "조회했습니다.", data: { id: 1 } };
        mockedFetchWithAuth.mockResolvedValue({ ok: true, json: () => Promise.resolve(mockData) });

        const result = await getLectureDetail(1);

        expect(mockedFetchWithAuth).toHaveBeenCalledWith("/api/lectures/1");
        expect(result).toEqual(mockData);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        const response = { ok: false };
        mockedFetchWithAuth.mockResolvedValue(response);
        mockedGetErrorMessage.mockResolvedValue("강의 상세 조회에 실패했습니다.");

        await expect(getLectureDetail(1)).rejects.toThrow("강의 상세 조회에 실패했습니다.");
        expect(mockedGetErrorMessage).toHaveBeenCalledWith(response, "강의 상세 조회에 실패했습니다.");
    });
});

describe("createLecture", () => {
    const payload = {
        name: "고1 수학",
        classType: "CLASS" as const,
        classroomCode: "A101",
        schedules: [{ dayOfWeek: "MONDAY" as const, startTime: "09:00:00", endTime: "10:00:00" }],
    };

    it("응답이 정상이면 생성된 강의 정보를 반환한다", async () => {
        const mockData = { status: 201, code: "OK", message: "강의 등록에 성공했습니다.", data: { lectureId: 1 } };
        mockedFetchWithAuth.mockResolvedValue({ ok: true, json: () => Promise.resolve(mockData) });

        const result = await createLecture(payload);

        expect(mockedFetchWithAuth).toHaveBeenCalledWith("/api/lectures", {
            method: "POST",
            body: JSON.stringify(payload),
        });
        expect(result).toEqual(mockData);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        const response = { ok: false };
        mockedFetchWithAuth.mockResolvedValue(response);
        mockedGetErrorMessage.mockResolvedValue("강의 등록에 실패했습니다.");

        await expect(createLecture(payload)).rejects.toThrow("강의 등록에 실패했습니다.");
        expect(mockedGetErrorMessage).toHaveBeenCalledWith(response, "강의 등록에 실패했습니다.");
    });
});

describe("updateLecture", () => {
    const payload = {
        name: "고1 수학(수정)",
        classType: "CLASS" as const,
        classroomCode: "A101",
        schedules: [{ dayOfWeek: "MONDAY" as const, startTime: "09:00:00", endTime: "10:00:00" }],
    };

    it("응답이 정상이면 응답 데이터를 반환한다", async () => {
        const mockData = { status: 200, code: "OK", message: "강의 수정에 성공했습니다.", data: null };
        mockedFetchWithAuth.mockResolvedValue({ ok: true, json: () => Promise.resolve(mockData) });

        const result = await updateLecture(1, payload);

        expect(mockedFetchWithAuth).toHaveBeenCalledWith("/api/lectures/1", {
            method: "PATCH",
            body: JSON.stringify(payload),
        });
        expect(result).toEqual(mockData);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        const response = { ok: false };
        mockedFetchWithAuth.mockResolvedValue(response);
        mockedGetErrorMessage.mockResolvedValue("강의 수정에 실패했습니다.");

        await expect(updateLecture(1, payload)).rejects.toThrow("강의 수정에 실패했습니다.");
        expect(mockedGetErrorMessage).toHaveBeenCalledWith(response, "강의 수정에 실패했습니다.");
    });
});

describe("deleteLecture", () => {
    it("응답이 정상이면 예외 없이 완료된다", async () => {
        mockedFetchWithAuth.mockResolvedValue({ ok: true });

        await expect(deleteLecture(1)).resolves.toBeUndefined();
        expect(mockedFetchWithAuth).toHaveBeenCalledWith("/api/lectures/1", { method: "DELETE" });
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        const response = { ok: false };
        mockedFetchWithAuth.mockResolvedValue(response);
        mockedGetErrorMessage.mockResolvedValue("강의 삭제에 실패했습니다.");

        await expect(deleteLecture(1)).rejects.toThrow("강의 삭제에 실패했습니다.");
        expect(mockedGetErrorMessage).toHaveBeenCalledWith(response, "강의 삭제에 실패했습니다.");
    });
});

describe("getLectureTeachers", () => {
    it("응답이 정상이면 선생님 목록을 반환한다", async () => {
        const mockData = { status: 200, code: "OK", message: "조회했습니다.", data: ["김선생"] };
        mockedFetchWithAuth.mockResolvedValue({ ok: true, json: () => Promise.resolve(mockData) });

        const result = await getLectureTeachers();

        expect(mockedFetchWithAuth).toHaveBeenCalledWith("/api/lectures/teachers");
        expect(result).toEqual(mockData);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        const response = { ok: false };
        mockedFetchWithAuth.mockResolvedValue(response);
        mockedGetErrorMessage.mockResolvedValue("강의 담당 선생님 목록 조회에 실패했습니다.");

        await expect(getLectureTeachers()).rejects.toThrow("강의 담당 선생님 목록 조회에 실패했습니다.");
        expect(mockedGetErrorMessage).toHaveBeenCalledWith(response, "강의 담당 선생님 목록 조회에 실패했습니다.");
    });
});

describe("getLectureSubjects", () => {
    it("응답이 정상이면 과목 목록을 반환한다", async () => {
        const mockData = { status: 200, code: "OK", message: "조회했습니다.", data: ["수학"] };
        mockedFetchWithAuth.mockResolvedValue({ ok: true, json: () => Promise.resolve(mockData) });

        const result = await getLectureSubjects();

        expect(mockedFetchWithAuth).toHaveBeenCalledWith("/api/lectures/subjects");
        expect(result).toEqual(mockData);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        const response = { ok: false };
        mockedFetchWithAuth.mockResolvedValue(response);
        mockedGetErrorMessage.mockResolvedValue("강의 과목 목록 조회에 실패했습니다.");

        await expect(getLectureSubjects()).rejects.toThrow("강의 과목 목록 조회에 실패했습니다.");
        expect(mockedGetErrorMessage).toHaveBeenCalledWith(response, "강의 과목 목록 조회에 실패했습니다.");
    });
});

describe("getLectureClassrooms", () => {
    it("응답이 정상이면 강의실 목록을 반환한다", async () => {
        const mockData = { status: 200, code: "OK", message: "조회했습니다.", data: ["A101"] };
        mockedFetchWithAuth.mockResolvedValue({ ok: true, json: () => Promise.resolve(mockData) });

        const result = await getLectureClassrooms();

        expect(mockedFetchWithAuth).toHaveBeenCalledWith("/api/lectures/classrooms");
        expect(result).toEqual(mockData);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        const response = { ok: false };
        mockedFetchWithAuth.mockResolvedValue(response);
        mockedGetErrorMessage.mockResolvedValue("강의실 목록 조회에 실패했습니다.");

        await expect(getLectureClassrooms()).rejects.toThrow("강의실 목록 조회에 실패했습니다.");
        expect(mockedGetErrorMessage).toHaveBeenCalledWith(response, "강의실 목록 조회에 실패했습니다.");
    });
});

describe("getLectureTerms", () => {
    it("응답이 정상이면 학기 목록을 반환한다", async () => {
        const mockData = {
            status: 200,
            code: "OK",
            message: "조회했습니다.",
            data: [{ termId: 1, termName: "1학기" }],
        };
        mockedFetchWithAuth.mockResolvedValue({ ok: true, json: () => Promise.resolve(mockData) });

        const result = await getLectureTerms();

        expect(mockedFetchWithAuth).toHaveBeenCalledWith("/api/lectures/terms");
        expect(result).toEqual(mockData);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        const response = { ok: false };
        mockedFetchWithAuth.mockResolvedValue(response);
        mockedGetErrorMessage.mockResolvedValue("강의 학기 목록 조회에 실패했습니다.");

        await expect(getLectureTerms()).rejects.toThrow("강의 학기 목록 조회에 실패했습니다.");
        expect(mockedGetErrorMessage).toHaveBeenCalledWith(response, "강의 학기 목록 조회에 실패했습니다.");
    });
});
