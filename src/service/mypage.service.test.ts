import { fetchWithAuth } from "@/lib/fetch";
import { changeMyPassword, getMyProfile, updateMyProfile } from "./mypage.service";
import { ChangeMyPasswordRequest, MyProfileResponse, UpdateMyProfileRequest } from "@/feature/mypage/type";

jest.mock("../lib/fetch");

const mockedFetch = fetchWithAuth as jest.Mock;

const okJsonResponse = (data: unknown) => ({
    ok: true,
    json: () => Promise.resolve(data),
});

const failJsonResponse = (message: string) => ({
    ok: false,
    headers: { get: () => "application/json" },
    json: () => Promise.resolve({ message }),
});

describe("getMyProfile", () => {
    afterEach(() => jest.clearAllMocks());

    it("응답이 정상이면 내 프로필을 반환한다", async () => {
        const response: MyProfileResponse = {
            status: 200,
            code: "OK",
            message: "조회했습니다.",
            data: {
                userId: 1,
                name: "김강사",
                email: "teacher@example.com",
                phone: "010-1111-2222",
                roleId: 1,
                roleName: "강사",
                joinedAt: "2026-01-15",
                status: "ACTIVE",
            },
        };
        mockedFetch.mockResolvedValue(okJsonResponse(response));

        const result = await getMyProfile();

        expect(mockedFetch).toHaveBeenCalledWith("/api/users/me");
        expect(result).toEqual(response);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failJsonResponse("내 정보 조회에 실패했습니다."));

        await expect(getMyProfile()).rejects.toThrow("내 정보 조회에 실패했습니다.");
    });
});

describe("updateMyProfile", () => {
    afterEach(() => jest.clearAllMocks());

    const payload: UpdateMyProfileRequest = { phone: "010-3333-4444", email: "new@example.com" };

    it("응답이 정상이면 예외 없이 완료된다", async () => {
        mockedFetch.mockResolvedValue({ ok: true });

        await expect(updateMyProfile(payload)).resolves.toBeUndefined();
        expect(mockedFetch).toHaveBeenCalledWith("/api/users/me", {
            method: "PATCH",
            body: JSON.stringify(payload),
        });
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failJsonResponse("내 정보 수정에 실패했습니다."));

        await expect(updateMyProfile(payload)).rejects.toThrow("내 정보 수정에 실패했습니다.");
    });
});

describe("changeMyPassword", () => {
    afterEach(() => jest.clearAllMocks());

    const payload: ChangeMyPasswordRequest = {
        currentPassword: "current1234",
        newPassword: "newpass1234",
    };

    it("응답이 정상이면 예외 없이 완료된다", async () => {
        mockedFetch.mockResolvedValue({ ok: true });

        await expect(changeMyPassword(payload)).resolves.toBeUndefined();
        expect(mockedFetch).toHaveBeenCalledWith("/api/users/me/password", {
            method: "PATCH",
            body: JSON.stringify(payload),
        });
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failJsonResponse("비밀번호 변경에 실패했습니다."));

        await expect(changeMyPassword(payload)).rejects.toThrow("비밀번호 변경에 실패했습니다.");
    });
});
