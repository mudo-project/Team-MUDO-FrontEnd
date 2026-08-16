import { fetchWithAuth } from "../lib/fetch";
import {
    changeEmployeeRole,
    changeMemberStatus,
    createEmployeeAccount,
    getMemberList,
    updateMember,
} from "./members.service";

jest.mock("../lib/fetch");

const mockedFetchWithAuth = fetchWithAuth as jest.Mock;

const okResponse = (data: unknown) => ({
    ok: true,
    json: () => Promise.resolve(data),
});

const errorResponse = (message: string) => ({
    ok: false,
    headers: { get: () => "application/json" },
    json: () => Promise.resolve({ message }),
});

describe("createEmployeeAccount", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("응답이 정상이면 발급된 계정 정보를 반환한다", async () => {
        const mockData = {
            status: 200,
            code: "OK",
            message: "직원 계정을 발급했습니다.",
            data: { userId: 1, username: "newuser", temporaryPassword: "temp1234" },
        };
        mockedFetchWithAuth.mockResolvedValue(okResponse(mockData));

        const result = await createEmployeeAccount({
            username: "newuser",
            name: "김민수",
            roleId: 2,
        });

        expect(mockedFetchWithAuth).toHaveBeenCalledWith("/api/users", {
            method: "POST",
            body: JSON.stringify({ username: "newuser", name: "김민수", roleId: 2 }),
        });
        expect(result).toEqual(mockData);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetchWithAuth.mockResolvedValue(errorResponse("이미 존재하는 아이디입니다."));

        await expect(
            createEmployeeAccount({ username: "dup", name: "홍길동", roleId: 1 }),
        ).rejects.toThrow("이미 존재하는 아이디입니다.");
    });
});

describe("changeEmployeeRole", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("응답이 정상이면 예외 없이 완료된다", async () => {
        mockedFetchWithAuth.mockResolvedValue(okResponse({}));

        await expect(changeEmployeeRole(1, { roleId: 3 })).resolves.toBeUndefined();
        expect(mockedFetchWithAuth).toHaveBeenCalledWith("/api/users/1/role", {
            method: "PATCH",
            body: JSON.stringify({ roleId: 3 }),
        });
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetchWithAuth.mockResolvedValue(errorResponse("직원 역할 변경에 실패했습니다."));

        await expect(changeEmployeeRole(1, { roleId: 3 })).rejects.toThrow(
            "직원 역할 변경에 실패했습니다.",
        );
    });
});

describe("getMemberList", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("전달된 파라미터를 쿼리스트링으로 포함해 목록을 조회한다", async () => {
        const mockData = {
            status: 200,
            code: "OK",
            message: "조회했습니다.",
            data: { content: [], page: 1, size: 20, hasNext: false },
        };
        mockedFetchWithAuth.mockResolvedValue(okResponse(mockData));

        const result = await getMemberList({ keyword: "김", roleId: 2, page: 1 });

        const params = new URLSearchParams();
        params.set("keyword", "김");
        params.set("roleId", "2");
        params.set("page", "1");
        expect(mockedFetchWithAuth).toHaveBeenCalledWith(
            `/api/users/members?${params.toString()}`,
        );
        expect(result).toEqual(mockData);
    });

    it("파라미터가 없으면 쿼리 없이 조회한다", async () => {
        mockedFetchWithAuth.mockResolvedValue(
            okResponse({ data: { content: [], page: 0, size: 20, hasNext: false } }),
        );

        await getMemberList();

        expect(mockedFetchWithAuth).toHaveBeenCalledWith("/api/users/members");
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetchWithAuth.mockResolvedValue(errorResponse("구성원 목록 조회에 실패했습니다."));

        await expect(getMemberList()).rejects.toThrow("구성원 목록 조회에 실패했습니다.");
    });
});

describe("updateMember", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("응답이 정상이면 예외 없이 완료된다", async () => {
        mockedFetchWithAuth.mockResolvedValue(okResponse({}));

        await expect(updateMember(1, { name: "이민수" })).resolves.toBeUndefined();
        expect(mockedFetchWithAuth).toHaveBeenCalledWith("/api/users/1", {
            method: "PATCH",
            body: JSON.stringify({ name: "이민수" }),
        });
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetchWithAuth.mockResolvedValue(errorResponse("구성원 정보 수정에 실패했습니다."));

        await expect(updateMember(1, { name: "이민수" })).rejects.toThrow(
            "구성원 정보 수정에 실패했습니다.",
        );
    });
});

describe("changeMemberStatus", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("응답이 정상이면 예외 없이 완료된다", async () => {
        mockedFetchWithAuth.mockResolvedValue(okResponse({}));

        await expect(
            changeMemberStatus(1, { status: "RESIGNED" }),
        ).resolves.toBeUndefined();
        expect(mockedFetchWithAuth).toHaveBeenCalledWith("/api/users/1/status", {
            method: "PATCH",
            body: JSON.stringify({ status: "RESIGNED" }),
        });
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetchWithAuth.mockResolvedValue(
            errorResponse("구성원 재직 상태 변경에 실패했습니다."),
        );

        await expect(changeMemberStatus(1, { status: "RESIGNED" })).rejects.toThrow(
            "구성원 재직 상태 변경에 실패했습니다.",
        );
    });
});
