interface LoginRequest {
    username: string;
    password: string;
}

interface LoginResponse {
    data: {
        accessToken: string;
    }
}