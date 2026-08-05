'use client'

import { Check, X } from "lucide-react"
import { useState } from "react"

const group = {
    permissions: [
        { name: "구성원 초대", description: "새 구성원을 학원에 초대할 수 있습니다." },
        { name: "구성원 내보내기", description: "기존 구성원을 내보낼 수 있습니다." },
        { name: "역할 관리", description: "역할을 생성, 수정, 삭제하고 구성원에게 지정할 수 있습니다." },
    ]
}

export default function AuthoritySelectGroup() {
    const [checkList, setCheckList] = useState<boolean[]>([]);

    return (
        <section className="w-full" >
            <div className="flex justify-between items-center pr-7">
                <h2 className="px-6 pt-4 pb-2 text-[11px] font-bold leading-[16.5px] tracking-[0.88px] text-[#64748B]">
                    제목
                </h2>
                <label htmlFor="allSelect" className="text-[10px] text-[#64748B] font-normal">
                    전체 선택
                    <input type="checkbox" id="allSelect" hidden />
                </label>
            </div>
            {group.permissions.map((permission) => (
                <label
                    htmlFor={permission.name}
                    className="flex min-h-[73px] w-full items-center gap-4 border-b border-[#FCFCFC] px-6 py-3.5 last:border-b-0"
                    key={permission.name}
                >
                    <div className="w-full">
                        <h3 className="text-[14px] font-semibold leading-[21px] text-[#0F172A]">
                            {permission.name}
                        </h3>
                        <p className="pt-1 text-[13px] font-normal leading-[19.5px] text-[#64748B]">
                            {permission.description}
                        </p>
                    </div>
                    <div
                        className={`flex size-10 shrink-0 items-center justify-center rounded-full bg-[#EDF0F4] text-[#64748B] has-checked:bg-[#2C8D50] has-checked:text-white`}
                    >
                        <input type="checkbox" id={permission.name} className="peer hidden" />

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
    )
}