import { fireEvent, render, screen } from "@testing-library/react";
import SharedFolderCreateNewFolderModal from "./SharedFolderCreateNewFolderModal";

describe("SharedFolderCreateNewFolderModal", () => {
  it("폴더 이름을 입력하지 않으면 만들기 버튼이 비활성화된다", () => {
    render(
      <SharedFolderCreateNewFolderModal
        currentPath="공유파일 루트"
        isSubmitting={false}
        onClose={jest.fn()}
        onCreate={jest.fn()}
      />
    );

    expect(screen.getByRole("button", { name: "만들기" })).toBeDisabled();
  });

  it("폴더 이름을 입력하면 만들기 버튼이 활성화되고 클릭 시 트리밍된 이름으로 생성 콜백을 호출한다", () => {
    const onCreate = jest.fn();

    render(
      <SharedFolderCreateNewFolderModal
        currentPath="공유파일 루트"
        isSubmitting={false}
        onClose={jest.fn()}
        onCreate={onCreate}
      />
    );

    fireEvent.change(screen.getByLabelText("폴더 이름"), { target: { value: "  새 폴더  " } });
    const createButton = screen.getByRole("button", { name: "만들기" });
    expect(createButton).not.toBeDisabled();

    fireEvent.click(createButton);

    expect(onCreate).toHaveBeenCalledWith("새 폴더");
  });

  it("요청 중이면 만들기 버튼이 비활성화되고 문구가 바뀐다", () => {
    render(
      <SharedFolderCreateNewFolderModal
        currentPath="공유파일 루트"
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
      <SharedFolderCreateNewFolderModal
        currentPath="공유파일 루트"
        isSubmitting={false}
        onClose={onClose}
        onCreate={jest.fn()}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "취소" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
