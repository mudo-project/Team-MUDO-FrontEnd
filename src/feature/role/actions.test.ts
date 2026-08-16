import {
    changeRole,
    changeRolePermissions,
    createRole,
    deleteRole,
    getPermissionCatalog,
    getRoleDetail,
    getRoleList,
} from "../../service/role.service";
import {
    changeRoleAction,
    changeRolePermissionsAction,
    createRoleAction,
    deleteRoleAction,
    getPermissionCatalogAction,
    getRoleDetailAction,
    getRoleListAction,
} from "./actions";

jest.mock("../../service/role.service");

const mockedGetPermissionCatalog = getPermissionCatalog as jest.Mock;
const mockedGetRoleList = getRoleList as jest.Mock;
const mockedGetRoleDetail = getRoleDetail as jest.Mock;
const mockedCreateRole = createRole as jest.Mock;
const mockedChangeRole = changeRole as jest.Mock;
const mockedDeleteRole = deleteRole as jest.Mock;
const mockedChangeRolePermissions = changeRolePermissions as jest.Mock;

const buildFormData = (fields: Record<string, string>) => {
    const formData = new FormData();
    Object.entries(fields).forEach(([key, value]) => formData.append(key, value));
    return formData;
};

const emptyState = { success: false, message: "" };

afterEach(() => {
    jest.clearAllMocks();
});

describe("getPermissionCatalogAction", () => {
    it("service 호출이 성공하면 권한 카탈로그를 담아 성공 결과를 반환한다", async () => {
        mockedGetPermissionCatalog.mockResolvedValue({
            message: "조회했습니다.",
            data: [],
        });

        const result = await getPermissionCatalogAction();

        expect(result).toEqual({ success: true, message: "조회했습니다.", data: [] });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        mockedGetPermissionCatalog.mockRejectedValue(
            new Error("권한 카탈로그 조회에 실패했습니다."),
        );

        const result = await getPermissionCatalogAction();

        expect(result).toEqual({
            success: false,
            message: "권한 카탈로그 조회에 실패했습니다.",
        });
    });
});

describe("getRoleListAction", () => {
    it("service 호출이 성공하면 역할 목록을 담아 성공 결과를 반환한다", async () => {
        const roles = [{ roleId: 1, name: "강사", description: null, color: null, memberCount: 0 }];
        mockedGetRoleList.mockResolvedValue({ message: "조회했습니다.", data: roles });

        const result = await getRoleListAction();

        expect(result).toEqual({ success: true, message: "조회했습니다.", data: roles });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        mockedGetRoleList.mockRejectedValue(new Error("역할 목록 조회에 실패했습니다."));

        const result = await getRoleListAction();

        expect(result).toEqual({
            success: false,
            message: "역할 목록 조회에 실패했습니다.",
        });
    });
});

describe("getRoleDetailAction", () => {
    it("역할 번호가 올바르지 않으면 실패 결과를 반환한다", async () => {
        const result = await getRoleDetailAction(0);

        expect(result).toEqual({ success: false, message: "역할 번호가 올바르지 않습니다." });
        expect(mockedGetRoleDetail).not.toHaveBeenCalled();
    });

    it("service 호출이 성공하면 역할 상세를 담아 성공 결과를 반환한다", async () => {
        const role = {
            roleId: 1,
            name: "강사",
            description: null,
            color: null,
            memberCount: 0,
            permissionCodes: [],
        };
        mockedGetRoleDetail.mockResolvedValue({ message: "조회했습니다.", data: role });

        const result = await getRoleDetailAction(1);

        expect(mockedGetRoleDetail).toHaveBeenCalledWith(1);
        expect(result).toEqual({ success: true, message: "조회했습니다.", data: role });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        mockedGetRoleDetail.mockRejectedValue(new Error("역할 상세 조회에 실패했습니다."));

        const result = await getRoleDetailAction(1);

        expect(result).toEqual({
            success: false,
            message: "역할 상세 조회에 실패했습니다.",
        });
    });
});

