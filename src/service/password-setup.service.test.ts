import { fetchWithAuth } from "../lib/fetch";
import { setupPassword } from "./password-setup.service";

jest.mock("../lib/fetch", () => ({
    fetchWithAuth: jest.fn(),
}));

const mockedFetchWithAuth = fetchWithAuth as jest.Mock;

describe("setupPassword", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("응답이 정상이면 아무 값도 반환하지 않는다", async () => {
        mockedFetchWithAuth.mockResolvedValue({ ok: true });

        await expect(
            setupPassword({
                email: "test@example.com",
                phone: "010-1234-5678",
                newPassword: "password1234",
            }),
        ).resolves.toBeUndefined();

        expect(mockedFetchWithAuth).toHaveBeenCalledWith(
            "/api/users/password-setup",
            {
                method: "POST",
                body: JSON.stringify({
                    email: "test@example.com",
                    phone: "010-1234-5678",
                    newPassword: "password1234",
                }),
            },
        );
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetchWithAuth.mockResolvedValue({
            ok: false,
            headers: { get: () => "application/json" },
            json: () => Promise.resolve({ message: "최초 비밀번호 설정에 실패했습니다." }),
        });

        await expect(
            setupPassword({
                email: "test@example.com",
                phone: "010-1234-5678",
                newPassword: "password1234",
            }),
        ).rejects.toThrow("최초 비밀번호 설정에 실패했습니다.");
    });
});
