import { render, screen } from "@testing-library/react";
import { EcsHostHeadroomData } from "../type";
import HostResourceCard from "./HostResourceCard";

const buildHost = (overrides: Partial<EcsHostHeadroomData> = {}): EcsHostHeadroomData => ({
    academyCodes: ["academy-a", "academy-b"],
    cluster: "cluster-1",
    hostId: "i-0a1b2c3d4e5f",
    registeredCpu: 100,
    registeredMemoryMib: 1000,
    remainingCpu: 50,
    remainingMemoryMib: 500,
    ...overrides,
});

describe("HostResourceCard", () => {
    it("호스트 정보와 CPU·메모리 사용률을 표시한다", () => {
        render(<HostResourceCard host={buildHost()} />);

        expect(screen.getByText("i-0a1b2c3d4e5f")).toBeInTheDocument();
        expect(screen.getByText("cluster-1")).toBeInTheDocument();
        expect(screen.getByText("academy-a")).toBeInTheDocument();
        expect(screen.getByText("academy-b")).toBeInTheDocument();
        expect(screen.getAllByText("50.0%")).toHaveLength(2);
    });

    it("사용률이 80% 미만이면 경고 색상을 적용하지 않는다", () => {
        render(<HostResourceCard host={buildHost({ registeredCpu: 100, remainingCpu: 50 })} />);

        const [cpuPercentText] = screen.getAllByText("50.0%");
        expect(cpuPercentText).toHaveClass("text-[#2C8D50]");
        expect(cpuPercentText).not.toHaveClass("text-[#D65045]");
    });

    it("CPU 또는 메모리 사용률이 80% 이상이면 경고 색상을 적용한다", () => {
        render(<HostResourceCard host={buildHost({ registeredCpu: 100, remainingCpu: 10 })} />);

        const [cpuPercentText] = screen.getAllByText("90.0%");
        expect(cpuPercentText).toHaveClass("text-[#D65045]");
    });

    it("등록된 자원이 0이면 사용률을 0%로 표시한다", () => {
        render(
            <HostResourceCard
                host={buildHost({ registeredCpu: 0, remainingCpu: 0, registeredMemoryMib: 0, remainingMemoryMib: 0 })}
            />,
        );

        expect(screen.getAllByText("0.0%")).toHaveLength(2);
    });
});
