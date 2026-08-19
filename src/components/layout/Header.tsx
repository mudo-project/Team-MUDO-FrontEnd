import { Menu, Search } from "lucide-react";
import OpenSidebar from "./OpenSidebar";
import HeaderTitle from "./HeaderTitle";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

export default function Header() {
    return (
        <header className="flex h-13 w-full items-center border-b border-[#D7E8DB] bg-white px-5 text-[#0F172A]">
            <OpenSidebar />
            <HeaderTitle />

            <span className="ml-auto text-[12px] text-[#64748B]">{format(new Date(), 'yyyy년 MM월 dd일 E요일', { locale: ko })}</span>
        </header>
    );
}
