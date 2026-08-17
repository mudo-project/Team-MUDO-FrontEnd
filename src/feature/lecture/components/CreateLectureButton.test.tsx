import { act, fireEvent, render, screen } from "@testing-library/react";
import { useUserStore } from "../../../store/useUserStore";
import CreateLectureButton from "./CreateLectureButton";

jest.mock("./modal/CreateLectureModal", () => jest.fn(() => <div data-testid="create-lecture-modal-stub" />));

afterEach(() => {
    act(() => {
        useUserStore.getState().clearPermissions();
    });
});

describe("CreateLectureButton", () => {
    it("LECTURE:MANAGE 권한이 없으면 강의 등록 버튼을 표시하지 않는다", () => {
        render(<CreateLectureButton />);

        expect(screen.queryByRole("button", { name: "강의 등록" })).not.toBeInTheDocument();
    });

    it("LECTURE:MANAGE 권한이 있으면 강의 등록 버튼을 표시한다", () => {
        act(() => {
            useUserStore.getState().setPermissions(["LECTURE:MANAGE"]);
        });

        render(<CreateLectureButton />);

        expect(screen.getByRole("button", { name: "강의 등록" })).toBeInTheDocument();
    });

    it("강의 등록 버튼을 클릭하면 등록 모달이 열린다", () => {
        act(() => {
            useUserStore.getState().setPermissions(["LECTURE:MANAGE"]);
        });

        render(<CreateLectureButton />);

        expect(screen.queryByTestId("create-lecture-modal-stub")).not.toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: "강의 등록" }));

        expect(screen.getByTestId("create-lecture-modal-stub")).toBeInTheDocument();
    });
});
