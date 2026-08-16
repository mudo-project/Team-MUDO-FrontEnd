import { render, screen } from "@testing-library/react";
import ApprovalItem from "./ApprovalItem";
import { ApprovalListData } from "../type";

const baseApproval: ApprovalListData = {
    id: 1,
    title: "휴가 신청서",
    templateName: "휴가 신청",
    creatorName: "김민수",
    status: "IN_PROGRESS",
    currentApproverStepOrder: 1,
    currentApproverName: "이지은",
    createdAt: "2026-08-16T00:00:00.000Z",
};

describe("ApprovalItem", () => {
    it("진행중 상태와 현재 결재자를 표시한다", () => {
        render(<ApprovalItem approval={baseApproval} />);

        expect(screen.getByText("휴가 신청서")).toBeInTheDocument();
        expect(screen.getByText("김민수")).toBeInTheDocument();
        expect(screen.getByText("휴가 신청")).toBeInTheDocument();
        expect(screen.getByText("진행중")).toBeInTheDocument();
        expect(screen.getByText("1차 · 이지은")).toBeInTheDocument();
    });

    it("현재 결재자가 없으면 대시(-)로 표시한다", () => {
        render(
            <ApprovalItem
                approval={{
                    ...baseApproval,
                    currentApproverStepOrder: null,
                    currentApproverName: null,
                    status: "APPROVED",
                }}
            />,
        );

        expect(screen.getByText("-")).toBeInTheDocument();
        expect(screen.getByText("승인")).toBeInTheDocument();
    });

    it("반려 상태이면 반려 라벨을 표시한다", () => {
        render(<ApprovalItem approval={{ ...baseApproval, status: "REJECTED" }} />);

        expect(screen.getByText("반려")).toBeInTheDocument();
    });

    it("취소 상태이면 취소 라벨을 표시한다", () => {
        render(<ApprovalItem approval={{ ...baseApproval, status: "CANCELLED" }} />);

        expect(screen.getByText("취소")).toBeInTheDocument();
    });
});
