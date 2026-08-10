interface MembersApiResponse<T> {
    status: number;
    code: string;
    message: string;
    data: T;
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
    MembersApiResponse<CreateEmployeeAccountData>;

interface ChangeEmployeeRoleRequest {
    roleId: number;
}
