import { render, screen } from "@testing-library/react";
import { ApiCallMetricData } from "../type";
import ApiCallDistribution from "./ApiCallDistribution";

describe("ApiCallDistribution", () => {
    it("각 API 항목의 이름과 호출 횟수, 전체 합계를 표시한다", () => {
        const metrics: ApiCallMetricData[] = [
            { category: "INITIAL_DATA_READ", count: 100 },
            { category: "ACCOUNT_ISSUANCE", count: 50 },
        ];

        render(<ApiCallDistribution metrics={metrics} />);

        expect(screen.getByText("초기 데이터 조회")).toBeInTheDocument();
        expect(screen.getByText("계정 발급")).toBeInTheDocument();
        expect(screen.getByText("100")).toBeInTheDocument();
        expect(screen.getByText("50")).toBeInTheDocument();
        expect(screen.getByText("총 150건")).toBeInTheDocument();
    });

    it("호출 횟수가 모두 0이어도 0으로 나누지 않고 정상적으로 표시한다", () => {
        const metrics: ApiCallMetricData[] = [
            { category: "INITIAL_DATA_READ", count: 0 },
            { category: "ACCOUNT_ISSUANCE", count: 0 },
        ];

        render(<ApiCallDistribution metrics={metrics} />);

        expect(screen.getByText("총 0건")).toBeInTheDocument();
        expect(screen.getAllByText("0")).toHaveLength(2);
    });

    it("항목이 없으면 합계를 0건으로 표시한다", () => {
        render(<ApiCallDistribution metrics={[]} />);

        expect(screen.getByText("총 0건")).toBeInTheDocument();
    });
});
