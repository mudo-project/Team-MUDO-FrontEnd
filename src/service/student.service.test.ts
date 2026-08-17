import { fetchWithAuth } from "../lib/fetch";
import {
    createStudent,
    createStudentEnrollment,
    deleteStudent,
    endStudentEnrollment,
    getStudentDetail,
    getStudentList,
    updateStudent,
} from "./student.service";

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

describe("student.service", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("createStudent", () => {
        it("응답이 정상이면 생성된 학생 정보를 반환한다", async () => {
            const mockData = { status: 200, code: "OK", message: "등록했습니다.", data: { studentId: 1 } };
            mockedFetchWithAuth.mockResolvedValue(okJsonResponse(mockData));

            const result = await createStudent({ name: "홍길동", grade: "MIDDLE_1" });

            expect(mockedFetchWithAuth).toHaveBeenCalledWith("/api/students", {
                method: "POST",
                body: JSON.stringify({ name: "홍길동", grade: "MIDDLE_1" }),
            });
            expect(result).toEqual(mockData);
        });

        it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
            mockedFetchWithAuth.mockResolvedValue(failedJsonResponse("학생 등록에 실패했습니다."));

            await expect(createStudent({ name: "홍길동", grade: "MIDDLE_1" })).rejects.toThrow(
                "학생 등록에 실패했습니다.",
            );
        });
    });

    describe("getStudentList", () => {
        it("응답이 정상이면 학생 목록을 반환한다", async () => {
            const mockData = {
                status: 200,
                code: "OK",
                message: "조회했습니다.",
                data: { content: [], page: 0, size: 30, hasNext: false },
            };
            mockedFetchWithAuth.mockResolvedValue(okJsonResponse(mockData));

            const result = await getStudentList("길동", 0, 30);

            expect(mockedFetchWithAuth).toHaveBeenCalledWith(
                "/api/students?keyword=%EA%B8%B8%EB%8F%99&page=0&size=30",
            );
            expect(result).toEqual(mockData);
        });

        it("인자를 생략하면 기본값(keyword='', page=0, size=30)을 사용한다", async () => {
            mockedFetchWithAuth.mockResolvedValue(
                okJsonResponse({ status: 200, code: "OK", message: "", data: { content: [], page: 0, size: 30, hasNext: false } }),
            );

            await getStudentList();

            expect(mockedFetchWithAuth).toHaveBeenCalledWith("/api/students?keyword=&page=0&size=30");
        });

        it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
            mockedFetchWithAuth.mockResolvedValue(failedJsonResponse("학생 목록 조회에 실패했습니다."));

            await expect(getStudentList()).rejects.toThrow("학생 목록 조회에 실패했습니다.");
        });
    });

    describe("getStudentDetail", () => {
        it("응답이 정상이면 학생 상세 정보를 반환한다", async () => {
            const mockData = { status: 200, code: "OK", message: "조회했습니다.", data: { studentId: 1 } };
            mockedFetchWithAuth.mockResolvedValue(okJsonResponse(mockData));

            const result = await getStudentDetail(1);

            expect(mockedFetchWithAuth).toHaveBeenCalledWith("/api/students/1");
            expect(result).toEqual(mockData);
        });

        it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
            mockedFetchWithAuth.mockResolvedValue(failedJsonResponse("학생 상세 조회에 실패했습니다."));

            await expect(getStudentDetail(1)).rejects.toThrow("학생 상세 조회에 실패했습니다.");
        });
    });

    describe("updateStudent", () => {
        it("응답이 정상이면 아무 값도 반환하지 않는다", async () => {
            mockedFetchWithAuth.mockResolvedValue({ ok: true });

            await expect(
                updateStudent(1, { name: "김철수", grade: "HIGH_1" }),
            ).resolves.toBeUndefined();
            expect(mockedFetchWithAuth).toHaveBeenCalledWith("/api/students/1", {
                method: "PATCH",
                body: JSON.stringify({ name: "김철수", grade: "HIGH_1" }),
            });
        });

        it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
            mockedFetchWithAuth.mockResolvedValue(failedJsonResponse("학생 정보 수정에 실패했습니다."));

            await expect(
                updateStudent(1, { name: "김철수", grade: "HIGH_1" }),
            ).rejects.toThrow("학생 정보 수정에 실패했습니다.");
        });
    });

    describe("deleteStudent", () => {
        it("응답이 정상이면 아무 값도 반환하지 않는다", async () => {
            mockedFetchWithAuth.mockResolvedValue({ ok: true });

            await expect(deleteStudent(1)).resolves.toBeUndefined();
            expect(mockedFetchWithAuth).toHaveBeenCalledWith("/api/students/1", {
                method: "DELETE",
            });
        });

        it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
            mockedFetchWithAuth.mockResolvedValue(failedJsonResponse("학생 삭제에 실패했습니다."));

            await expect(deleteStudent(1)).rejects.toThrow("학생 삭제에 실패했습니다.");
        });
    });

    describe("createStudentEnrollment", () => {
        it("응답이 정상이면 생성된 수강 정보를 반환한다", async () => {
            const mockData = { status: 200, code: "OK", message: "등록했습니다.", data: { enrollmentId: 1 } };
            mockedFetchWithAuth.mockResolvedValue(okJsonResponse(mockData));

            const result = await createStudentEnrollment(1, { lectureId: 2 });

            expect(mockedFetchWithAuth).toHaveBeenCalledWith("/api/students/1/enrollments", {
                method: "POST",
                body: JSON.stringify({ lectureId: 2 }),
            });
            expect(result).toEqual(mockData);
        });

        it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
            mockedFetchWithAuth.mockResolvedValue(failedJsonResponse("학생 수강 등록에 실패했습니다."));

            await expect(createStudentEnrollment(1, { lectureId: 2 })).rejects.toThrow(
                "학생 수강 등록에 실패했습니다.",
            );
        });
    });

    describe("endStudentEnrollment", () => {
        it("응답이 정상이면 아무 값도 반환하지 않는다", async () => {
            mockedFetchWithAuth.mockResolvedValue({ ok: true });

            await expect(endStudentEnrollment(1, 2)).resolves.toBeUndefined();
            expect(mockedFetchWithAuth).toHaveBeenCalledWith(
                "/api/students/1/enrollments/2/end",
                { method: "PATCH" },
            );
        });

        it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
            mockedFetchWithAuth.mockResolvedValue(failedJsonResponse("학생 수강 종료에 실패했습니다."));

            await expect(endStudentEnrollment(1, 2)).rejects.toThrow("학생 수강 종료에 실패했습니다.");
        });
    });
});
