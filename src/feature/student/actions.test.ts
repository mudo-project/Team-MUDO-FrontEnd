import {
    createStudent,
    createStudentEnrollment,
    deleteStudent,
    endStudentEnrollment,
    getStudentDetail,
    getStudentList,
    updateStudent,
} from "../../service/student.service";
import {
    createStudentAction,
    createStudentEnrollmentAction,
    deleteStudentAction,
    endStudentEnrollmentAction,
    getStudentDetailAction,
    getStudentListAction,
    updateStudentAction,
} from "./actions";

jest.mock("../../service/student.service", () => ({
    createStudent: jest.fn(),
    createStudentEnrollment: jest.fn(),
    deleteStudent: jest.fn(),
    endStudentEnrollment: jest.fn(),
    getStudentDetail: jest.fn(),
    getStudentList: jest.fn(),
    updateStudent: jest.fn(),
}));

const mockedCreateStudent = createStudent as jest.MockedFunction<typeof createStudent>;
const mockedGetStudentList = getStudentList as jest.MockedFunction<typeof getStudentList>;
const mockedGetStudentDetail = getStudentDetail as jest.MockedFunction<typeof getStudentDetail>;
const mockedUpdateStudent = updateStudent as jest.MockedFunction<typeof updateStudent>;
const mockedDeleteStudent = deleteStudent as jest.MockedFunction<typeof deleteStudent>;
const mockedCreateStudentEnrollment = createStudentEnrollment as jest.MockedFunction<
    typeof createStudentEnrollment
>;
const mockedEndStudentEnrollment = endStudentEnrollment as jest.MockedFunction<
    typeof endStudentEnrollment
>;

const validPayload = { name: "홍길동", grade: "MIDDLE_1" as const };

describe("createStudentAction", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
        mockedCreateStudent.mockResolvedValue({
            status: 200,
            code: "OK",
            message: "등록했습니다.",
            data: { studentId: 1 },
        });

        const result = await createStudentAction(validPayload);

        expect(mockedCreateStudent).toHaveBeenCalledWith(validPayload);
        expect(result).toEqual({
            success: true,
            message: "등록했습니다.",
            data: { studentId: 1 },
        });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        mockedCreateStudent.mockRejectedValue(new Error("학생 등록에 실패했습니다."));

        const result = await createStudentAction(validPayload);

        expect(result).toEqual({ success: false, message: "학생 등록에 실패했습니다." });
    });
});

describe("getStudentListAction", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("page가 음수이면 실패 결과를 반환하고 service를 호출하지 않는다", async () => {
        const result = await getStudentListAction("", -1, 30);

        expect(result).toEqual({
            success: false,
            message: "학생 목록 페이지 조건이 올바르지 않습니다.",
        });
        expect(mockedGetStudentList).not.toHaveBeenCalled();
    });

    it("size가 100을 초과하면 실패 결과를 반환한다", async () => {
        const result = await getStudentListAction("", 0, 101);

        expect(result).toEqual({
            success: false,
            message: "학생 목록 페이지 조건이 올바르지 않습니다.",
        });
        expect(mockedGetStudentList).not.toHaveBeenCalled();
    });

    it("size가 0 미만이면 실패 결과를 반환한다", async () => {
        const result = await getStudentListAction("", 0, 0);

        expect(result).toEqual({
            success: false,
            message: "학생 목록 페이지 조건이 올바르지 않습니다.",
        });
    });

    it("조건이 올바르면 service 호출 결과를 반환한다", async () => {
        mockedGetStudentList.mockResolvedValue({
            status: 200,
            code: "OK",
            message: "조회했습니다.",
            data: { content: [], page: 0, size: 30, hasNext: false },
        });

        const result = await getStudentListAction("길동", 0, 30);

        expect(mockedGetStudentList).toHaveBeenCalledWith("길동", 0, 30);
        expect(result).toEqual({
            success: true,
            message: "조회했습니다.",
            data: { content: [], page: 0, size: 30, hasNext: false },
        });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        mockedGetStudentList.mockRejectedValue(new Error("학생 목록 조회에 실패했습니다."));

        const result = await getStudentListAction();

        expect(result).toEqual({ success: false, message: "학생 목록 조회에 실패했습니다." });
    });
});

