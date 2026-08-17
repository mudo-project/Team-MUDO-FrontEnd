import { render, screen } from "@testing-library/react";
import RollbookStatus from "./RollbookStatus";

describe("RollbookStatus", () => {
    it("카운트와 라벨을 표시한다", () => {
        render(<RollbookStatus color="text-[#16A34A]" count={5} hasRightBorder label="출석" />);

        expect(screen.getByText("5")).toBeInTheDocument();
        expect(screen.getByText("출석")).toBeInTheDocument();
    });

    it("hasRightBorder가 true이면 오른쪽 테두리를 적용한다", () => {
        const { container } = render(
            <RollbookStatus color="text-[#16A34A]" count={5} hasRightBorder label="출석" />,
        );

        expect(container.firstChild).toHaveClass("border-r");
    });

    it("hasRightBorder가 false이면 오른쪽 테두리를 적용하지 않는다", () => {
        const { container } = render(
            <RollbookStatus color="text-[#16A34A]" count={5} hasRightBorder={false} label="출석" />,
        );

        expect(container.firstChild).not.toHaveClass("border-r");
    });
});
