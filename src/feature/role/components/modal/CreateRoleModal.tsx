import { Check, X } from "lucide-react";

const roleColors = [
    "bg-[#2C8D50]",
    "bg-[#3E7D62]",
    "bg-[#E8A838]",
    "bg-[#9B59B6]",
    "bg-[#1AADA4]",
    "bg-[#E67E22]",
    "bg-[#C0483F]",
    "bg-[#607D8B]",
];

export default function CreateRoleModal() {
    return (
        <div className="fixed top-0 left-0 z-999 h-screen w-screen bg-[#162236]/45">
            <form className="fixed top-1/2 left-1/2 z-1000 w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-[12px] bg-white p-6 shadow-[0_8px_12px_rgba(22,34,54,0.12)]">
                <div className="flex h-[27px] w-full items-center">
                    <h2 className="text-[18px] font-bold leading-[27px] text-[#0F172A]">
                        새 역할 만들기
                    </h2>
                    <button
                        aria-label="새 역할 만들기 모달 닫기"
                        className="ml-auto flex size-[18px] items-center justify-center text-[#64748B]"
                        type="button"
                    >
                        <X className="size-[18px]" strokeWidth={1.5} />
                    </button>
                </div>

                <div className="mt-5 w-full">
                    <label
                        className="block pb-1.5 text-[13px] font-medium leading-[19.5px] text-[#0F172A]"
                        htmlFor="role-name"
                    >
                        역할 이름
                    </label>
                    <input
                        className="h-11 w-full rounded-[8px] border border-[#D7E8DB] px-3 text-[14px] font-normal text-[#0F172A] placeholder:text-[#0F172A]/50 focus:outline-none"
                        id="role-name"
                        name="name"
                        placeholder="예: 재무행정, 조교"
                    />
                </div>

                <fieldset className="mt-5 w-full">
                    <legend className="text-[13px] font-medium leading-[19.5px] text-[#0F172A]">
                        역할 색상
                    </legend>
                    <div className="flex w-full gap-2 pt-2.5">
                        {roleColors.map((color, index) => (
                            <button
                                aria-label={`역할 색상 ${index + 1}`}
                                className={`flex size-7 items-center justify-center rounded-full ${color}`}
                                key={color}
                                type="button"
                            >
                                {index === 0 && <Check className="size-3.5 text-white" strokeWidth={2.5} />}
                            </button>
                        ))}
                    </div>
                </fieldset>

                <div className="mt-5 flex w-full justify-end gap-2">
                    <button
                        className="h-11 rounded-[8px] border border-[#D7E8DB] bg-white px-5 text-[14px] font-normal leading-[21px] text-[#0F172A]"
                        type="button"
                    >
                        취소
                    </button>
                    <button
                        className="h-11 rounded-[8px] bg-[#D7E8DB] px-5 text-[14px] font-semibold leading-[21px] text-[#64748B]"
                        type="submit"
                    >
                        만들기
                    </button>
                </div>
            </form>
        </div>
    );
}
