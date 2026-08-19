'use client'

import useModal from "@/components/hooks/useModal";
import { MemberAttendanceStatus, MemberListData } from "../type";
import ViewMembersModal from "./modal/ViewMembersModal";
import { format } from "date-fns";

const attendanceStatus = {
    PRESENT: { label: "출근", className: "bg-[#EAF5EE] text-[#246B40]" },
    ABSENT: { label: "미출근", className: "bg-[#F1F3F5] text-[#9AA2AE]" },
    OFF: { label: "휴무", className: "bg-[#F1F3F5] text-[#9AA2AE]" },
    LEAVE: { label: "휴가", className: "bg-[#ECFDF3] text-[#22A559] ring-1 ring-inset ring-[#B7E9C8]" },
} satisfies Record<MemberAttendanceStatus, { label: string; className: string }>;

export default function MemberItem({ member }: { member: MemberListData }) {
    const modal = useModal();

    const status = member.attendanceStatus
        ? attendanceStatus[member.attendanceStatus]
        : { label: "-", className: "bg-[#F1F3F5] text-[#9AA2AE]" };

    return (
        <>
            <button onClick={modal.openModal} className="w-full text-start grid h-16 grid-cols-5 items-center border-t border-[#D7E8DB] px-3 sm:px-4 md:px-5 text-[12px] text-[#64748B] sm:grid-cols-7">
                <div className="col-span-3 flex min-w-0 items-center gap-3">
                    <span className="hidden size-7 shrink-0 items-center justify-center rounded-full bg-[#EAF5EE] text-[8px] font-semibold text-[#246B40] md:flex">
                        {member.name.slice(0, 1)}
                    </span>
                    <span className="min-w-0">
                        <strong className="block truncate text-[13px] font-semibold leading-[18px] text-[#0F172A]">{member.name}</strong>
                        <span className="block truncate text-[10px] leading-[15px] text-[#94A3B8]">{member.email}</span>
                    </span>
                </div>
                <span className="col-span-1 text-[11px] sm:text-[12px]">{member.roleName ?? "-"}</span>
                <span className="col-span-1 text-[11px] sm:text-[12px]">{member.phone}</span>
                <span className="col-span-1 hidden sm:block">{format(member.joinedAt, 'yyyy-MM-dd')}</span>
                <span className="col-span-1 hidden sm:block">
                    <span className={`inline-flex min-h-5 items-center rounded-full px-2 text-[10px] font-semibold ${status.className}`}>
                        {status.label}
                    </span>
                </span>
            </button>
            {modal.isModal &&
                <ViewMembersModal
                    closeModal={modal.closeModal}
                    member={member}
                />
            }
        </>
    );
}
