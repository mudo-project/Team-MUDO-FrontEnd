export interface MembersApiResponse<T> {
    status: number;
    code: string;
    message: string;
    data: T;
}

export interface CreateEmployeeAccountRequest {
    username: string;
    name: string;
    phone: string;
    email: string;
    roleId: number;
}

export interface CreateEmployeeAccountData {
    userId: number;
    username: string;
    passwordSetupLink: string;
}

export type CreateEmployeeAccountResponse =
    MembersApiResponse<CreateEmployeeAccountData>;

export interface ChangeEmployeeRoleRequest {
    roleId: number;
}

export type MemberAccountStatus = "ACTIVE" | "RESIGNED" | "INACTIVE";
export type MemberAttendanceStatus = "PRESENT" | "ABSENT" | "OFF" | "LEAVE";

export interface MemberListParams {
    keyword?: string;
    roleId?: number;
    page?: number;
}

export interface MemberListData {
    userId: number;
    name: string;
    email: string;
    phone: string;
    roleId: number | null;
    roleName: string | null;
    joinedAt: string;
    status: MemberAccountStatus;
    attendanceStatus: MemberAttendanceStatus | null;
}

export interface MemberListPageData {
    content: MemberListData[];
    page: number;
    size: number;
    hasNext: boolean;
}

export type MemberListResponse = MembersApiResponse<MemberListPageData>;
