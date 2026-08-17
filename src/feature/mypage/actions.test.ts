import { changeMyPassword, getMyProfile, updateMyProfile } from "@/service/mypage.service";
import {
    changeMyPasswordAction,
    getMyProfileAction,
    updateMyProfileAction,
} from "./actions";

jest.mock("../../service/mypage.service");

describe("getMyProfileAction", () => {
    afterEach(() => jest.clearAllMocks());

    it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
        const data = {
            userId: 1,
            name: "김강사",
            email: "teacher@example.com",
            phone: "010-1111-2222",
            roleId: 1,
            roleName: "강사",
            joinedAt: "2026-01-15",
            status: "ACTIVE" as const,
        };
        (getMyProfile as jest.Mock).mockResolvedValue({
            status: 200,
            code: "OK",
            message: "조회했습니다.",
            data,
        });

        const result = await getMyProfileAction();

        expect(result).toEqual({ success: true, message: "조회했습니다.", data });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        (getMyProfile as jest.Mock).mockRejectedValue(new Error("내 정보 조회에 실패했습니다."));

        const result = await getMyProfileAction();

        expect(result).toEqual({ success: false, message: "내 정보 조회에 실패했습니다." });
    });
});

describe("updateMyProfileAction", () => {
    afterEach(() => jest.clearAllMocks());

    it("전화번호가 20자를 초과하면 실패 결과를 반환한다", async () => {
        const result = await updateMyProfileAction({ phone: "0".repeat(21) });

        expect(result).toEqual({ success: false, message: "전화번호는 20자 이하로 입력해주세요." });
        expect(updateMyProfile).not.toHaveBeenCalled();
    });

    it("이메일이 100자를 초과하면 실패 결과를 반환한다", async () => {
        const longEmail = `${"a".repeat(95)}@a.com`;

        const result = await updateMyProfileAction({ email: longEmail });

        expect(result).toEqual({ success: false, message: "이메일은 100자 이하로 입력해주세요." });
        expect(updateMyProfile).not.toHaveBeenCalled();
    });

    it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
        (updateMyProfile as jest.Mock).mockResolvedValue(undefined);

        const result = await updateMyProfileAction({ phone: "010-3333-4444", email: "new@example.com" });

        expect(updateMyProfile).toHaveBeenCalledWith({ phone: "010-3333-4444", email: "new@example.com" });
        expect(result).toEqual({ success: true, message: "내 정보를 수정했습니다." });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        (updateMyProfile as jest.Mock).mockRejectedValue(new Error("내 정보 수정에 실패했습니다."));

        const result = await updateMyProfileAction({ phone: "010-3333-4444" });

        expect(result).toEqual({ success: false, message: "내 정보 수정에 실패했습니다." });
    });
});

describe("changeMyPasswordAction", () => {
    afterEach(() => jest.clearAllMocks());

    it("현재 비밀번호가 비어있으면 실패 결과를 반환한다", async () => {
        const result = await changeMyPasswordAction({ currentPassword: "", newPassword: "newpass1234" });

        expect(result).toEqual({ success: false, message: "현재 비밀번호를 확인해주세요." });
        expect(changeMyPassword).not.toHaveBeenCalled();
    });

    it("현재 비밀번호가 100자를 초과하면 실패 결과를 반환한다", async () => {
        const result = await changeMyPasswordAction({
            currentPassword: "a".repeat(101),
            newPassword: "newpass1234",
        });

        expect(result).toEqual({ success: false, message: "현재 비밀번호를 확인해주세요." });
        expect(changeMyPassword).not.toHaveBeenCalled();
    });

    it("새 비밀번호가 8자 미만이면 실패 결과를 반환한다", async () => {
        const result = await changeMyPasswordAction({ currentPassword: "current1234", newPassword: "short" });

        expect(result).toEqual({
            success: false,
            message: "새 비밀번호는 8자 이상 100자 이하로 입력해주세요.",
        });
        expect(changeMyPassword).not.toHaveBeenCalled();
    });

    it("새 비밀번호가 100자를 초과하면 실패 결과를 반환한다", async () => {
        const result = await changeMyPasswordAction({
            currentPassword: "current1234",
            newPassword: "a".repeat(101),
        });

        expect(result).toEqual({
            success: false,
            message: "새 비밀번호는 8자 이상 100자 이하로 입력해주세요.",
        });
        expect(changeMyPassword).not.toHaveBeenCalled();
    });

    it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
        (changeMyPassword as jest.Mock).mockResolvedValue(undefined);

        const result = await changeMyPasswordAction({
            currentPassword: "current1234",
            newPassword: "newpass1234",
        });

        expect(changeMyPassword).toHaveBeenCalledWith({
            currentPassword: "current1234",
            newPassword: "newpass1234",
        });
        expect(result).toEqual({ success: true, message: "비밀번호를 변경했습니다." });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        (changeMyPassword as jest.Mock).mockRejectedValue(new Error("비밀번호 변경에 실패했습니다."));

        const result = await changeMyPasswordAction({
            currentPassword: "current1234",
            newPassword: "newpass1234",
        });

        expect(result).toEqual({ success: false, message: "비밀번호 변경에 실패했습니다." });
    });
});
