'use client'
import { getUserListAction } from "@/feature/auth/actions";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

interface ApprovalLine {
    stepOrder: number;
    approverId: number | "";
}

const approverOptions = [
    { id: 1, name: "김지수", role: "원장" },
    { id: 2, name: "이민준", role: "강사" },
    { id: 3, name: "박서연", role: "직원" },
];


export default function ApprovalLineItem({ line, removeApprovalLine, changeApprover }: { line: ApprovalLine, removeApprovalLine: (stepOrder: number) => void, changeApprover: (stepOrder: number, approverId: number | "") => void }) {

    const [userList, setUserList] = useState<{
        loading: boolean;
        error: string;
        data: UserListResponse[];
    }>({
        loading: true,
        error: '',
        data: []
    })

    useEffect(() => {
        const getUserList = async () => {

            const response = await getUserListAction();
            setUserList({
                loading: false,
                error: response.success ? '' : response.message,
                data: response.data ?? []
            })
        }

        getUserList();
    }, [])

    return (
        <div
            className="mb-1.5 flex h-[30px] w-full items-center gap-2"
        >
            <span className="w-7 shrink-0 text-[11px] font-normal leading-[16.5px] text-[#B0B8C1]">
                {line.stepOrder}차
            </span>
            <div className="relative flex h-[30px] w-full items-center rounded-[7px] border border-[#D7E8DB] bg-white">
                <select
                    aria-label={`${line.stepOrder}차 결재자`}
                    className="h-full w-full appearance-none bg-transparent px-3.5 pr-8 text-[12px] font-normal text-[#0F172A] focus:outline-none"
                    name="approverIds"
                    onChange={(event) =>
                        changeApprover(
                            line.stepOrder,
                            Number(event.target.value),
                        )
                    }
                    value={line.approverId}
                >
                    <option hidden disabled value="">결재자를 선택해 주세요</option>
                    {userList.data.map((user: UserListResponse) => (
                        <option key={user.userId} value={user.userId}>
                            {user.name} ({user.username})
                        </option>
                    ))}
                </select>
                <ChevronDown
                    className="pointer-events-none absolute right-2 size-3 text-[#0F172A]"
                    strokeWidth={2}
                />
            </div>
            <button
                aria-label={`${line.stepOrder}차 결재자 삭제`}
                className="flex w-2.5 shrink-0 items-center justify-center text-[14px] font-normal leading-[21px] text-[#C0C8D0]"
                onClick={() => removeApprovalLine(line.stepOrder)}
                type="button"
            >
                ×
            </button>
        </div>
    )
}