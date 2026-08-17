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
} from "../../service/lecture.service";
import {
    createLectureAction,
    deleteLectureAction,
    getLectureClassroomsAction,
    getLectureDetailAction,
    getLectureListAction,
    getLectureSubjectsAction,
    getLectureTeachersAction,
    getLectureTermsAction,
    updateLectureAction,
} from "./actions";

jest.mock("../../service/lecture.service", () => ({
    createLecture: jest.fn(),
    deleteLecture: jest.fn(),
    getLectureClassrooms: jest.fn(),
    getLectureDetail: jest.fn(),
    getLectureList: jest.fn(),
    getLectureSubjects: jest.fn(),
    getLectureTeachers: jest.fn(),
    getLectureTerms: jest.fn(),
    updateLecture: jest.fn(),
}));

const mockedGetLectureList = getLectureList as jest.Mock;
const mockedGetLectureDetail = getLectureDetail as jest.Mock;
const mockedCreateLecture = createLecture as jest.Mock;
const mockedUpdateLecture = updateLecture as jest.Mock;
const mockedDeleteLecture = deleteLecture as jest.Mock;
const mockedGetLectureTeachers = getLectureTeachers as jest.Mock;
const mockedGetLectureSubjects = getLectureSubjects as jest.Mock;
const mockedGetLectureClassrooms = getLectureClassrooms as jest.Mock;
const mockedGetLectureTerms = getLectureTerms as jest.Mock;

afterEach(() => {
    jest.clearAllMocks();
});

interface ScheduleFieldInput {
    dayOfWeek: string;
    startTime: string;
    endTime: string;
}

const buildLectureFormData = (
    fields: Record<string, string> = {},
    schedules: ScheduleFieldInput[] = [{ dayOfWeek: "MONDAY", startTime: "09:00", endTime: "10:00" }],
) => {
    const formData = new FormData();
    formData.set("name", fields.name ?? "고1 수학");
    formData.set("classType", fields.classType ?? "CLASS");
    formData.set("classroomCode", fields.classroomCode ?? "A101");
    if (fields.grade !== undefined) formData.set("grade", fields.grade);
    if (fields.teacherName !== undefined) formData.set("teacherName", fields.teacherName);
    if (fields.subjectName !== undefined) formData.set("subjectName", fields.subjectName);
    if (fields.termName !== undefined) formData.set("termName", fields.termName);
    if (fields.feeType !== undefined) formData.set("feeType", fields.feeType);
    if (fields.feeAmount !== undefined) formData.set("feeAmount", fields.feeAmount);

    schedules.forEach((schedule) => {
        formData.append("dayOfWeek", schedule.dayOfWeek);
        formData.append("startTime", schedule.startTime);
        formData.append("endTime", schedule.endTime);
    });

    return formData;
};

describe("getLectureListAction", () => {
    it("조회 조건 없이 호출하면 목록을 담아 성공 결과를 반환한다", async () => {
        mockedGetLectureList.mockResolvedValue({
            message: "조회했습니다.",
            data: { content: [], page: 0, size: 30, hasNext: false },
        });

        const result = await getLectureListAction();

        expect(mockedGetLectureList).toHaveBeenCalledWith({});
        expect(result).toEqual({
            success: true,
            message: "조회했습니다.",
            data: { content: [], page: 0, size: 30, hasNext: false },
        });
    });

    it("termId가 0 이하이면 조회하지 않고 실패 결과를 반환한다", async () => {
        const result = await getLectureListAction({ termId: 0 });

        expect(result).toEqual({ success: false, message: "강의 목록 조회 조건이 올바르지 않습니다." });
        expect(mockedGetLectureList).not.toHaveBeenCalled();
    });

    it("page가 음수이면 조회하지 않고 실패 결과를 반환한다", async () => {
        const result = await getLectureListAction({ page: -1 });

        expect(result).toEqual({ success: false, message: "강의 목록 조회 조건이 올바르지 않습니다." });
        expect(mockedGetLectureList).not.toHaveBeenCalled();
    });

    it("size가 100을 초과하면 조회하지 않고 실패 결과를 반환한다", async () => {
        const result = await getLectureListAction({ size: 101 });

        expect(result).toEqual({ success: false, message: "강의 목록 조회 조건이 올바르지 않습니다." });
        expect(mockedGetLectureList).not.toHaveBeenCalled();
    });

    it("service 호출이 실패하면 에러 메시지와 함께 실패 결과를 반환한다", async () => {
        mockedGetLectureList.mockRejectedValue(new Error("강의 목록 조회에 실패했습니다."));

        const result = await getLectureListAction();

        expect(result).toEqual({ success: false, message: "강의 목록 조회에 실패했습니다." });
    });
});

