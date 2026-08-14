"use client";

import {
    changeRolePermissionsAction,
    RoleActionResult,
} from "@/feature/role/actions";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode, useActionState, useEffect } from "react";
import { toast } from "sonner";

interface AuthoritySelectFormProps {
    children: ReactNode;
    role: RoleDetailData;
}

const initialState: RoleActionResult = {
    success: false,
    message: "",
};

export default function AuthoritySelectForm({
    children,
    role,
}: AuthoritySelectFormProps) {
    const router = useRouter();
    const actionWithRoleId = changeRolePermissionsAction.bind(null, role.roleId);
    const [state, formAction, isPending] = useActionState(
        actionWithRoleId,
        initialState,
    );

    useEffect(() => {
        if (!state.message) return;

        if (state.success) {
            toast.success(state.message);
            router.refresh();
            return;
        }

        toast.error(state.message);
    }, [state, router]);

    return (
        <form action={formAction} className="h-full w-full">
            <header className="w-full border-b border-[#D7E8DB] px-6 pt-5 pb-4">
                <div className="flex w-full items-center gap-3">
                    <span
                        className="size-3.5 rounded-full"
                        style={{ backgroundColor: role.color ?? "#0F172A" }}
                    />
                    <h1 className="text-[20px] font-bold leading-[30px] text-[#0F172A]">
                        {role.name}
                    </h1>
                    <button
                        className="ml-auto h-8 rounded-[6px] border border-[#D7E8DB] bg-white px-3 text-[12px] font-normal leading-[18px] text-[#64748B] disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={isPending}
                        type="submit"
                    >
                        {isPending ? "저장 중..." : "저장하기"}
                    </button>
                </div>
                <div className="mt-2 flex items-center gap-4 text-[13px] font-normal leading-[19.5px] text-[#64748B]">
                    {role.description && <span>{role.description}</span>}
                    <span>구성원 {role.memberCount}명</span>
                    <span>권한 {role.permissionCodes.length}개 활성</span>
                </div>
                {!state.success && state.message && (
                    <p className="pt-2 text-[12px] leading-[18px] text-[#C0483F]" role="alert">
                        {state.message}
                    </p>
                )}
            </header>

            {children}
        </form>
    );
}
