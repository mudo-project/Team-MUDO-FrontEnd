import { render, screen } from "@testing-library/react";
import RevenueReportListItem from "./RevenueReportListItem";

describe("RevenueReportListItem", () => {
  it("안읽은 리포트면 안읽음 배지를 표시한다", () => {
    render(<RevenueReportListItem read={false} reportId={1} targetMonth="2026-08" />);

    expect(screen.getByText("안읽음")).toBeInTheDocument();
  });

  it("읽은 리포트면 안읽음 배지를 표시하지 않는다", () => {
    render(<RevenueReportListItem read={true} reportId={1} targetMonth="2026-08" />);

    expect(screen.queryByText("안읽음")).not.toBeInTheDocument();
  });

  it("대상 월을 연/월 형식으로 표시한다", () => {
    render(<RevenueReportListItem read={true} reportId={1} targetMonth="2026-01" />);

    expect(screen.getByText("2026년 1월 매출 리포트")).toBeInTheDocument();
  });
});
