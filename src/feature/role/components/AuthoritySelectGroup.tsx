"use client";

import { Check, X } from "lucide-react";
import { useState } from "react";

type Permission = {
    permissionId: number;
    code: string;
    resource: string;
    action: string;
    description: string;
};

interface AuthoritySelectGroupProps {
    group: Permission[];
    role: RoleDetailData;
}

export default function AuthoritySelectGroup({ group, role }: AuthoritySelectGroupProps) {
    const [selectedCodes, setSelectedCodes] = useState(
        () => new Set(role.permissionCodes ?? []),
    );
    const resource = group[0].resource;
    const selectedCount = group.filter((permission) =>
        selectedCodes.has(permission.code),
    ).length;
    const isAllSelected = selectedCount === group.length;
    const isPartiallySelected = selectedCount > 0 && !isAllSelected;

    const toggleResource = (checked: boolean) => {
        setSelectedCodes((current) => {
            const next = new Set(current);

            group.forEach((permission) => {
                if (checked) {
                    next.add(permission.code);
                } else {
                    next.delete(permission.code);
                }
            });

            return next;
        });
    };

    const togglePermission = (code: string, checked: boolean) => {
        setSelectedCodes((current) => {
            const next = new Set(current);

            if (checked) {
                next.add(code);
            } else {
                next.delete(code);
            }

            return next;
        });
    };

    return (
        <section className="w-full">
            <div className="flex justify-between items-center pr-7">
                <h2 className="px-6 pt-4 pb-2 text-[11px] font-bold leading-[16.5px] tracking-[0.88px] text-[#64748B]">
                    {resource}
                </h2>
                <label htmlFor={`resource-${resource}`} className="text-[10px] text-[#64748B] font-normal">
                    전체 선택
                    <input
                        checked={isAllSelected}
                        className="sr-only"
                        id={`resource-${resource}`}
                        onChange={(event) => toggleResource(event.target.checked)}
                        ref={(element) => {
                            if (element) {
                                element.indeterminate = isPartiallySelected;
                            }
                        }}
                        type="checkbox"
                    />
                </label>
            </div>
            {group.map((permission) => (
                <label
                    htmlFor={permission.code}
                    className="flex min-h-[73px] w-full items-center gap-4 border-b border-[#FCFCFC] px-6 py-3.5 last:border-b-0"
                    key={permission.code}
                >
                    <div className="w-full">
                        <h3 className="text-[14px] font-semibold leading-[21px] text-[#0F172A]">
                            {permission.code}
                        </h3>
                        <p className="pt-1 text-[13px] font-normal leading-[19.5px] text-[#64748B]">
                            {permission.description}
                        </p>
                    </div>
                    <div
                        className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-[#EDF0F4] text-[#64748B] has-checked:bg-[#2C8D50] has-checked:text-white"
                    >
                        <input
                            checked={selectedCodes.has(permission.code)}
                            className="peer absolute inset-0 size-full cursor-pointer opacity-0"
                            id={permission.code}
                            name="permissionCodes"
                            onChange={(event) =>
                                togglePermission(permission.code, event.target.checked)
                            }
                            type="checkbox"
                            value={permission.code}
                        />

                        <div className="hidden peer-checked:block">
                            <Check className="size-4 " strokeWidth={1.7} />
                        </div>
                        <div className="block peer-checked:hidden">
                            <X className="size-3.5" strokeWidth={1.5} />
                        </div>

                    </div>
                </label>
            ))}
        </section>
    );
}