describe("getLectureDetailAction", () => {
    it("강의 번호가 0 이하이면 조회하지 않고 실패 결과를 반환한다", async () => {
        const result = await getLectureDetailAction(0);

        expect(result).toEqual({ success: false, message: "강의 번호가 올바르지 않습니다." });
        expect(mockedGetLectureDetail).not.toHaveBeenCalled();
    });

    it("조회에 성공하면 강의 상세 정보를 담아 성공 결과를 반환한다", async () => {
        mockedGetLectureDetail.mockResolvedValue({ message: "조회했습니다.", data: { id: 1 } });

        const result = await getLectureDetailAction(1);

        expect(mockedGetLectureDetail).toHaveBeenCalledWith(1);
        expect(result).toEqual({ success: true, message: "조회했습니다.", data: { id: 1 } });
    });

    it("service 호출이 실패하면 에러 메시지와 함께 실패 결과를 반환한다", async () => {
        mockedGetLectureDetail.mockRejectedValue(new Error("강의 상세 조회에 실패했습니다."));

        const result = await getLectureDetailAction(1);

        expect(result).toEqual({ success: false, message: "강의 상세 조회에 실패했습니다." });
    });
});

describe("createLectureAction", () => {
    const prevState = { success: false, message: "" };

    it("강의명이 비어있으면 실패 결과를 반환한다", async () => {
        const result = await createLectureAction(prevState, buildLectureFormData({ name: "" }));

        expect(result).toEqual({ success: false, message: "강의명을 입력해주세요." });
        expect(mockedCreateLecture).not.toHaveBeenCalled();
    });

    it("강의 유형이 올바르지 않으면 실패 결과를 반환한다", async () => {
        const result = await createLectureAction(prevState, buildLectureFormData({ classType: "UNKNOWN" }));

        expect(result).toEqual({ success: false, message: "강의 유형이 올바르지 않습니다." });
    });

    it("강의실 코드가 비어있으면 실패 결과를 반환한다", async () => {
        const result = await createLectureAction(prevState, buildLectureFormData({ classroomCode: "" }));

        expect(result).toEqual({ success: false, message: "강의실 코드를 입력해주세요." });
    });

    it("강의 시간이 하나도 없으면 실패 결과를 반환한다", async () => {
        const result = await createLectureAction(prevState, buildLectureFormData({}, []));

        expect(result).toEqual({ success: false, message: "강의 시간을 한 개 이상 입력해주세요." });
    });

    it("강의 요일이 올바르지 않으면 실패 결과를 반환한다", async () => {
        const result = await createLectureAction(
            prevState,
            buildLectureFormData({}, [{ dayOfWeek: "FUNDAY", startTime: "09:00", endTime: "10:00" }]),
        );

        expect(result).toEqual({ success: false, message: "강의 요일이 올바르지 않습니다." });
    });

    it("강의 시간 형식이 올바르지 않으면 실패 결과를 반환한다", async () => {
        const result = await createLectureAction(
            prevState,
            buildLectureFormData({}, [{ dayOfWeek: "MONDAY", startTime: "9:00", endTime: "10:00" }]),
        );

        expect(result).toEqual({ success: false, message: "강의 시간을 입력해주세요." });
    });

    it("시작 시간이 종료 시간보다 늦으면 실패 결과를 반환한다", async () => {
        const result = await createLectureAction(
            prevState,
            buildLectureFormData({}, [{ dayOfWeek: "MONDAY", startTime: "10:00", endTime: "09:00" }]),
        );

        expect(result).toEqual({ success: false, message: "시작 시간은 종료 시간보다 빨라야 합니다." });
    });

    it("학년이 올바르지 않으면 실패 결과를 반환한다", async () => {
        const result = await createLectureAction(prevState, buildLectureFormData({ grade: "GRADE_X" }));

        expect(result).toEqual({ success: false, message: "강의 학년이 올바르지 않습니다." });
    });

    it("수강료 유형이 올바르지 않으면 실패 결과를 반환한다", async () => {
        const result = await createLectureAction(prevState, buildLectureFormData({ feeType: "PER_WEEK" }));

        expect(result).toEqual({ success: false, message: "수강료 유형이 올바르지 않습니다." });
    });

    it("수강료 금액이 음수이면 실패 결과를 반환한다", async () => {
        const result = await createLectureAction(prevState, buildLectureFormData({ feeAmount: "-1" }));

        expect(result).toEqual({ success: false, message: "수강료 금액이 올바르지 않습니다." });
    });

    it("입력값이 올바르면 강의를 등록하고 성공 결과를 반환한다", async () => {
        mockedCreateLecture.mockResolvedValue({ message: "강의 등록에 성공했습니다.", data: { lectureId: 1 } });

        const result = await createLectureAction(prevState, buildLectureFormData());

        expect(mockedCreateLecture).toHaveBeenCalledWith({
            name: "고1 수학",
            classType: "CLASS",
            classroomCode: "A101",
            schedules: [{ dayOfWeek: "MONDAY", startTime: "09:00:00", endTime: "10:00:00" }],
            grade: undefined,
            teacherName: undefined,
            subjectName: undefined,
            termName: undefined,
            feeType: undefined,
            feeAmount: undefined,
        });
        expect(result).toEqual({ success: true, message: "강의 등록에 성공했습니다.", data: { lectureId: 1 } });
    });

    it("service 호출이 실패하면 에러 메시지와 함께 실패 결과를 반환한다", async () => {
        mockedCreateLecture.mockRejectedValue(new Error("강의 등록에 실패했습니다."));

        const result = await createLectureAction(prevState, buildLectureFormData());

        expect(result).toEqual({ success: false, message: "강의 등록에 실패했습니다." });
    });

    it("Error가 아닌 값이 던져지면 기본 실패 메시지를 반환한다", async () => {
        mockedCreateLecture.mockImplementation(() => {
            throw "unexpected";
        });

        const result = await createLectureAction(prevState, buildLectureFormData());

        expect(result).toEqual({ success: false, message: "강의 등록에 실패했습니다." });
    });
});

