import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { updateLectureAction } from "../../actions";
import { LectureDetailData } from "../../type";
import EditLectureModal from "./EditLectureModal";

const push = jest.fn();
const refresh = jest.fn();

jest.mock("../../actions", () => ({
    updateLectureAction: jest.fn(),
}));

jest.mock("next/navigation", () => ({
    useRouter: () => ({ push, refresh }),
}));

jest.mock("sonner", () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

const mockedUpdateLectureAction = updateLectureAction as jest.Mock;

const baseLecture: LectureDetailData = {
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
    students: [],
    createdAt: "2026-01-01T00:00:00",
};

const renderModal = (closeModal = jest.fn(), onUpdated = jest.fn()) => {
    render(
        <EditLectureModal
            closeModal={closeModal}
            lecture={baseLecture}
            lectureId={1}
            onUpdated={onUpdated}
        />,
    );
    return { closeModal, onUpdated };
};

const submitForm = () => {
    fireEvent.submit(screen.getByRole("button", { name: "수정 완료" }).closest("form")!);
};

afterEach(() => {
    jest.clearAllMocks();
});

describe("EditLectureModal", () => {
    it("기존 강의 정보를 초기값으로 표시한다", () => {
        renderModal();

        expect(screen.getByLabelText("강의명 *")).toHaveValue("고1 수학 정규반");
        expect(screen.getByLabelText("강의실 코드 *")).toHaveValue("A101");
        expect(screen.getByLabelText("금액 (원)")).toHaveValue(300000);
    });

    it("강의명을 비우고 제출하면 에러 메시지를 노출한다", async () => {
        renderModal();

        fireEvent.change(screen.getByLabelText("강의명 *"), { target: { value: "" } });
        submitForm();

        await waitFor(() => {
            expect(screen.getByText("강의명을 입력해주세요.")).toBeInTheDocument();
        });
        expect(mockedUpdateLectureAction).not.toHaveBeenCalled();
    });

    it("값을 수정하고 제출하면 수정 액션을 호출하고 상세·목록을 갱신한다", async () => {
        mockedUpdateLectureAction.mockResolvedValue({ success: true, message: "강의 수정에 성공했습니다." });
        const { closeModal, onUpdated } = renderModal();

        fireEvent.change(screen.getByLabelText("강의명 *"), { target: { value: "고1 수학 정규반(수정)" } });
        submitForm();

        await waitFor(() => expect(mockedUpdateLectureAction).toHaveBeenCalledTimes(1));
        expect(mockedUpdateLectureAction.mock.calls[0][0]).toBe(1);
        const submittedFormData = mockedUpdateLectureAction.mock.calls[0][2] as FormData;
        expect(submittedFormData.get("name")).toBe("고1 수학 정규반(수정)");
        expect(toast.success).toHaveBeenCalledWith("강의 수정에 성공했습니다.");
        expect(closeModal).toHaveBeenCalledTimes(1);
        await waitFor(() => expect(onUpdated).toHaveBeenCalledTimes(1));
        expect(refresh).toHaveBeenCalledTimes(1);
    });

    it("수정에 실패하면 오류 토스트를 노출하고 모달을 닫지 않는다", async () => {
        mockedUpdateLectureAction.mockResolvedValue({ success: false, message: "강의 수정에 실패했습니다." });
        const { closeModal, onUpdated } = renderModal();

        submitForm();

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("강의 수정에 실패했습니다.");
        });
        expect(closeModal).not.toHaveBeenCalled();
        expect(onUpdated).not.toHaveBeenCalled();
    });

    it("닫기 버튼을 클릭하면 모달이 닫힌다", () => {
        const { closeModal } = renderModal();

        fireEvent.click(screen.getByLabelText("강의 수정 모달 닫기"));

        expect(closeModal).toHaveBeenCalledTimes(1);
    });
});
