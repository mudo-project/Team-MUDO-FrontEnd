import { logoutAction } from "@/feature/auth/actions";
import { useUserStore } from "@/store/useUserStore";
import { LogOut, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

export default function MyMenu({ setIsProfileMenuOpen }: { setIsProfileMenuOpen: Dispatch<SetStateAction<boolean>> }) {
    const clearUser = useUserStore((state) => state.clearUser);
    const clearPermissions = useUserStore((state) => state.clearPermissions);
    const router = useRouter();


    const handleLogout = async () => {
        const response = await logoutAction();

        if (!response.success) {
            toast.error(response.message);
            return;
        }

        clearPermissions();
        clearUser();
        toast.success('로그아웃되었습니다')
        router.push("/auth");
        router.refresh();
    };

    return (
        <div className="absolute right-2 bottom-[58px] w-[203px] overflow-hidden rounded-[12px] bg-white py-1 shadow-[0_8px_16px_rgba(22,34,54,0.18)]">
            <Link
                className="flex h-11 items-center gap-3 px-4 text-[14px] text-[#0F172A] hover:bg-[#F2F8F4]"
                href="/mypage"
                onClick={() => setIsProfileMenuOpen(false)}
            >
                <User className="size-4" strokeWidth={1.8} />
                마이페이지
            </Link>
            <button
                className="flex h-11 w-full items-center gap-3 px-4 text-left text-[14px] text-[#0F172A] hover:bg-[#F2F8F4]"
                onClick={handleLogout}
                type="button"
            >
                <LogOut className="size-4" strokeWidth={1.8} />
                로그아웃
            </button>
        </div>
    )
}