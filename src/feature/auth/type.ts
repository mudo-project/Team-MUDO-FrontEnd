interface LoginRequest {
    username: string;
    password: string;
}

interface LoginResponse {
    data: {
        accessToken: string;
    }
}

interface UserListResponse {
    userId: number;
    name: string;
    username: string;
}

interface UserListApiResponse<T> {
    status: number;
    code: string;
    message: string;
    data: T;
}

