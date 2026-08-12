import { getMyProfileAction } from "@/feature/mypage/actions";
import MyInfo from "@/feature/mypage/components/MyInfo";
import MyPassword from "@/feature/mypage/components/MyPassword";

export default async function Page() {
    const response = await getMyProfileAction();

    if (!response.success || !response.data) {
        return (
            <div>{response.message}</div>
        )
    }

    return (
        <section className="p-10">
            <div className="flex w-full items-center gap-3.5">
                <div>
                    <h2 className="text-[18px] font-bold leading-[27px] text-[#0F172A]">{response.data.name}</h2>
                    <p className="pt-0.5 text-[13px] leading-[19.5px] text-[#64748B]">{response.data.roleName ?? '역할 없음'}</p>
                </div>
            </div>

            <div className="my-5 h-px w-full bg-[#D7E8DB]" />

            <section className="grid grid-cols-3 gap-2 ">
                <MyInfo profile={response.data} />
                <MyPassword />
            </section>
        </section>
    )
}