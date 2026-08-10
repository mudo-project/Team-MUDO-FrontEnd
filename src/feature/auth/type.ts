interface AuthApiResponse<T> {
    status: number;
    code: string;
    message: string;
    data: T;
}

interface LoginRequest {
    username: string;
    password: string;
}

type LoginResponse = AuthApiResponse<AccessTokenData>;

interface AccessTokenData {
    accessToken: string;
}

type LogoutResponse = AuthApiResponse<null>;

type ReissueAccessTokenResponse = AuthApiResponse<AccessTokenData>;

interface UserListResponse {
    userId: number;
    name: string;
    username: string;
}

type UserListApiResponse<T> = AuthApiResponse<T>;

interface PermissionData {
    permissionId: number;
    code: string;
    resource: string;
    action: string;
    description: string;
}

type PermissionCatalogResponse = AuthApiResponse<PermissionData[]>;

interface RoleListData {
    roleId: number;
    name: string;
    description: string | null;
    color: string | null;
    memberCount: number;
}

type RoleListResponse = AuthApiResponse<RoleListData[]>;

interface RoleDetailData extends RoleListData {
    permissionCodes: string[];
}

type RoleDetailResponse = AuthApiResponse<RoleDetailData>;

interface CreateRoleRequest {
    name: string;
    description?: string;
    color?: string;
}

interface CreateRoleData {
    roleId: number;
}

type CreateRoleResponse = AuthApiResponse<CreateRoleData>;

interface ChangeRoleRequest {
    name: string;
    description?: string;
    color?: string;
}

interface ChangeRolePermissionsRequest {
    permissionCodes: string[];
}

interface CreateEmployeeAccountRequest {
    username: string;
    name: string;
    phone: string;
    email: string;
    roleId: number;
}

interface CreateEmployeeAccountData {
    userId: number;
    username: string;
    temporaryPassword: string;
}

type CreateEmployeeAccountResponse =
    AuthApiResponse<CreateEmployeeAccountData>;

interface ChangeEmployeeRoleRequest {
    roleId: number;
}
