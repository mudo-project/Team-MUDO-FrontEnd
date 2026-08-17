import { act, fireEvent, render, screen } from "@testing-library/react";
import { useUserStore } from "../../../../store/useUserStore";
import { getLectureDetailAction } from "../../actions";
import { LectureDetailData } from "../../type";
import ViewLectureModal from "./ViewLectureModal";

jest.mock("../../actions", () => ({
    getLectureDetailAction: jest.fn(),
}));

jest.mock("../LectureUpdateButton", () => jest.fn(() => <div data-testid="lecture-update-button-stub" />));
jest.mock("../LectureDeleteButton", () => jest.fn(() => <div data-testid="lecture-delete-button-stub" />));

const mockedGetLectureDetailAction = getLectureDetailAction as jest.Mock;

const baseDetail: LectureDetailData = {
    id: 1,
    name: "고1 수학 정규반",
    classType: "CLASS",
    grade: "HIGH_1",
    termName: "1학기",
    subjectName: "수학",
    teacherId: 1,
    teacherName: "김선생",
    classroomCode: "A101",
    classroomName: "A동 101호",
    feeType: "PER_MONTH",
    feeAmount: 300000,
    schedules: [{ dayOfWeek: "MONDAY", startTime: "09:00:00", endTime: "10:00:00" }],
    students: [{ id: 1, name: "홍길동", grade: "HIGH_1" }],
    createdAt: "2026-01-05T00:00:00",
};

afterEach(() => {
    jest.clearAllMocks();
    act(() => {
        useUserStore.getState().clearPermissions();
    });
});

describe("ViewLectureModal", () => {
    it("강의 정보를 불러오는 중에는 로딩 문구를 표시한다", () => {
        mockedGetLectureDetailAction.mockReturnValue(new Promise(() => {}));

        render(<ViewLectureModal closeModal={jest.fn()} lectureId={1} />);

        expect(screen.getByText("강의 정보를 불러오는 중입니다.")).toBeInTheDocument();
    });

    it("조회에 실패하면 오류 메시지를 표시한다", async () => {
        mockedGetLectureDetailAction.mockResolvedValue({
            success: false,
            message: "강의 상세 조회에 실패했습니다.",
        });

        render(<ViewLectureModal closeModal={jest.fn()} lectureId={1} />);

        expect(await screen.findByText("강의 상세 조회에 실패했습니다.")).toBeInTheDocument();
        expect(screen.queryByText("강의 정보를 불러오는 중입니다.")).not.toBeInTheDocument();
    });

    it("조회에 성공하면 강의 상세 정보를 표시한다", async () => {
        mockedGetLectureDetailAction.mockResolvedValue({ success: true, data: baseDetail });

        render(<ViewLectureModal closeModal={jest.fn()} lectureId={1} />);

        const heading = await screen.findByRole("heading", { name: "고1 수학 정규반" });
        const article = heading.closest("article")!;

        expect(article).toHaveTextContent("정규반");
        expect(article).toHaveTextContent("고1");
        expect(article).toHaveTextContent("수학");
        expect(article).toHaveTextContent("1학기");
        expect(article).toHaveTextContent("김선생");
        expect(article).toHaveTextContent("A동 101호 (A101)");
        expect(article).toHaveTextContent("월정액");
        expect(article).toHaveTextContent("300,000원");
        expect(article).toHaveTextContent("09:00:00 ~ 10:00:00");
        expect(article).toHaveTextContent("수강생 1명");
        expect(article).toHaveTextContent("홍길동");
        expect(article).toHaveTextContent("2026-01-05");
    });

    it("수강생이 없으면 안내 문구를 표시한다", async () => {
        mockedGetLectureDetailAction.mockResolvedValue({
            success: true,
            data: { ...baseDetail, students: [] },
        });

        render(<ViewLectureModal closeModal={jest.fn()} lectureId={1} />);

        expect(await screen.findByText("수강생이 없습니다.")).toBeInTheDocument();
    });

    it("LECTURE:MANAGE 권한이 없으면 수정·삭제 버튼을 표시하지 않는다", async () => {
        mockedGetLectureDetailAction.mockResolvedValue({ success: true, data: baseDetail });

        render(<ViewLectureModal closeModal={jest.fn()} lectureId={1} />);

        await screen.findByRole("heading", { name: "고1 수학 정규반" });
        expect(screen.queryByTestId("lecture-update-button-stub")).not.toBeInTheDocument();
        expect(screen.queryByTestId("lecture-delete-button-stub")).not.toBeInTheDocument();
    });

    it("LECTURE:MANAGE 권한이 있으면 수정·삭제 버튼을 표시한다", async () => {
        act(() => {
            useUserStore.getState().setPermissions(["LECTURE:MANAGE"]);
        });
        mockedGetLectureDetailAction.mockResolvedValue({ success: true, data: baseDetail });

        render(<ViewLectureModal closeModal={jest.fn()} lectureId={1} />);

        expect(await screen.findByTestId("lecture-update-button-stub")).toBeInTheDocument();
        expect(screen.getByTestId("lecture-delete-button-stub")).toBeInTheDocument();
    });

    it("닫기 버튼을 클릭하면 모달이 닫힌다", async () => {
        mockedGetLectureDetailAction.mockResolvedValue({ success: true, data: baseDetail });
        const closeModal = jest.fn();

        render(<ViewLectureModal closeModal={closeModal} lectureId={1} />);

        await screen.findByRole("heading", { name: "고1 수학 정규반" });
        fireEvent.click(screen.getByLabelText("강의 상세 모달 닫기"));

        expect(closeModal).toHaveBeenCalledTimes(1);
    });
});