describe("getStudentDetailAction", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("studentId가 양의 정수가 아니면 실패 결과를 반환한다", async () => {
        const result = await getStudentDetailAction(0);

        expect(result).toEqual({ success: false, message: "학생 번호가 올바르지 않습니다." });
        expect(mockedGetStudentDetail).not.toHaveBeenCalled();
    });

    it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
        mockedGetStudentDetail.mockResolvedValue({
            status: 200,
            code: "OK",
            message: "조회했습니다.",
            data: { studentId: 1 } as never,
        });

        const result = await getStudentDetailAction(1);

        expect(mockedGetStudentDetail).toHaveBeenCalledWith(1);
        expect(result.success).toBe(true);
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        mockedGetStudentDetail.mockRejectedValue(new Error("학생 상세 조회에 실패했습니다."));

        const result = await getStudentDetailAction(1);

        expect(result).toEqual({ success: false, message: "학생 상세 조회에 실패했습니다." });
    });
});

describe("updateStudentAction", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("studentId가 양의 정수가 아니면 실패 결과를 반환한다", async () => {
        const result = await updateStudentAction(-1, validPayload);

        expect(result).toEqual({ success: false, message: "학생 번호가 올바르지 않습니다." });
        expect(mockedUpdateStudent).not.toHaveBeenCalled();
    });

    it("이름이 비어있으면 실패 결과를 반환한다", async () => {
        const result = await updateStudentAction(1, { name: "   ", grade: "MIDDLE_1" });

        expect(result).toEqual({
            success: false,
            message: "학생 이름은 1자 이상 50자 이하로 입력해주세요.",
        });
        expect(mockedUpdateStudent).not.toHaveBeenCalled();
    });

    it("이름이 50자를 초과하면 실패 결과를 반환한다", async () => {
        const result = await updateStudentAction(1, { name: "a".repeat(51), grade: "MIDDLE_1" });

        expect(result).toEqual({
            success: false,
            message: "학생 이름은 1자 이상 50자 이하로 입력해주세요.",
        });
    });

    it("학년이 올바르지 않으면 실패 결과를 반환한다", async () => {
        const result = await updateStudentAction(1, {
            name: "홍길동",
            grade: "INVALID" as never,
        });

        expect(result).toEqual({ success: false, message: "학생 학년이 올바르지 않습니다." });
    });

    it("학교명이 100자를 초과하면 실패 결과를 반환한다", async () => {
        const result = await updateStudentAction(1, {
            ...validPayload,
            school: "a".repeat(101),
        });

        expect(result).toEqual({
            success: false,
            message: "학생 정보의 글자 수가 올바르지 않습니다.",
        });
    });

    it("특이사항이 500자를 초과하면 실패 결과를 반환한다", async () => {
        const result = await updateStudentAction(1, {
            ...validPayload,
            note: "a".repeat(501),
        });

        expect(result).toEqual({
            success: false,
            message: "학생 정보의 글자 수가 올바르지 않습니다.",
        });
    });

    it("입력값이 올바르면 service 호출 후 성공 결과를 반환한다", async () => {
        mockedUpdateStudent.mockResolvedValue(undefined);

        const result = await updateStudentAction(1, validPayload);

        expect(mockedUpdateStudent).toHaveBeenCalledWith(1, validPayload);
        expect(result).toEqual({ success: true, message: "학생 정보 수정에 성공했습니다." });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        mockedUpdateStudent.mockRejectedValue(new Error("학생 정보 수정에 실패했습니다."));

        const result = await updateStudentAction(1, validPayload);

        expect(result).toEqual({ success: false, message: "학생 정보 수정에 실패했습니다." });
    });
});