describe("updateLectureAction", () => {
    const prevState = { success: false, message: "" };

    it("강의 번호가 0 이하이면 실패 결과를 반환한다", async () => {
        const result = await updateLectureAction(0, prevState, buildLectureFormData());

        expect(result).toEqual({ success: false, message: "강의 번호가 올바르지 않습니다." });
        expect(mockedUpdateLecture).not.toHaveBeenCalled();
    });

    it("입력값이 올바르지 않으면 실패 결과를 반환한다", async () => {
        const result = await updateLectureAction(1, prevState, buildLectureFormData({ name: "" }));

        expect(result).toEqual({ success: false, message: "강의명을 입력해주세요." });
        expect(mockedUpdateLecture).not.toHaveBeenCalled();
    });

    it("입력값이 올바르면 강의를 수정하고 성공 결과를 반환한다", async () => {
        mockedUpdateLecture.mockResolvedValue({ message: "강의 수정에 성공했습니다." });

        const result = await updateLectureAction(1, prevState, buildLectureFormData());

        expect(mockedUpdateLecture).toHaveBeenCalledWith(1, expect.objectContaining({ name: "고1 수학" }));
        expect(result).toEqual({ success: true, message: "강의 수정에 성공했습니다." });
    });

    it("service 호출이 실패하면 에러 메시지와 함께 실패 결과를 반환한다", async () => {
        mockedUpdateLecture.mockRejectedValue(new Error("강의 수정에 실패했습니다."));

        const result = await updateLectureAction(1, prevState, buildLectureFormData());

        expect(result).toEqual({ success: false, message: "강의 수정에 실패했습니다." });
    });
});

