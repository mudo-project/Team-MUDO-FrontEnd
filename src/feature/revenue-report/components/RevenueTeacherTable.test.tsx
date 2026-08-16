import { render, screen } from "@testing-library/react";
import RevenueTeacherTable from "./RevenueTeacherTable";

describe("RevenueTeacherTable", () => {
  it("매출이 발생한 강사가 없으면 안내 문구를 표시한다", () => {
    render(<RevenueTeacherTable data={[]} />);

    expect(screen.getByText("이번 달 매출이 발생한 강사가 없어요.")).toBeInTheDocument();
  });

  it("강사별 매출 데이터를 표로 표시한다", () => {
    render(
      <RevenueTeacherTable
        data={[{ actualRevenue: 700000, lectureCount: 3, studentCount: 15, teacherName: "이선생" }]}
      />
    );

    expect(screen.getByText("이선생")).toBeInTheDocument();
    expect(screen.getByText("3개")).toBeInTheDocument();
    expect(screen.getByText("15명")).toBeInTheDocument();
    expect(screen.getByText("700,000원")).toBeInTheDocument();
  });
});
