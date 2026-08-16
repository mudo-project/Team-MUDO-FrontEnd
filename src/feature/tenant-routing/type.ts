export interface TenantEntryPointResponse {
    status: number;
    code: string;
    message: string;
    data: {
        code: string;
        apiHost: string;
    };
}
