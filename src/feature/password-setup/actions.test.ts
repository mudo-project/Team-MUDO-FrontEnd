import { setupPassword } from "../../service/password-setup.service";
import { setupPasswordAction } from "./actions";

jest.mock("../../service/password-setup.service", () => ({
    setupPassword: jest.fn(),
}));

const mockedSetupPassword = setupPassword as jest.MockedFunction<typeof setupPassword>;

describe("setupPasswordAction", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    const payload = {
        email: "test@example.com",
        phone: "010-1234-5678",
        newPassword: "password1234",
    };

    it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
        mockedSetupPassword.mockResolvedValue(undefined);

        const result = await setupPasswordAction(payload);

        expect(mockedSetupPassword).toHaveBeenCalledWith(payload);
        expect(result).toEqual({
            success: true,
            message: "비밀번호 설정이 완료되었습니다.",
        });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        mockedSetupPassword.mockRejectedValue(new Error("최초 비밀번호 설정에 실패했습니다."));

        const result = await setupPasswordAction(payload);

        expect(result).toEqual({
            success: false,
            message: "최초 비밀번호 설정에 실패했습니다.",
        });
    });

    it("service가 Error가 아닌 값을 던지면 기본 실패 메시지를 반환한다", async () => {
        mockedSetupPassword.mockRejectedValue("알 수 없는 오류");

        const result = await setupPasswordAction(payload);

        expect(result).toEqual({
            success: false,
            message: "최초 비밀번호 설정에 실패했습니다.",
        });
    });
});
