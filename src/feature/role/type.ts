interface RoleApiResponse<T> {
    status: number;
    code: string;
    message: string;
    data: T;
}

interface PermissionData {
    permissionId: number;
    code: string;
    resource: string;
    action: string;
    description: string;
}

type PermissionCatalogResponse = RoleApiResponse<PermissionData[]>;

interface RoleListData {
    roleId: number;
    name: string;
    description: string | null;
    color: string | null;
    memberCount: number;
}

type RoleListResponse = RoleApiResponse<RoleListData[]>;

interface RoleDetailData extends RoleListData {
    permissionCodes: string[];
}

type RoleDetailResponse = RoleApiResponse<RoleDetailData>;

interface CreateRoleRequest {
    name: string;
    description?: string;
    color?: string;
}

interface CreateRoleData {
    roleId: number;
}

type CreateRoleResponse = RoleApiResponse<CreateRoleData>;

interface ChangeRoleRequest {
    name: string;
    description?: string;
    color?: string;
}

interface ChangeRolePermissionsRequest {
    permissionCodes: string[];
}
