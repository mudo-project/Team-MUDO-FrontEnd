import { getRoleDetailAction } from "@/feature/role/actions";
import AuthoritySelectForm from "./AuthoritySelectForm";
import AuthoritySelectList from "./AuthoritySelectList";

export default async function AuthoritySelect({ roleId }: { roleId?: number }) {
    if (!roleId) {
        return (
            <div className="flex h-full w-full items-center justify-center px-6 py-10">
                <p className="text-center text-[14px] font-normal leading-[21px] text-[#64748B]">
                    역할을 생성해주세요
                </p>
            </div>
        );
    }

    const response = await getRoleDetailAction(roleId);

    if (!response.success || !response.data) {
        return (
            <div className="flex h-full w-full items-center justify-center px-6 py-10">
                <p className="text-center text-[14px] font-normal leading-[21px] text-[#64748B]" role="alert">
                    {response.message}
                </p>
            </div>
        );
    }

    const role: RoleDetailData = response.data;

    return (
        <AuthoritySelectForm role={role}>
            <AuthoritySelectList role={role} />
        </AuthoritySelectForm>
    );
}