describe("createRoleAction", () => {
    it("역할 이름이 비어있으면 실패 결과를 반환한다", async () => {
        const formData = buildFormData({ name: "  ", description: "", color: "" });

        const result = await createRoleAction(emptyState, formData);

        expect(result).toEqual({
            success: false,
            message: "역할 이름은 1자 이상 50자 이하로 입력해주세요.",
        });
        expect(mockedCreateRole).not.toHaveBeenCalled();
    });

    it("역할 이름이 50자를 초과하면 실패 결과를 반환한다", async () => {
        const formData = buildFormData({
            name: "a".repeat(51),
            description: "",
            color: "",
        });

        const result = await createRoleAction(emptyState, formData);

        expect(result).toEqual({
            success: false,
            message: "역할 이름은 1자 이상 50자 이하로 입력해주세요.",
        });
    });

    it("역할 설명이 255자를 초과하면 실패 결과를 반환한다", async () => {
        const formData = buildFormData({
            name: "조교",
            description: "a".repeat(256),
            color: "",
        });

        const result = await createRoleAction(emptyState, formData);

        expect(result).toEqual({
            success: false,
            message: "역할 설명은 255자 이하로 입력해주세요.",
        });
    });

    it("역할 색상 형식이 올바르지 않으면 실패 결과를 반환한다", async () => {
        const formData = buildFormData({
            name: "조교",
            description: "",
            color: "green",
        });

        const result = await createRoleAction(emptyState, formData);

        expect(result).toEqual({
            success: false,
            message: "역할 색상은 #RRGGBB 형식으로 입력해주세요.",
        });
    });

    it("유효한 값이면 service 호출이 성공했을 때 생성된 역할 정보를 담아 성공 결과를 반환한다", async () => {
        mockedCreateRole.mockResolvedValue({
            message: "역할을 생성했습니다.",
            data: { roleId: 9 },
        });
        const formData = buildFormData({
            name: "조교",
            description: "보조 업무",
            color: "#2C8D50",
        });

        const result = await createRoleAction(emptyState, formData);

        expect(mockedCreateRole).toHaveBeenCalledWith({
            name: "조교",
            description: "보조 업무",
            color: "#2C8D50",
        });
        expect(result).toEqual({
            success: true,
            message: "역할을 생성했습니다.",
            data: { roleId: 9 },
        });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        mockedCreateRole.mockRejectedValue(new Error("역할 생성에 실패했습니다."));
        const formData = buildFormData({ name: "조교", description: "", color: "" });

        const result = await createRoleAction(emptyState, formData);

        expect(result).toEqual({
            success: false,
            message: "역할 생성에 실패했습니다.",
        });
    });
});

describe("changeRoleAction", () => {
    it("역할 번호가 올바르지 않으면 실패 결과를 반환한다", async () => {
        const formData = buildFormData({ name: "조교", description: "", color: "" });

        const result = await changeRoleAction(0, emptyState, formData);

        expect(result).toEqual({ success: false, message: "역할 번호가 올바르지 않습니다." });
        expect(mockedChangeRole).not.toHaveBeenCalled();
    });

    it("역할 이름이 비어있으면 실패 결과를 반환한다", async () => {
        const formData = buildFormData({ name: " ", description: "", color: "" });

        const result = await changeRoleAction(1, emptyState, formData);

        expect(result).toEqual({
            success: false,
            message: "역할 이름은 1자 이상 50자 이하로 입력해주세요.",
        });
        expect(mockedChangeRole).not.toHaveBeenCalled();
    });

    it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
        mockedChangeRole.mockResolvedValue(undefined);
        const formData = buildFormData({
            name: "조교",
            description: "보조 업무",
            color: "#2C8D50",
        });

        const result = await changeRoleAction(1, emptyState, formData);

        expect(mockedChangeRole).toHaveBeenCalledWith(1, {
            name: "조교",
            description: "보조 업무",
            color: "#2C8D50",
        });
        expect(result).toEqual({ success: true, message: "역할을 수정했습니다." });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        mockedChangeRole.mockRejectedValue(new Error("역할 수정에 실패했습니다."));
        const formData = buildFormData({ name: "조교", description: "", color: "" });

        const result = await changeRoleAction(1, emptyState, formData);

        expect(result).toEqual({
            success: false,
            message: "역할 수정에 실패했습니다.",
        });
    });
});