describe("deleteLectureAction", () => {
    it("강의 번호가 0 이하이면 실패 결과를 반환한다", async () => {
        const result = await deleteLectureAction(0);

        expect(result).toEqual({ success: false, message: "강의 번호가 올바르지 않습니다." });
        expect(mockedDeleteLecture).not.toHaveBeenCalled();
    });

    it("삭제에 성공하면 성공 결과를 반환한다", async () => {
        mockedDeleteLecture.mockResolvedValue(undefined);

        const result = await deleteLectureAction(1);

        expect(mockedDeleteLecture).toHaveBeenCalledWith(1);
        expect(result).toEqual({ success: true, message: "강의 삭제에 성공했습니다." });
    });

    it("service 호출이 실패하면 에러 메시지와 함께 실패 결과를 반환한다", async () => {
        mockedDeleteLecture.mockRejectedValue(new Error("강의 삭제에 실패했습니다."));

        const result = await deleteLectureAction(1);

        expect(result).toEqual({ success: false, message: "강의 삭제에 실패했습니다." });
    });

    it("Error가 아닌 값이 던져지면 기본 실패 메시지를 반환한다", async () => {
        mockedDeleteLecture.mockImplementation(() => {
            throw "unexpected";
        });

        const result = await deleteLectureAction(1);

        expect(result).toEqual({ success: false, message: "강의 삭제에 실패했습니다." });
    });
});

describe("getLectureTeachersAction", () => {
    it("service 호출이 성공하면 선생님 목록을 담아 성공 결과를 반환한다", async () => {
        mockedGetLectureTeachers.mockResolvedValue({ message: "조회했습니다.", data: ["김선생"] });

        const result = await getLectureTeachersAction();

        expect(result).toEqual({ success: true, message: "조회했습니다.", data: ["김선생"] });
    });

    it("service 호출이 실패하면 에러 메시지와 함께 실패 결과를 반환한다", async () => {
        mockedGetLectureTeachers.mockRejectedValue(new Error("강의 담당 선생님 목록 조회에 실패했습니다."));

        const result = await getLectureTeachersAction();

        expect(result).toEqual({ success: false, message: "강의 담당 선생님 목록 조회에 실패했습니다." });
    });
});

describe("getLectureSubjectsAction", () => {
    it("service 호출이 성공하면 과목 목록을 담아 성공 결과를 반환한다", async () => {
        mockedGetLectureSubjects.mockResolvedValue({ message: "조회했습니다.", data: ["수학"] });

        const result = await getLectureSubjectsAction();

        expect(result).toEqual({ success: true, message: "조회했습니다.", data: ["수학"] });
    });

    it("service 호출이 실패하면 에러 메시지와 함께 실패 결과를 반환한다", async () => {
        mockedGetLectureSubjects.mockRejectedValue(new Error("강의 과목 목록 조회에 실패했습니다."));

        const result = await getLectureSubjectsAction();

        expect(result).toEqual({ success: false, message: "강의 과목 목록 조회에 실패했습니다." });
    });
});

describe("getLectureClassroomsAction", () => {
    it("service 호출이 성공하면 강의실 목록을 담아 성공 결과를 반환한다", async () => {
        mockedGetLectureClassrooms.mockResolvedValue({ message: "조회했습니다.", data: ["A101"] });

        const result = await getLectureClassroomsAction();

        expect(result).toEqual({ success: true, message: "조회했습니다.", data: ["A101"] });
    });

    it("service 호출이 실패하면 에러 메시지와 함께 실패 결과를 반환한다", async () => {
        mockedGetLectureClassrooms.mockRejectedValue(new Error("강의실 목록 조회에 실패했습니다."));

        const result = await getLectureClassroomsAction();

        expect(result).toEqual({ success: false, message: "강의실 목록 조회에 실패했습니다." });
    });
});

describe("getLectureTermsAction", () => {
    it("service 호출이 성공하면 학기 목록을 담아 성공 결과를 반환한다", async () => {
        mockedGetLectureTerms.mockResolvedValue({
            message: "조회했습니다.",
            data: [{ termId: 1, termName: "1학기" }],
        });

        const result = await getLectureTermsAction();

        expect(result).toEqual({
            success: true,
            message: "조회했습니다.",
            data: [{ termId: 1, termName: "1학기" }],
        });
    });

    it("service 호출이 실패하면 에러 메시지와 함께 실패 결과를 반환한다", async () => {
        mockedGetLectureTerms.mockRejectedValue(new Error("강의 학기 목록 조회에 실패했습니다."));

        const result = await getLectureTermsAction();

        expect(result).toEqual({ success: false, message: "강의 학기 목록 조회에 실패했습니다." });
    });
});
