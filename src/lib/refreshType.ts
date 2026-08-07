export type ReissueResponse = {
    status: number;
    code: string;
    message: string;
    data: {
        accessToken: string;
    };
};