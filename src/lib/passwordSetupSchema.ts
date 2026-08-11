import { z } from "zod";

export const passwordSetupSchema = z
    .object({
        newPassword: z
            .string()
            .min(8, "비밀번호는 8자 이상 입력해주세요.")
            .max(100, "비밀번호는 100자 이하로 입력해주세요."),
        confirmPassword: z
            .string()
            .min(1, "비밀번호 확인을 입력해주세요."),
    })
    .refine(({ newPassword, confirmPassword }) => newPassword === confirmPassword, {
        message: "비밀번호가 일치하지 않습니다.",
        path: ["confirmPassword"],
    });

export type PasswordSetupFormValues = z.infer<typeof passwordSetupSchema>;
