import Link from "next/link";

export default function MemberStateFilter({ state }: { state: string }) {

    const activeClass = `leading-9 h-[34px] rounded-[6px] px-3.5 bg-white font-semibold shadow-[0_1px_1.5px_rgba(22,34,54,0.08)]`
    const noneActiveClass = `leading-9 h-[34px] rounded-[6px] px-3.5 text-[#64748B]`

    return (
        <div className="hidden sm:flex flex h-10 shrink-0 items-center gap-1 rounded-[8px] bg-[#EDF0F4] p-[3px] text-[13px]">
            <Link href={'/members?state=all'} className={`${state === 'all' ? activeClass : noneActiveClass}`}>전체</Link>
            <Link href={'/members?state=employ'} className={`${state === 'employ' ? activeClass : noneActiveClass}`}>재직</Link>
            <Link href={'/members?state=unemploy'} className={`${state === 'unemploy' ? activeClass : noneActiveClass}`}>비활성</Link>
        </div>
    )
}