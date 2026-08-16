import { fireEvent, render, screen } from "@testing-library/react";
import NoticeFileUpload from "./NoticeFileUpload";

describe("NoticeFileUpload", () => {
    beforeEach(() => {
        Object.defineProperty(URL, "createObjectURL", {
            configurable: true,
            value: jest.fn(() => "blob:test"),
        });
        Object.defineProperty(URL, "revokeObjectURL", {
            configurable: true,
            value: jest.fn(),
        });
    });

    it("파일을 선택하면 목록에 파일명과 크기가 표시된다", () => {
        render(<NoticeFileUpload />);
        const file = new File(["content"], "공지자료.pdf", { type: "application/pdf" });

        fireEvent.change(screen.getByLabelText("사진·파일을 끌어다 놓거나 클릭해 첨부", { exact: false }), {
            target: { files: [file] },
        });

        expect(screen.getByText("공지자료.pdf")).toBeInTheDocument();
        expect(screen.getByText("7 B")).toBeInTheDocument();
    });

    it("추가한 파일의 삭제 버튼을 클릭하면 목록에서 제거된다", () => {
        render(<NoticeFileUpload />);
        const file = new File(["content"], "공지자료.pdf", { type: "application/pdf" });

        fireEvent.change(screen.getByLabelText("사진·파일을 끌어다 놓거나 클릭해 첨부", { exact: false }), {
            target: { files: [file] },
        });
        fireEvent.click(screen.getByRole("button", { name: "공지자료.pdf 삭제" }));

        expect(screen.queryByText("공지자료.pdf")).not.toBeInTheDocument();
    });

    it("기존 첨부파일이 있으면 목록에 표시되고 삭제할 수 있다", () => {
        render(<NoticeFileUpload initialFiles={[{ name: "이전자료.hwp" }]} />);

        expect(screen.getByText("이전자료.hwp")).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: "이전자료.hwp 삭제" }));

        expect(screen.queryByText("이전자료.hwp")).not.toBeInTheDocument();
    });
});
