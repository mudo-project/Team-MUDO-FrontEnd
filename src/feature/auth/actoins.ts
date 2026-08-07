import { login } from "@/service/auth.service"

interface ActionState {
    success: boolean;
    message: string;
}


export const loginAction = async (prevState: ActionState, formData: FormData): Promise<ActionState> => {
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    if (!username.trim() || !password.trim()) {
        return {
            success: false,
            message: '아이디, 비밀번호를 입력해주세요'
        }
    }

    const payload: LoginRequest = { username, password }

    try {
        await login(payload)

        return {
            success: false,
            message: '로그인에 성공하였습니다'
        }
    } catch (error) {
        let errorMessage: string = '알 수 없는 오류입니다. 재시도해주세요.'
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return {
            success: false,
            message: errorMessage
        }
    }
}