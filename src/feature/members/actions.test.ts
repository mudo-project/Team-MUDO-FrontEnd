import {
    changeEmployeeRole,
    changeMemberStatus,
    createEmployeeAccount,
    getMemberList,
    updateMember,
} from "../../service/members.service";
import { MemberAccountStatus } from "./type";
import {
    changeEmployeeRoleAction,
    changeMemberStatusAction,
    createEmployeeAccountAction,
    getMemberListAction,
    updateMemberAction,
} from "./actions";

jest.mock("../../service/members.service");

const mockedCreateEmployeeAccount = createEmployeeAccount as jest.Mock;
const mockedChangeEmployeeRole = changeEmployeeRole as jest.Mock;
const mockedGetMemberList = getMemberList as jest.Mock;
const mockedUpdateMember = updateMember as jest.Mock;
const mockedChangeMemberStatus = changeMemberStatus as jest.Mock;

afterEach(() => {
    jest.clearAllMocks();
});

describe("createEmployeeAccountAction", () => {
    it("service 호출이 성공하면 발급된 계정 정보를 담아 성공 결과를 반환한다", async () => {
        mockedCreateEmployeeAccount.mockResolvedValue({
            message: "직원 계정을 발급했습니다.",
            data: { userId: 1, username: "newuser", temporaryPassword: "temp1234" },
        });

        const result = await createEmployeeAccountAction({
            username: "newuser",
            name: "김민수",
            roleId: 2,
        });

        expect(result).toEqual({
            success: true,
            message: "직원 계정을 발급했습니다.",
            data: { userId: 1, username: "newuser", temporaryPassword: "temp1234" },
        });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        mockedCreateEmployeeAccount.mockRejectedValue(
            new Error("이미 존재하는 아이디입니다."),
        );

        const result = await createEmployeeAccountAction({
            username: "dup",
            name: "홍길동",
            roleId: 1,
        });

        expect(result).toEqual({
            success: false,
            message: "이미 존재하는 아이디입니다.",
        });
    });
});

describe("changeEmployeeRoleAction", () => {
    it("사용자 번호가 올바르지 않으면 실패 결과를 반환한다", async () => {
        const result = await changeEmployeeRoleAction(0, 1);

        expect(result).toEqual({
            success: false,
            message: "사용자 또는 역할 번호가 올바르지 않습니다.",
        });
        expect(mockedChangeEmployeeRole).not.toHaveBeenCalled();
    });

    it("역할 번호가 올바르지 않으면 실패 결과를 반환한다", async () => {
        const result = await changeEmployeeRoleAction(1, -1);

        expect(result).toEqual({
            success: false,
            message: "사용자 또는 역할 번호가 올바르지 않습니다.",
        });
        expect(mockedChangeEmployeeRole).not.toHaveBeenCalled();
    });

    it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
        mockedChangeEmployeeRole.mockResolvedValue(undefined);

        const result = await changeEmployeeRoleAction(1, 2);

        expect(mockedChangeEmployeeRole).toHaveBeenCalledWith(1, { roleId: 2 });
        expect(result).toEqual({ success: true, message: "직원 역할을 변경했습니다." });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        mockedChangeEmployeeRole.mockRejectedValue(
            new Error("직원 역할 변경에 실패했습니다."),
        );

        const result = await changeEmployeeRoleAction(1, 2);

        expect(result).toEqual({
            success: false,
            message: "직원 역할 변경에 실패했습니다.",
        });
    });
});