describe("deleteRoleAction", () => {
    it("역할 번호가 올바르지 않으면 실패 결과를 반환한다", async () => {
        const result = await deleteRoleAction(0);

        expect(result).toEqual({ success: false, message: "역할 번호가 올바르지 않습니다." });
        expect(mockedDeleteRole).not.toHaveBeenCalled();
    });

    it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
        mockedDeleteRole.mockResolvedValue(undefined);

        const result = await deleteRoleAction(1);

        expect(mockedDeleteRole).toHaveBeenCalledWith(1);
        expect(result).toEqual({ success: true, message: "역할을 삭제했습니다." });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        mockedDeleteRole.mockRejectedValue(new Error("역할 삭제에 실패했습니다."));

        const result = await deleteRoleAction(1);

        expect(result).toEqual({
            success: false,
            message: "역할 삭제에 실패했습니다.",
        });
    });
});

describe("changeRolePermissionsAction", () => {
    it("역할 번호가 올바르지 않으면 실패 결과를 반환한다", async () => {
        const formData = buildFormData({});
        formData.append("permissionCodes", "ACCOUNT:CREATE");

        const result = await changeRolePermissionsAction(0, emptyState, formData);

        expect(result).toEqual({ success: false, message: "역할 번호가 올바르지 않습니다." });
        expect(mockedChangeRolePermissions).not.toHaveBeenCalled();
    });

    it("권한 코드 중 빈 값이 있으면 실패 결과를 반환한다", async () => {
        const formData = new FormData();
        formData.append("permissionCodes", "ACCOUNT:CREATE");
        formData.append("permissionCodes", "");

        const result = await changeRolePermissionsAction(1, emptyState, formData);

        expect(result).toEqual({ success: false, message: "권한 코드가 올바르지 않습니다." });
        expect(mockedChangeRolePermissions).not.toHaveBeenCalled();
    });

    it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
        mockedChangeRolePermissions.mockResolvedValue(undefined);
        const formData = new FormData();
        formData.append("permissionCodes", "ACCOUNT:CREATE");
        formData.append("permissionCodes", "ACCOUNT:DELETE");

        const result = await changeRolePermissionsAction(1, emptyState, formData);

        expect(mockedChangeRolePermissions).toHaveBeenCalledWith(1, {
            permissionCodes: ["ACCOUNT:CREATE", "ACCOUNT:DELETE"],
        });
        expect(result).toEqual({ success: true, message: "역할 권한을 저장했습니다." });
    });

    it("선택한 권한이 없으면 빈 배열로 service를 호출한다", async () => {
        mockedChangeRolePermissions.mockResolvedValue(undefined);
        const formData = new FormData();

        const result = await changeRolePermissionsAction(1, emptyState, formData);

        expect(mockedChangeRolePermissions).toHaveBeenCalledWith(1, { permissionCodes: [] });
        expect(result).toEqual({ success: true, message: "역할 권한을 저장했습니다." });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        mockedChangeRolePermissions.mockRejectedValue(
            new Error("역할 권한 조립에 실패했습니다."),
        );
        const formData = new FormData();
        formData.append("permissionCodes", "ACCOUNT:CREATE");

        const result = await changeRolePermissionsAction(1, emptyState, formData);

        expect(result).toEqual({
            success: false,
            message: "역할 권한 조립에 실패했습니다.",
        });
    });
});
