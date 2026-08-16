import { render, screen } from "@testing-library/react";
import RevenuePreviousMonthCompare from "./RevenuePreviousMonthCompare";

describe("RevenuePreviousMonthCompare", () => {
  it("전월 데이터가 없으면 안내 문구를 표시한다", () => {
    render(
      <RevenuePreviousMonthCompare available={false} currentProfit={100} currentRevenue={100} />
    );

    expect(screen.getByText("비교할 전월 데이터가 없어요.")).toBeInTheDocument();
  });

  it("전월 대비 매출이 증가하면 증가율을 표시한다", () => {
    render(
      <RevenuePreviousMonthCompare
        available={true}
        currentProfit={100}
        currentRevenue={1200}
        previousProfit={100}
        previousRevenue={1000}
      />
    );

    expect(screen.getByText("▲20%")).toBeInTheDocument();
  });

  it("전월 대비 매출이 감소하면 감소율을 표시한다", () => {
    render(
      <RevenuePreviousMonthCompare
        available={true}
        currentProfit={100}
        currentRevenue={800}
        previousProfit={100}
        previousRevenue={1000}
      />
    );

    expect(screen.getByText("▼20%")).toBeInTheDocument();
  });

  it("전월과 값이 같으면 변동 없음을 표시한다", () => {
    render(
      <RevenuePreviousMonthCompare
        available={true}
        currentProfit={100}
        currentRevenue={1000}
        previousProfit={100}
        previousRevenue={1000}
      />
    );

    expect(screen.getAllByText("변동 없음")).toHaveLength(2);
  });
});
