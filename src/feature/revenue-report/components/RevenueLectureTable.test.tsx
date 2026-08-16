import { render, screen } from "@testing-library/react";
import RevenueLectureTable from "./RevenueLectureTable";

describe("RevenueLectureTable", () => {
  it("매출이 발생한 강의가 없으면 안내 문구를 표시한다", () => {
    render(<RevenueLectureTable data={[]} />);

    expect(screen.getByText("이번 달 매출이 발생한 강의가 없어요.")).toBeInTheDocument();
  });

  it("강의별 매출 데이터를 표로 표시한다", () => {
    render(
      <RevenueLectureTable
        data={[{ actualRevenue: 500000, lectureName: "수학 A반", studentCount: 10, teacherName: "김선생" }]}
      />
    );

    expect(screen.getByText("수학 A반")).toBeInTheDocument();
    expect(screen.getByText("김선생")).toBeInTheDocument();
    expect(screen.getByText("10명")).toBeInTheDocument();
    expect(screen.getByText("500,000원")).toBeInTheDocument();
  });
});