describe("getMemberListAction", () => {
    it("역할 번호가 올바르지 않으면 실패 결과를 반환한다", async () => {
        const result = await getMemberListAction({ roleId: -1 });

        expect(result).toEqual({ success: false, message: "역할 번호가 올바르지 않습니다." });
        expect(mockedGetMemberList).not.toHaveBeenCalled();
    });

    it("페이지 번호가 올바르지 않으면 실패 결과를 반환한다", async () => {
        const result = await getMemberListAction({ page: -1 });

        expect(result).toEqual({ success: false, message: "페이지 번호가 올바르지 않습니다." });
        expect(mockedGetMemberList).not.toHaveBeenCalled();
    });

    it("검색어의 앞뒤 공백을 제거하고 조회한다", async () => {
        mockedGetMemberList.mockResolvedValue({
            message: "조회했습니다.",
            data: { content: [], page: 0, size: 20, hasNext: false },
        });

        await getMemberListAction({ keyword: "  김민수  " });

        expect(mockedGetMemberList).toHaveBeenCalledWith({
            keyword: "김민수",
            roleId: undefined,
            page: 0,
        });
    });

    it("service 호출이 성공하면 목록을 담아 성공 결과를 반환한다", async () => {
        const pageData = { content: [], page: 0, size: 20, hasNext: false };
        mockedGetMemberList.mockResolvedValue({ message: "조회했습니다.", data: pageData });

        const result = await getMemberListAction();

        expect(result).toEqual({ success: true, message: "조회했습니다.", data: pageData });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        mockedGetMemberList.mockRejectedValue(
            new Error("구성원 목록 조회에 실패했습니다."),
        );

        const result = await getMemberListAction();

        expect(result).toEqual({
            success: false,
            message: "구성원 목록 조회에 실패했습니다.",
        });
    });
});

describe("updateMemberAction", () => {
    it("사용자 번호가 올바르지 않으면 실패 결과를 반환한다", async () => {
        const result = await updateMemberAction(0, { name: "김민수" });

        expect(result).toEqual({ success: false, message: "사용자 번호가 올바르지 않습니다." });
        expect(mockedUpdateMember).not.toHaveBeenCalled();
    });

    it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
        mockedUpdateMember.mockResolvedValue(undefined);

        const result = await updateMemberAction(1, { name: "김민수" });

        expect(mockedUpdateMember).toHaveBeenCalledWith(1, { name: "김민수" });
        expect(result).toEqual({ success: true, message: "구성원 정보를 수정했습니다." });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        mockedUpdateMember.mockRejectedValue(
            new Error("구성원 정보 수정에 실패했습니다."),
        );

        const result = await updateMemberAction(1, { name: "김민수" });

        expect(result).toEqual({
            success: false,
            message: "구성원 정보 수정에 실패했습니다.",
        });
    });
});

describe("changeMemberStatusAction", () => {
    it("사용자 번호가 올바르지 않으면 실패 결과를 반환한다", async () => {
        const result = await changeMemberStatusAction(0, "ACTIVE");

        expect(result).toEqual({ success: false, message: "사용자 번호가 올바르지 않습니다." });
        expect(mockedChangeMemberStatus).not.toHaveBeenCalled();
    });

    it("재직 상태가 올바르지 않으면 실패 결과를 반환한다", async () => {
        const result = await changeMemberStatusAction(1, "UNKNOWN" as MemberAccountStatus);

        expect(result).toEqual({ success: false, message: "재직 상태가 올바르지 않습니다." });
        expect(mockedChangeMemberStatus).not.toHaveBeenCalled();
    });

    it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
        mockedChangeMemberStatus.mockResolvedValue(undefined);

        const result = await changeMemberStatusAction(1, "RESIGNED");

        expect(mockedChangeMemberStatus).toHaveBeenCalledWith(1, { status: "RESIGNED" });
        expect(result).toEqual({
            success: true,
            message: "구성원 재직 상태를 변경했습니다.",
        });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        mockedChangeMemberStatus.mockRejectedValue(
            new Error("구성원 재직 상태 변경에 실패했습니다."),
        );

        const result = await changeMemberStatusAction(1, "RESIGNED");

        expect(result).toEqual({
            success: false,
            message: "구성원 재직 상태 변경에 실패했습니다.",
        });
    });
});
