import { render, screen } from "@testing-library/react";
import RevenueCategoryChart from "./RevenueCategoryChart";

jest.mock("chart.js/auto", () => ({}));
jest.mock("react-chartjs-2", () => ({
  Bar: ({ data }: { data: { labels: string[] } }) => (
    <div data-testid="bar-chart">
      {data.labels.map((label) => (
        <span key={label}>{label}</span>
      ))}
    </div>
  ),
}));

describe("RevenueCategoryChart", () => {
  it("지출 내역이 없으면 안내 문구를 표시한다", () => {
    render(<RevenueCategoryChart data={[]} />);

    expect(screen.getByText("이번 달 지출 내역이 없어요.")).toBeInTheDocument();
    expect(screen.queryByTestId("bar-chart")).not.toBeInTheDocument();
  });

  it("정의된 카테고리는 한글 라벨로 매핑해 표시한다", () => {
    render(
      <RevenueCategoryChart
        data={[
          { category: "BOOK", amount: 10000 },
          { category: "FACILITY", amount: 20000 },
        ]}
      />
    );

    expect(screen.getByText("도서비")).toBeInTheDocument();
    expect(screen.getByText("시설비")).toBeInTheDocument();
  });

  it("정의되지 않은 카테고리는 원문 문자열을 그대로 표시한다", () => {
    render(<RevenueCategoryChart data={[{ category: "ETC", amount: 5000 }]} />);

    expect(screen.getByText("ETC")).toBeInTheDocument();
  });
});
