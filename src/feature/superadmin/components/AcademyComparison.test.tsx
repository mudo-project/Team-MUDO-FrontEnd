import { render, screen } from "@testing-library/react";
import { AcademyApiCallFrequencyData } from "../type";
import AcademyComparison from "./AcademyComparison";

const buildRow = (overrides: Partial<AcademyApiCallFrequencyData> = {}): AcademyApiCallFrequencyData => ({
    academyCode: "academy-a",
    apiCallMetrics: [
        { category: "INITIAL_DATA_READ", count: 120 },
        { category: "ACCOUNT_ISSUANCE", count: 30 },
    ],
    ...overrides,
});

describe("AcademyComparison", () => {
    it("errorMessage가 있으면 오류 메시지를 표시하고 표는 렌더링하지 않는다", () => {
        render(<AcademyComparison errorMessage="학원별 API 호출 빈도 조회에 실패했습니다." rows={[]} />);

        expect(screen.getByText("학원별 API 호출 빈도 조회에 실패했습니다.")).toBeInTheDocument();
        expect(screen.queryByText("학원 코드")).not.toBeInTheDocument();
    });

    it("errorMessage가 없고 rows가 비어있으면 안내 문구를 표시한다", () => {
        render(<AcademyComparison errorMessage="" rows={[]} />);

        expect(screen.getByText("조회된 학원이 없습니다.")).toBeInTheDocument();
        expect(screen.getByText("학원 코드")).toBeInTheDocument();
    });

    it("rows가 있으면 학원별 API 호출 횟수를 표시한다", () => {
        render(<AcademyComparison errorMessage="" rows={[buildRow()]} />);

        expect(screen.getByText("academy-a")).toBeInTheDocument();
        expect(screen.getByText("120")).toBeInTheDocument();
        expect(screen.getByText("30")).toBeInTheDocument();
        expect(screen.queryByText("조회된 학원이 없습니다.")).not.toBeInTheDocument();
    });

    it("해당 학원에 값이 없는 API 항목은 0으로 표시한다", () => {
        render(<AcademyComparison errorMessage="" rows={[buildRow({ apiCallMetrics: [] })]} />);

        const zeroCounts = screen.getAllByText("0");
        expect(zeroCounts.length).toBeGreaterThan(0);
    });
});
