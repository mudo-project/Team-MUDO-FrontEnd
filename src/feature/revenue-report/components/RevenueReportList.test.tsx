import { render, screen } from "@testing-library/react";
import RevenueReportList from "./RevenueReportList";

describe("RevenueReportList", () => {
  it("리포트가 없으면 안내 문구를 표시한다", () => {
    render(<RevenueReportList reports={[]} />);

    expect(screen.getByText("아직 생성된 매출 리포트가 없어요.")).toBeInTheDocument();
  });

  it("리포트가 있으면 목록 항목을 표시한다", () => {
    render(
      <RevenueReportList
        reports={[
          { reportId: 1, targetMonth: "2026-08", read: false },
          { reportId: 2, targetMonth: "2026-07", read: true },
        ]}
      />
    );

    expect(screen.getByText("2026년 8월 매출 리포트")).toBeInTheDocument();
    expect(screen.getByText("2026년 7월 매출 리포트")).toBeInTheDocument();
  });
});
