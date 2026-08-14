import { getPermissionCatalogAction } from "@/feature/role/actions";
import AuthoritySelectGroup from "./AuthoritySelectGroup";

export default async function AuthoritySelectList({ role }: { role: RoleDetailData }) {
    const response = await getPermissionCatalogAction();

    if (!response.success) {
        return (
            <div className="flex h-full w-full items-center justify-center px-6 py-10">
                <p className="text-center text-[13px] leading-[19.5px] text-[#64748B]" role="alert">
                    {response.message}
                </p>
            </div>
        );
    }

    if (!response.data?.length) {
        return (
            <div className="flex h-full w-full items-center justify-center px-6 py-10">
                <p className="text-center text-[13px] leading-[19.5px] text-[#64748B]">
                    조회된 권한이 없습니다.
                </p>
            </div>
        );
    }

    const permissionGroups = Object.values(
        response.data.reduce<Record<string, PermissionData[]>>(
            (grouped, permission) => {
                if (!grouped[permission.resource]) {
                    grouped[permission.resource] = [];
                }

                grouped[permission.resource].push(permission);
                return grouped;
            },
            {},
        ),
    );

    return (
        <div className="md:h-[calc(100%-123px)] w-full md:overflow-y-auto py-2 scrollbar-hide">
            {!response.success && (
                <p className="text-center text-[13px] leading-[19.5px] text-[#64748B]" role="alert">
                    {response.message}
                </p>
            )}
            {permissionGroups.map((group) => (
                <AuthoritySelectGroup
                    group={group}
                    key={`${role.roleId}-${group[0].resource}`}
                    role={role}
                />
            ))}
        </div>
    );
}
