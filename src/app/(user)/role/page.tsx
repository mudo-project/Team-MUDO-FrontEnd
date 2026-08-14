import AuthoritySelect from "@/feature/role/components/AuthoritySelect";
import RoleCreateButton from "@/feature/role/components/RoleCreateButton";
import RoleItem from "@/feature/role/components/RoleItem";
import { getRoleListAction } from "@/feature/role/actions";

interface RolePageProps {
    searchParams: Promise<{ roleId?: string }>;
}

export default async function Page({ searchParams }: RolePageProps) {
    const response = await getRoleListAction();
    const roles = response.data ?? [];
    const { roleId } = await searchParams;
    const requestedRoleId = Number(roleId);
    const selectedRoleId = roles.some((role) => role.roleId === requestedRoleId)
        ? requestedRoleId
        : roles[0]?.roleId;

    return (
        <main className="h-[calc(100dvh-52px)] w-full overflow-auto md:overflow-hidden bg-[#FCFCFC] px-8 py-7">
            <div className="flex flex-col md:flex-row h-full w-full items-start gap-6">
                <aside className="w-full mb-10 md:w-[240px] shrink-0">
                    <div className="flex h-[36px] w-full items-start border-b border-transparent pb-2">
                        <h2 className="text-[13px] font-semibold leading-[19.5px] tracking-[0.78px] text-[#64748B]">
                            역할
                        </h2>
                        <RoleCreateButton />
                    </div>

                    <nav className="mt-1 w-full overflow-auto scrollbar-hide h-full">
                        {!response.success && (
                            <p className="mt-10 text-center text-[14px] font-normal leading-[21px] text-[#64748B]" role="alert">
                                {response.message}
                            </p>
                        )}
                        {roles.length > 0 ? (
                            roles.map((role) => (
                                <RoleItem
                                    isSelected={role.roleId === selectedRoleId}
                                    key={role.roleId}
                                    role={role}
                                />
                            ))
                        ) : (
                            <p className="mt-10 text-center text-[14px] font-normal leading-[21px] text-[#64748B]">
                                생성된 역할이 없습니다
                            </p>
                        )}
                    </nav>
                </aside>

                <section className="h-full w-full md:overflow-hidden rounded-[12px] md:border md:border-[#D7E8DB] md:bg-white">
                    {/* <div className="h-full flex justify-center items-center text-[14px] text-center leading-[21px] text-[#64748B] font-normal">
                        생성된 역할이 없습니다
                    </div> */}
                    <AuthoritySelect roleId={selectedRoleId} />
                </section>
            </div>
        </main>
    );
}
