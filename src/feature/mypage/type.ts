export interface MyPageApiResponse<T> {
    status: number;
    code: string;
    message: string;
    data: T;
}

export type MyPageAccountStatus = "ACTIVE" | "RESIGNED" | "INACTIVE";

export interface MyProfileData {
    userId: number;
    name: string;
    email: string | null;
    phone: string | null;
    roleId: number | null;
    roleName: string | null;
    joinedAt: string;
    status: MyPageAccountStatus;
}

export interface UpdateMyProfileRequest {
    phone?: string;
    email?: string;
}

export interface ChangeMyPasswordRequest {
    currentPassword: string;
    newPassword: string;
}

export type MyProfileResponse = MyPageApiResponse<MyProfileData>;