describe("deleteStudentAction", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("studentId가 양의 정수가 아니면 실패 결과를 반환한다", async () => {
        const result = await deleteStudentAction(0);

        expect(result).toEqual({ success: false, message: "학생 번호가 올바르지 않습니다." });
        expect(mockedDeleteStudent).not.toHaveBeenCalled();
    });

    it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
        mockedDeleteStudent.mockResolvedValue(undefined);

        const result = await deleteStudentAction(1);

        expect(mockedDeleteStudent).toHaveBeenCalledWith(1);
        expect(result).toEqual({ success: true, message: "학생 삭제에 성공했습니다." });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        mockedDeleteStudent.mockRejectedValue(new Error("학생 삭제에 실패했습니다."));

        const result = await deleteStudentAction(1);

        expect(result).toEqual({ success: false, message: "학생 삭제에 실패했습니다." });
    });
});

describe("createStudentEnrollmentAction", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    const buildFormData = (lectureId: string) => {
        const formData = new FormData();
        formData.set("lectureId", lectureId);
        return formData;
    };

    it("studentId 또는 lectureId가 올바르지 않으면 실패 결과를 반환한다", async () => {
        const result = await createStudentEnrollmentAction(
            0,
            { success: false, message: "" },
            buildFormData("1"),
        );

        expect(result).toEqual({
            success: false,
            message: "학생 또는 강의 번호가 올바르지 않습니다.",
        });
        expect(mockedCreateStudentEnrollment).not.toHaveBeenCalled();
    });

    it("lectureId가 숫자가 아니면 실패 결과를 반환한다", async () => {
        const result = await createStudentEnrollmentAction(
            1,
            { success: false, message: "" },
            buildFormData(""),
        );

        expect(result).toEqual({
            success: false,
            message: "학생 또는 강의 번호가 올바르지 않습니다.",
        });
    });

    it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
        mockedCreateStudentEnrollment.mockResolvedValue({
            status: 200,
            code: "OK",
            message: "등록했습니다.",
            data: { enrollmentId: 1 },
        });

        const result = await createStudentEnrollmentAction(
            1,
            { success: false, message: "" },
            buildFormData("2"),
        );

        expect(mockedCreateStudentEnrollment).toHaveBeenCalledWith(1, { lectureId: 2 });
        expect(result).toEqual({
            success: true,
            message: "등록했습니다.",
            data: { enrollmentId: 1 },
        });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        mockedCreateStudentEnrollment.mockRejectedValue(new Error("학생 수강 등록에 실패했습니다."));

        const result = await createStudentEnrollmentAction(
            1,
            { success: false, message: "" },
            buildFormData("2"),
        );

        expect(result).toEqual({ success: false, message: "학생 수강 등록에 실패했습니다." });
    });
});

describe("endStudentEnrollmentAction", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("studentId 또는 enrollmentId가 올바르지 않으면 실패 결과를 반환한다", async () => {
        const result = await endStudentEnrollmentAction(0, 1);

        expect(result).toEqual({
            success: false,
            message: "학생 또는 수강 번호가 올바르지 않습니다.",
        });
        expect(mockedEndStudentEnrollment).not.toHaveBeenCalled();
    });

    it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
        mockedEndStudentEnrollment.mockResolvedValue(undefined);

        const result = await endStudentEnrollmentAction(1, 2);

        expect(mockedEndStudentEnrollment).toHaveBeenCalledWith(1, 2);
        expect(result).toEqual({ success: true, message: "학생 수강 종료에 성공했습니다." });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        mockedEndStudentEnrollment.mockRejectedValue(new Error("학생 수강 종료에 실패했습니다."));

        const result = await endStudentEnrollmentAction(1, 2);

        expect(result).toEqual({ success: false, message: "학생 수강 종료에 실패했습니다." });
    });
});
