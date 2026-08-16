import { fireEvent, render, screen } from "@testing-library/react";
import SharedFolderEditNameModal from "./SharedFolderEditNameModal";

describe("SharedFolderEditNameModal", () => {
  it("현재 이름으로 입력창이 채워진 상태로 열린다", () => {
    render(
      <SharedFolderEditNameModal
        currentName="기존 폴더"
        isSubmitting={false}
        onClose={jest.fn()}
        onRename={jest.fn()}
      />
    );

    expect(screen.getByLabelText("이름")).toHaveValue("기존 폴더");
  });

  it("이름을 비우면 변경 버튼이 비활성화된다", () => {
    render(
      <SharedFolderEditNameModal
        currentName="기존 폴더"
        isSubmitting={false}
        onClose={jest.fn()}
        onRename={jest.fn()}
      />
    );

    fireEvent.change(screen.getByLabelText("이름"), { target: { value: "   " } });

    expect(screen.getByRole("button", { name: "변경" })).toBeDisabled();
  });

  it("이름을 수정하고 변경을 클릭하면 트리밍된 이름으로 변경 콜백을 호출한다", () => {
    const onRename = jest.fn();

    render(
      <SharedFolderEditNameModal
        currentName="기존 폴더"
        isSubmitting={false}
        onClose={jest.fn()}
        onRename={onRename}
      />
    );

    fireEvent.change(screen.getByLabelText("이름"), { target: { value: "  새 이름  " } });
    fireEvent.click(screen.getByRole("button", { name: "변경" }));

    expect(onRename).toHaveBeenCalledWith("새 이름");
  });

  it("요청 중이면 변경 버튼이 비활성화되고 문구가 바뀐다", () => {
    render(
      <SharedFolderEditNameModal
        currentName="기존 폴더"
        isSubmitting
        onClose={jest.fn()}
        onRename={jest.fn()}
      />
    );

    expect(screen.getByRole("button", { name: "변경 중..." })).toBeDisabled();
  });

  it("취소를 클릭하면 닫기 콜백을 호출한다", () => {
    const onClose = jest.fn();

    render(
      <SharedFolderEditNameModal
        currentName="기존 폴더"
        isSubmitting={false}
        onClose={onClose}
        onRename={jest.fn()}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "취소" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
