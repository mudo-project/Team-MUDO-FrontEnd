import { fireEvent, render, screen } from "@testing-library/react";
import { MemberListData } from "../type";
import MemberItem from "./MemberItem";

jest.mock("./modal/ViewMembersModal", () => {
    return function MockViewMembersModal({
        closeModal,
        member,
    }: {
        closeModal: () => void;
        member: MemberListData;
    }) {
        return (
            <div role="dialog">
                <p>{member.name} 상세</p>
                <button onClick={closeModal} type="button">
                    모달 닫기
                </button>
            </div>
        );
    };
});

const baseMember: MemberListData = {
    userId: 1,
    name: "김민수",
    email: "kim@example.com",
    phone: "010-1234-5678",
    roleId: 2,
    roleName: "강사",
    joinedAt: "2026-01-10",
    status: "ACTIVE",
    attendanceStatus: "PRESENT",
};

describe("MemberItem", () => {
    it("구성원 정보를 표시한다", () => {
        render(<MemberItem member={baseMember} />);

        expect(screen.getByText("김민수")).toBeInTheDocument();
        expect(screen.getByText("kim@example.com")).toBeInTheDocument();
        expect(screen.getByText("강사")).toBeInTheDocument();
        expect(screen.getByText("010-1234-5678")).toBeInTheDocument();
        expect(screen.getByText("2026-01-10")).toBeInTheDocument();
        expect(screen.getByText("출근")).toBeInTheDocument();
    });

    it.each([
        ["PRESENT", "출근"],
        ["ABSENT", "미출근"],
        ["OFF", "휴무"],
        ["LEAVE", "휴가"],
    ] as const)("출근 상태가 %s이면 %s를 표시한다", (attendanceStatus, label) => {
        render(<MemberItem member={{ ...baseMember, attendanceStatus }} />);

        expect(screen.getByText(label)).toBeInTheDocument();
    });

    it("출근 상태 정보가 없으면 -를 표시한다", () => {
        render(<MemberItem member={{ ...baseMember, attendanceStatus: null }} />);

        expect(screen.getByText("-")).toBeInTheDocument();
    });

    it("역할 정보가 없으면 -를 표시한다", () => {
        render(<MemberItem member={{ ...baseMember, roleId: null, roleName: null }} />);

        expect(screen.getByText("-")).toBeInTheDocument();
    });

    it("항목을 클릭하면 상세 모달을 노출한다", () => {
        render(<MemberItem member={baseMember} />);

        fireEvent.click(screen.getByRole("button"));

        expect(screen.getByRole("dialog")).toBeInTheDocument();
        expect(screen.getByText("김민수 상세")).toBeInTheDocument();
    });

    it("모달의 닫기 콜백이 호출되면 상세 모달을 닫는다", () => {
        render(<MemberItem member={baseMember} />);

        fireEvent.click(screen.getByRole("button"));
        fireEvent.click(screen.getByRole("button", { name: "모달 닫기" }));

        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
});
