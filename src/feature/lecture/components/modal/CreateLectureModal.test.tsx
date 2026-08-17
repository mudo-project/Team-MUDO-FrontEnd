import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { createLectureAction } from "../../actions";
import CreateLectureModal from "./CreateLectureModal";

const push = jest.fn();

jest.mock("../../actions", () => ({
    createLectureAction: jest.fn(),
}));

jest.mock("next/navigation", () => ({
    useRouter: () => ({ push }),
}));

jest.mock("sonner", () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

const mockedCreateLectureAction = createLectureAction as jest.Mock;

const renderModal = (closeModal = jest.fn()) => {
    render(
        <CreateLectureModal
            classrooms={["A101"]}
            closeModal={closeModal}
            subjects={["수학"]}
            teachers={["김선생"]}
            terms={[{ termId: 1, termName: "1학기" }]}
        />,
    );
    return { closeModal };
};

const fillRequiredFields = () => {
    fireEvent.change(screen.getByLabelText("강의명 *"), { target: { value: "고1 수학 정규반" } });
    fireEvent.change(screen.getByLabelText("강의실 코드 *"), { target: { value: "A101" } });
    fireEvent.change(screen.getByLabelText("수업 시작 시간"), { target: { value: "09:00" } });
    fireEvent.change(screen.getByLabelText("수업 종료 시간"), { target: { value: "10:00" } });
};

const submitForm = () => {
    fireEvent.submit(screen.getByRole("button", { name: "강의 등록" }).closest("form")!);
};

afterEach(() => {
    jest.clearAllMocks();
});

describe("CreateLectureModal", () => {
    it("필수 입력값을 입력하지 않고 제출하면 에러 메시지를 노출한다", async () => {
        renderModal();

        submitForm();

        await waitFor(() => {
            expect(screen.getByText("강의명을 입력해주세요.")).toBeInTheDocument();
        });
        expect(screen.getByText("강의실 코드를 입력해주세요.")).toBeInTheDocument();
        expect(mockedCreateLectureAction).not.toHaveBeenCalled();
    });

    it("필수 값을 모두 입력하고 제출하면 등록 액션을 호출하고 목록 화면으로 이동한다", async () => {
        mockedCreateLectureAction.mockResolvedValue({
            success: true,
            message: "강의 등록에 성공했습니다.",
            data: { lectureId: 1 },
        });
        const { closeModal } = renderModal();

        fillRequiredFields();
        submitForm();

        await waitFor(() => expect(mockedCreateLectureAction).toHaveBeenCalledTimes(1));
        const submittedFormData = mockedCreateLectureAction.mock.calls[0][1] as FormData;
        expect(submittedFormData.get("name")).toBe("고1 수학 정규반");
        expect(submittedFormData.get("classroomCode")).toBe("A101");
        expect(toast.success).toHaveBeenCalledWith("강의 등록에 성공했습니다.");
        expect(closeModal).toHaveBeenCalledTimes(1);
        expect(push).toHaveBeenCalledWith("/lecture");
    });

    it("등록에 실패하면 오류 토스트를 노출하고 모달을 닫지 않는다", async () => {
        mockedCreateLectureAction.mockResolvedValue({ success: false, message: "강의 등록에 실패했습니다." });
        const { closeModal } = renderModal();

        fillRequiredFields();
        submitForm();

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("강의 등록에 실패했습니다.");
        });
        expect(closeModal).not.toHaveBeenCalled();
        expect(push).not.toHaveBeenCalled();
    });

    it("닫기 버튼을 클릭하면 모달이 닫힌다", () => {
        const { closeModal } = renderModal();

        fireEvent.click(screen.getByLabelText("강의 등록 모달 닫기"));

        expect(closeModal).toHaveBeenCalledTimes(1);
    });
});
