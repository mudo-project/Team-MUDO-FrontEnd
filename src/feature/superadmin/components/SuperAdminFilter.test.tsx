import { fireEvent, render, screen } from "@testing-library/react";
import { usePathname, useRouter } from "next/navigation";
import { ComponentProps } from "react";
import { AcademyData } from "../type";
import SuperAdminFilter from "./SuperAdminFilter";

const replace = jest.fn();

jest.mock("next/navigation", () => ({
    usePathname: jest.fn(),
    useRouter: jest.fn(),
}));

const mockedUsePathname = usePathname as jest.Mock;
const mockedUseRouter = useRouter as jest.Mock;

const academies: AcademyData[] = [{ code: "academy-a" }, { code: "academy-b" }];

const renderFilter = (props: Partial<ComponentProps<typeof SuperAdminFilter>> = {}) => {
    mockedUsePathname.mockReturnValue("/superadmin");
    mockedUseRouter.mockReturnValue({ replace });

    return render(
        <SuperAdminFilter
            academies={academies}
            academyListError=""
            period="LAST_HOUR"
            scope="ALL"
            {...props}
        />,
    );
};

afterEach(() => {
    jest.clearAllMocks();
});

describe("SuperAdminFilter", () => {
    it("scope가 ALL이면 학원 선택 셀렉트를 표시하지 않는다", () => {
        renderFilter({ scope: "ALL" });

        expect(screen.queryByLabelText("학원 선택")).not.toBeInTheDocument();
    });

    it("scope가 ACADEMY이면 학원 선택 셀렉트를 표시한다", () => {
        renderFilter({ scope: "ACADEMY", academyCode: "academy-a" });

        expect(screen.getByLabelText("학원 선택")).toHaveValue("academy-a");
    });

    it("학원 목록이 비어있으면 학원 선택 셀렉트를 비활성화하고 안내 문구를 표시한다", () => {
        renderFilter({ scope: "ACADEMY", academies: [] });

        const select = screen.getByLabelText("학원 선택");
        expect(select).toBeDisabled();
        expect(screen.getByText("조회된 학원 없음")).toBeInTheDocument();
    });

    it("전체 학원에서 특정 학원으로 범위를 바꾸면 첫 번째 학원 코드를 기본값으로 조회한다", () => {
        renderFilter({ scope: "ALL" });

        fireEvent.change(screen.getByDisplayValue("전체 학원"), { target: { value: "ACADEMY" } });

        expect(replace).toHaveBeenCalledWith("/superadmin?scope=ACADEMY&period=LAST_HOUR&academyCode=academy-a");
    });

    it("학원을 선택하면 선택한 학원 코드로 다시 조회한다", () => {
        renderFilter({ scope: "ACADEMY", academyCode: "academy-a" });

        fireEvent.change(screen.getByLabelText("학원 선택"), { target: { value: "academy-b" } });

        expect(replace).toHaveBeenCalledWith("/superadmin?scope=ACADEMY&period=LAST_HOUR&academyCode=academy-b");
    });

    it("기간 버튼을 클릭하면 선택한 기간으로 다시 조회한다", () => {
        renderFilter({ scope: "ALL", period: "LAST_HOUR" });

        fireEvent.click(screen.getByRole("button", { name: "최근 24시간" }));

        expect(replace).toHaveBeenCalledWith("/superadmin?scope=ALL&period=LAST_24_HOURS");
    });

    it("scope가 ACADEMY일 때 기간을 변경하면 선택된 학원 코드를 유지한다", () => {
        renderFilter({ scope: "ACADEMY", academyCode: "academy-b", period: "LAST_HOUR" });

        fireEvent.click(screen.getByRole("button", { name: "오늘" }));

        expect(replace).toHaveBeenCalledWith("/superadmin?scope=ACADEMY&period=TODAY&academyCode=academy-b");
    });

    it("academyListError가 있으면 오류 메시지를 alert로 표시한다", () => {
        renderFilter({ academyListError: "학원 목록 조회에 실패했습니다." });

        expect(screen.getByRole("alert")).toHaveTextContent("학원 목록 조회에 실패했습니다.");
    });
});
