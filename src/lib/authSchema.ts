import * as z from 'zod';

export const authSchema = z.object({
    email: z
        .email({ message: '올바른 이메일 형식이 아닙니다.' }),
    username: z
        .string()
        .min(2, { message: '아이디는 2자 이상 50자 이하여야 합니다.' })
        .max(50, { message: '아이디는 2자 이상 50자 이하여야 합니다.' }),
    name: z
        .string()
        .min(1, { message: '이름을 입력해 주세요.' }),
    roleId: z
        .coerce.number().int().min(0, "존재하지 않는 값입니다."),
    phone: z
        .string()
        .regex(/^\d{3}-\d{4}-\d{4}$/, { message: '전화번호 형식이 맞지 않습니다. (예: 010-1234-5678)' }),
})


export type authFormInput = z.input<typeof authSchema>;
export type authFormValues = z.output<typeof authSchema>;
