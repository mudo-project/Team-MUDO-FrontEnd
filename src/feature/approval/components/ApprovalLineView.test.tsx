import { render, screen } from "@testing-library/react";
import ApprovalLineView from "./ApprovalLineView";
import { ApprovalLineData } from "../type";

const baseLine: ApprovalLineData = {
    lineId: 1,
    stepOrder: 1,
    approverId: 1,
    approverName: "김민수",
    status: "WAITING",
    comment: null,
    decidedAt: null,
};

describe("ApprovalLineView", () => {
    it("대기 상태이면 대기 라벨을 표시한다", () => {
        render(<ApprovalLineView line={baseLine} i={0} length={2} />);

        expect(screen.getByText("1차 · 김민수")).toBeInTheDocument();
        expect(screen.getByText("대기")).toBeInTheDocument();
    });

    it("검토중 상태이면 검토중 라벨을 표시한다", () => {
        render(<ApprovalLineView line={{ ...baseLine, status: "PENDING" }} i={0} length={1} />);

        expect(screen.getByText("검토중")).toBeInTheDocument();
    });

    it("승인 상태이면 승인 라벨과 처리 일시를 표시한다", () => {
        render(
            <ApprovalLineView
                line={{ ...baseLine, status: "APPROVED", decidedAt: "2026-08-16T09:00:00.000Z" }}
                i={0}
                length={1}
            />,
        );

        expect(screen.getByText("승인")).toBeInTheDocument();
        expect(screen.getByText("2026-08-16")).toBeInTheDocument();
    });

    it("반려 상태이면 반려 라벨을 표시한다", () => {
        render(<ApprovalLineView line={{ ...baseLine, status: "REJECTED" }} i={0} length={1} />);

        expect(screen.getByText("반려")).toBeInTheDocument();
    });

    it("처리 일시가 없으면 표시하지 않는다", () => {
        render(<ApprovalLineView line={baseLine} i={0} length={1} />);

        expect(screen.queryByText(/\d{4}-\d{2}-\d{2}/)).not.toBeInTheDocument();
    });
});
