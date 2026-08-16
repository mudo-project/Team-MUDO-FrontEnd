import { fireEvent, render, screen } from "@testing-library/react";
import SharedFolderCreateGoogleModal from "./SharedFolderCreateGoogleModal";

describe("SharedFolderCreateGoogleModal", () => {
  it("파일 이름을 입력하지 않고 만들기를 클릭하면 종류별 기본 이름으로 생성 콜백을 호출한다", () => {
    const onCreate = jest.fn();

    render(
      <SharedFolderCreateGoogleModal
        fileType="GOOGLE_DOCS"
        isSubmitting={false}
        onClose={jest.fn()}
        onCreate={onCreate}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "만들기" }));

    expect(onCreate).toHaveBeenCalledWith("제목 없는 문서");
  });

  it("파일 이름을 입력하고 만들기를 클릭하면 트리밍된 이름으로 생성 콜백을 호출한다", () => {
    const onCreate = jest.fn();

    render(
      <SharedFolderCreateGoogleModal
        fileType="GOOGLE_SHEETS"
        isSubmitting={false}
        onClose={jest.fn()}
        onCreate={onCreate}
      />
    );

    fireEvent.change(screen.getByLabelText("파일 이름"), { target: { value: "  매출 시트  " } });
    fireEvent.click(screen.getByRole("button", { name: "만들기" }));

    expect(onCreate).toHaveBeenCalledWith("매출 시트");
  });

  it("fileType에 따라 제목이 바뀐다", () => {
    render(
      <SharedFolderCreateGoogleModal
        fileType="GOOGLE_SLIDES"
        isSubmitting={false}
        onClose={jest.fn()}
        onCreate={jest.fn()}
      />
    );

    expect(screen.getByText("Google Slides 만들기")).toBeInTheDocument();
  });

  it("요청 중이면 만들기 버튼이 비활성화되고 문구가 바뀐다", () => {
    render(
      <SharedFolderCreateGoogleModal
        fileType="GOOGLE_DOCS"
        isSubmitting
        onClose={jest.fn()}
        onCreate={jest.fn()}
      />
    );

    expect(screen.getByRole("button", { name: "만드는 중..." })).toBeDisabled();
  });

  it("취소를 클릭하면 닫기 콜백을 호출한다", () => {
    const onClose = jest.fn();

    render(
      <SharedFolderCreateGoogleModal
        fileType="GOOGLE_DOCS"
        isSubmitting={false}
        onClose={onClose}
        onCreate={jest.fn()}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "취소" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
