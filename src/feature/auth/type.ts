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
    mustChangePw: boolean;
    permissions: string[];
}

type LogoutResponse = AuthApiResponse<null>;

type ReissueAccessTokenResponse = AuthApiResponse<AccessTokenData>;

interface UserListResponse {
    userId: number;
    name: string;
    username: string;
}

type UserListApiResponse<T> = AuthApiResponse<T>;

interface MyPermissionListData {
    permissions: string[];
}

type MyPermissionListResponse = AuthApiResponse<MyPermissionListData>;
