import { fireEvent, render, screen } from "@testing-library/react";
import SharedFolderDownloadFormatModal from "./SharedFolderDownloadFormatModal";

describe("SharedFolderDownloadFormatModal", () => {
  it("formats로 전달된 형식만 버튼으로 노출한다", () => {
    render(
      <SharedFolderDownloadFormatModal
        formats={["PDF", "DOCX"]}
        isSubmitting={false}
        itemName="회의록"
        onClose={jest.fn()}
        onSelect={jest.fn()}
      />
    );

    expect(screen.getByRole("button", { name: "PDF" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Word 문서(.docx)" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Excel 통합 문서(.xlsx)" })).not.toBeInTheDocument();
  });

  it("형식을 클릭하면 선택한 형식으로 선택 콜백을 호출한다", () => {
    const onSelect = jest.fn();

    render(
      <SharedFolderDownloadFormatModal
        formats={["PDF", "XLSX"]}
        isSubmitting={false}
        itemName="매출 시트"
        onClose={jest.fn()}
        onSelect={onSelect}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Excel 통합 문서(.xlsx)" }));

    expect(onSelect).toHaveBeenCalledWith("XLSX");
  });

  it("요청 중이면 형식 버튼과 취소 버튼이 모두 비활성화된다", () => {
    render(
      <SharedFolderDownloadFormatModal
        formats={["PDF", "PPTX"]}
        isSubmitting
        itemName="발표 자료"
        onClose={jest.fn()}
        onSelect={jest.fn()}
      />
    );

    expect(screen.getByRole("button", { name: "PDF" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "PowerPoint 프레젠테이션(.pptx)" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "취소" })).toBeDisabled();
  });

  it("취소를 클릭하면 닫기 콜백을 호출한다", () => {
    const onClose = jest.fn();

    render(
      <SharedFolderDownloadFormatModal
        formats={["PDF"]}
        isSubmitting={false}
        itemName="회의록"
        onClose={onClose}
        onSelect={jest.fn()}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "취소" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
