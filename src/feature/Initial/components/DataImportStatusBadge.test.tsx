import { render, screen } from "@testing-library/react";
import DataImportStatusBadge from "./DataImportStatusBadge";

describe("DataImportStatusBadge", () => {
    it("READY 상태이면 '등록 가능'을 표시한다", () => {
        render(<DataImportStatusBadge status="READY" />);

        expect(screen.getByText("등록 가능")).toBeInTheDocument();
    });

    it("NEEDS_REVIEW 상태이면 '확인 필요'를 표시한다", () => {
        render(<DataImportStatusBadge status="NEEDS_REVIEW" />);

        expect(screen.getByText("확인 필요")).toBeInTheDocument();
    });

    it("DUPLICATE_SUSPECTED 상태이면 '중복 의심'을 표시한다", () => {
        render(<DataImportStatusBadge status="DUPLICATE_SUSPECTED" />);

        expect(screen.getByText("중복 의심")).toBeInTheDocument();
    });

    it("ERROR 상태이면 '등록 불가'를 표시한다", () => {
        render(<DataImportStatusBadge status="ERROR" />);

        expect(screen.getByText("등록 불가")).toBeInTheDocument();
    });
});
