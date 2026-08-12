import { z } from "zod";

export const myPasswordSchema = z
    .object({
        currentPassword: z.string().min(1, "현재 비밀번호를 입력해주세요.").max(100, "현재 비밀번호는 100자 이하로 입력해주세요."),
        newPassword: z.string().min(8, "새 비밀번호는 8자 이상 입력해주세요.").max(100, "새 비밀번호는 100자 이하로 입력해주세요."),
        confirmPassword: z.string().min(1, "새 비밀번호 확인을 입력해주세요."),
    })
    .refine(({ currentPassword, newPassword }) => currentPassword !== newPassword, {
        message: "현재 비밀번호와 다른 비밀번호를 입력해주세요.",
        path: ["newPassword"],
    })
    .refine(({ newPassword, confirmPassword }) => newPassword === confirmPassword, {
        message: "새 비밀번호가 일치하지 않습니다.",
        path: ["confirmPassword"],
    });

export type MyPasswordFormValues = z.infer<typeof myPasswordSchema>;
