import { fireEvent, render, screen } from "@testing-library/react";
import InitialFileUploadForm from "./InitialFileUploadForm";

describe("InitialFileUploadForm", () => {
    it("제출하면 FormData와 함께 onSubmit을 호출한다", () => {
        const handleSubmit = jest.fn();
        render(<InitialFileUploadForm error="" isPending={false} onSubmit={handleSubmit} />);

        fireEvent.submit(screen.getByRole("button", { name: "파일 분석 요청" }).closest("form")!);

        expect(handleSubmit).toHaveBeenCalledWith(expect.any(FormData));
    });

    it("에러가 있으면 에러 메시지를 표시한다", () => {
        render(<InitialFileUploadForm error="지원하지 않는 파일 형식입니다." isPending={false} onSubmit={jest.fn()} />);

        expect(screen.getByRole("alert")).toHaveTextContent("지원하지 않는 파일 형식입니다.");
    });

    it("처리 중이면 버튼 문구가 바뀌고 비활성화된다", () => {
        render(<InitialFileUploadForm error="" isPending={true} onSubmit={jest.fn()} />);

        const button = screen.getByRole("button", { name: "파일 분석 중" });
        expect(button).toBeDisabled();
    });

    it("파일을 선택하면 파일명을 표시한다", () => {
        const { container } = render(
            <InitialFileUploadForm error="" isPending={false} onSubmit={jest.fn()} />,
        );

        const file = new File(["content"], "students.csv", { type: "text/csv" });
        const studentInput = container.querySelector('input[name="studentFile"]')!;

        fireEvent.change(studentInput, { target: { files: [file] } });

        expect(screen.getByText("students.csv")).toBeInTheDocument();
    });
});
