import { fetchWithAuth } from "../lib/fetch";
import {
    changeRole,
    changeRolePermissions,
    createRole,
    deleteRole,
    getPermissionCatalog,
    getRoleDetail,
    getRoleList,
} from "./role.service";

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

afterEach(() => {
    jest.clearAllMocks();
});

describe("getPermissionCatalog", () => {
    it("응답이 정상이면 권한 카탈로그를 반환한다", async () => {
        const mockData = {
            status: 200,
            code: "OK",
            message: "조회했습니다.",
            data: [{ permissionId: 1, code: "ACCOUNT:CREATE", resource: "ACCOUNT", action: "CREATE", description: "계정 생성" }],
        };
        mockedFetchWithAuth.mockResolvedValue(okResponse(mockData));

        const result = await getPermissionCatalog();

        expect(mockedFetchWithAuth).toHaveBeenCalledWith("/api/permissions");
        expect(result).toEqual(mockData);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetchWithAuth.mockResolvedValue(errorResponse("권한 카탈로그 조회에 실패했습니다."));

        await expect(getPermissionCatalog()).rejects.toThrow(
            "권한 카탈로그 조회에 실패했습니다.",
        );
    });
});

describe("getRoleList", () => {
    it("응답이 정상이면 역할 목록을 반환한다", async () => {
        const mockData = {
            status: 200,
            code: "OK",
            message: "조회했습니다.",
            data: [{ roleId: 1, name: "강사", description: null, color: null, memberCount: 0 }],
        };
        mockedFetchWithAuth.mockResolvedValue(okResponse(mockData));

        const result = await getRoleList();

        expect(mockedFetchWithAuth).toHaveBeenCalledWith("/api/roles");
        expect(result).toEqual(mockData);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetchWithAuth.mockResolvedValue(errorResponse("역할 목록 조회에 실패했습니다."));

        await expect(getRoleList()).rejects.toThrow("역할 목록 조회에 실패했습니다.");
    });
});

describe("getRoleDetail", () => {
    it("응답이 정상이면 역할 상세를 반환한다", async () => {
        const mockData = {
            status: 200,
            code: "OK",
            message: "조회했습니다.",
            data: {
                roleId: 1,
                name: "강사",
                description: null,
                color: null,
                memberCount: 0,
                permissionCodes: [],
            },
        };
        mockedFetchWithAuth.mockResolvedValue(okResponse(mockData));

        const result = await getRoleDetail(1);

        expect(mockedFetchWithAuth).toHaveBeenCalledWith("/api/roles/1");
        expect(result).toEqual(mockData);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetchWithAuth.mockResolvedValue(errorResponse("역할 상세 조회에 실패했습니다."));

        await expect(getRoleDetail(1)).rejects.toThrow("역할 상세 조회에 실패했습니다.");
    });
});

describe("createRole", () => {
    it("응답이 정상이면 생성된 역할 정보를 반환한다", async () => {
        const mockData = {
            status: 201,
            code: "OK",
            message: "역할을 생성했습니다.",
            data: { roleId: 9 },
        };
        mockedFetchWithAuth.mockResolvedValue(okResponse(mockData));

        const payload = { name: "조교", description: "보조 업무", color: "#2C8D50" };
        const result = await createRole(payload);

        expect(mockedFetchWithAuth).toHaveBeenCalledWith("/api/roles", {
            method: "POST",
            body: JSON.stringify(payload),
        });
        expect(result).toEqual(mockData);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetchWithAuth.mockResolvedValue(errorResponse("역할 생성에 실패했습니다."));

        await expect(
            createRole({ name: "조교", description: "", color: "" }),
        ).rejects.toThrow("역할 생성에 실패했습니다.");
    });
});

describe("changeRole", () => {
    it("응답이 정상이면 예외 없이 완료된다", async () => {
        mockedFetchWithAuth.mockResolvedValue(okResponse({}));

        const payload = { name: "조교", description: "보조 업무", color: "#2C8D50" };
        await expect(changeRole(1, payload)).resolves.toBeUndefined();
        expect(mockedFetchWithAuth).toHaveBeenCalledWith("/api/roles/1", {
            method: "PUT",
            body: JSON.stringify(payload),
        });
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetchWithAuth.mockResolvedValue(errorResponse("역할 수정에 실패했습니다."));

        await expect(
            changeRole(1, { name: "조교", description: "", color: "" }),
        ).rejects.toThrow("역할 수정에 실패했습니다.");
    });
});

describe("deleteRole", () => {
    it("응답이 정상이면 예외 없이 완료된다", async () => {
        mockedFetchWithAuth.mockResolvedValue(okResponse({}));

        await expect(deleteRole(1)).resolves.toBeUndefined();
        expect(mockedFetchWithAuth).toHaveBeenCalledWith("/api/roles/1", {
            method: "DELETE",
        });
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetchWithAuth.mockResolvedValue(errorResponse("역할 삭제에 실패했습니다."));

        await expect(deleteRole(1)).rejects.toThrow("역할 삭제에 실패했습니다.");
    });
});

describe("changeRolePermissions", () => {
    it("응답이 정상이면 예외 없이 완료된다", async () => {
        mockedFetchWithAuth.mockResolvedValue(okResponse({}));

        await expect(
            changeRolePermissions(1, { permissionCodes: ["ACCOUNT:CREATE"] }),
        ).resolves.toBeUndefined();
        expect(mockedFetchWithAuth).toHaveBeenCalledWith("/api/roles/1/permissions", {
            method: "PUT",
            body: JSON.stringify({ permissionCodes: ["ACCOUNT:CREATE"] }),
        });
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetchWithAuth.mockResolvedValue(errorResponse("역할 권한 조립에 실패했습니다."));

        await expect(
            changeRolePermissions(1, { permissionCodes: [] }),
        ).rejects.toThrow("역할 권한 조립에 실패했습니다.");
    });
});
